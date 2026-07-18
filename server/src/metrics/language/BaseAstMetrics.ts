import estraverse from "estraverse";

import type { LanguageAnalysisResult, LanguageMetricsProvider, RawStructuralData } from "../types";
import { countBlankLines } from "../utils";

const FUNCTION_TYPES = new Set(["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"]);
const CLASS_TYPES = new Set(["ClassDeclaration", "ClassExpression"]);
// Node types that add one level of nesting depth when entered.
const NESTING_TYPES = new Set([
  "IfStatement",
  "ForStatement",
  "ForInStatement",
  "ForOfStatement",
  "WhileStatement",
  "DoWhileStatement",
  "SwitchStatement",
  "TryStatement",
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
]);

interface FunctionContext {
  decisionPoints: number;
}

/**
 * Any parser producing an ESTree-compatible AST (espree for JS,
 * @typescript-eslint/parser for TS) can extend this — only `parse()`
 * differs between the two languages.
 */
export abstract class BaseAstMetrics implements LanguageMetricsProvider {
  abstract readonly language: string;

  protected abstract parse(sourceCode: string): any;

  analyze(sourceCode: string): LanguageAnalysisResult {
    const lines = sourceCode.split("\n");
    const totalLines = lines.length;
    const blankLines = countBlankLines(lines);
    const limitations: string[] = [];

    let ast: any;
    try {
      ast = this.parse(sourceCode);
    } catch {
      // A syntax error was already reported as a static-analysis finding
      // (Day 6) — metrics simply can't run on unparseable code. Returning a
      // documented empty result rather than throwing keeps the pipeline
      // moving (AI review still runs on the raw text regardless).
      limitations.push("Code could not be parsed; structural metrics and complexity are unavailable.");
      return {
        raw: { functions: [], classCount: 0, importCount: 0, maxNestingDepth: null, moduleLevelDecisionPoints: 0 },
        totalLines,
        blankLines,
        commentLines: countLineCommentsHeuristically(lines),
        complexityMethod: "ast",
        limitations,
      };
    }

    const commentLines = countAstComments(ast, lines);
    const raw = walkAst(ast);

    return { raw, totalLines, blankLines, commentLines, complexityMethod: "ast", limitations };
  }
}

/** Counts distinct source lines touched by any comment token the parser collected. */
function countAstComments(ast: any, lines: string[]): number {
  const comments: { type: string; loc: { start: { line: number }; end: { line: number } } }[] =
    ast.comments ?? [];
  const commentedLines = new Set<number>();
  for (const comment of comments) {
    for (let line = comment.loc.start.line; line <= comment.loc.end.line; line++) {
      commentedLines.add(line);
    }
  }
  return commentedLines.size > 0 ? commentedLines.size : countLineCommentsHeuristically(lines);
}

/** Fallback only used when the AST has no comment info at all (shouldn't normally happen with espree/typescript-eslint, which both collect comments by default). */
function countLineCommentsHeuristically(lines: string[]): number {
  return lines.filter((l) => l.trim().startsWith("//")).length;
}

function isDecisionPoint(node: any): boolean {
  if (node.type === "LogicalExpression") return node.operator === "&&" || node.operator === "||";
  if (node.type === "SwitchCase") return node.test !== null; // exclude `default`
  return [
    "IfStatement",
    "ForStatement",
    "ForInStatement",
    "ForOfStatement",
    "WhileStatement",
    "DoWhileStatement",
    "CatchClause",
    "ConditionalExpression",
  ].includes(node.type);
}

function walkAst(ast: any): RawStructuralData {
  const functions: { lineCount: number; complexity: number }[] = [];
  const functionStack: FunctionContext[] = [];
  let classCount = 0;
  let importCount = 0;
  let moduleLevelDecisionPoints = 0;
  let depth = 0;
  let maxDepth = 0;

  estraverse.traverse(ast, {
    fallback: "iteration",
    enter(node: any) {
      if (FUNCTION_TYPES.has(node.type)) {
        functionStack.push({ decisionPoints: 0 });
      } else if (CLASS_TYPES.has(node.type)) {
        classCount++;
      } else if (node.type === "ImportDeclaration") {
        importCount++;
      } else if (
        node.type === "CallExpression" &&
        node.callee?.type === "Identifier" &&
        node.callee.name === "require"
      ) {
        importCount++;
      }

      if (isDecisionPoint(node)) {
        if (functionStack.length > 0) {
          functionStack[functionStack.length - 1].decisionPoints++;
        } else {
          moduleLevelDecisionPoints++;
        }
      }

      if (NESTING_TYPES.has(node.type)) {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      }
    },
    leave(node: any) {
      if (NESTING_TYPES.has(node.type)) {
        depth--;
      }
      if (FUNCTION_TYPES.has(node.type)) {
        const ctx = functionStack.pop();
        const lineCount = (node.loc?.end?.line ?? 0) - (node.loc?.start?.line ?? 0) + 1;
        functions.push({ lineCount, complexity: 1 + (ctx?.decisionPoints ?? 0) });
      }
    },
  });

  return {
    functions,
    classCount,
    importCount,
    maxNestingDepth: maxDepth,
    moduleLevelDecisionPoints,
  };
}
