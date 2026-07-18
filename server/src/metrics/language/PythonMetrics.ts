import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { withTempFile } from "../../analyzers/utils/tempFile";
import type { LanguageAnalysisResult, LanguageMetricsProvider, RawStructuralData } from "../types";

const execFileAsync = promisify(execFile);
const RADON_TIMEOUT_MS = 10_000;
const MAX_BUFFER_BYTES = 5 * 1024 * 1024;

interface RadonRawMetrics {
  loc: number;
  blank: number;
  comments: number;
}

interface RadonCcEntry {
  type: "function" | "method" | "class";
  lineno: number;
  endline: number;
  complexity: number;
}

/** Very simple, explicitly documented heuristic — radon's raw metrics don't include an import count. */
function countImports(sourceCode: string): number {
  const importPattern = /^\s*(import\s+\S|from\s+\S+\s+import\s)/;
  return sourceCode.split("\n").filter((line) => importPattern.test(line)).length;
}

export class PythonMetrics implements LanguageMetricsProvider {
  readonly language = "python";

  async analyze(sourceCode: string): Promise<LanguageAnalysisResult> {
    const limitations: string[] = [
      "Maximum nesting depth is not computed for Python (no lightweight, dependency-free way to derive it from radon's output) — reported as unavailable rather than approximated.",
    ];

    return withTempFile(sourceCode, ".py", async (filePath) => {
      try {
        const [rawResult, ccResult] = await Promise.all([
          execFileAsync("radon", ["raw", "--json", filePath], {
            timeout: RADON_TIMEOUT_MS,
            maxBuffer: MAX_BUFFER_BYTES,
          }),
          execFileAsync("radon", ["cc", "--json", "-s", filePath], {
            timeout: RADON_TIMEOUT_MS,
            maxBuffer: MAX_BUFFER_BYTES,
          }),
        ]);

        const rawData = JSON.parse(rawResult.stdout) as Record<string, RadonRawMetrics>;
        const ccData = JSON.parse(ccResult.stdout) as Record<string, RadonCcEntry[]>;

        const raw = rawData[filePath];
        const entries = ccData[filePath] ?? [];

        // Top-level entries already include every method separately from
        // its class (radon also nests methods inside the class entry's
        // `methods` array) — only counting top-level avoids double-counting.
        const functions = entries
          .filter((e) => e.type === "function" || e.type === "method")
          .map((e) => ({
            lineCount: e.endline - e.lineno + 1,
            complexity: e.complexity,
          }));
        const classCount = entries.filter((e) => e.type === "class").length;

        const rawStructural: RawStructuralData = {
          functions,
          classCount,
          importCount: countImports(sourceCode),
          maxNestingDepth: null,
          moduleLevelDecisionPoints: 0, // radon attributes all complexity to functions/classes/methods; nothing left at module scope to add separately
        };

        return {
          raw: rawStructural,
          totalLines: raw.loc,
          blankLines: raw.blank,
          commentLines: raw.comments,
          complexityMethod: "radon",
          limitations,
        };
      } catch {
        // Same reasoning as the AST parsers: a syntax error is already
        // surfaced as a static-analysis finding; metrics degrade gracefully
        // rather than blocking the rest of the pipeline.
        const lines = sourceCode.split("\n");
        return {
          raw: { functions: [], classCount: 0, importCount: 0, maxNestingDepth: null, moduleLevelDecisionPoints: 0 },
          totalLines: lines.length,
          blankLines: lines.filter((l) => l.trim().length === 0).length,
          commentLines: lines.filter((l) => l.trim().startsWith("#")).length,
          complexityMethod: "radon",
          limitations: [
            ...limitations,
            "radon failed to analyze this file (likely a syntax error); metrics are unavailable.",
          ],
        };
      }
    });
  }
}
