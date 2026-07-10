import { ESLint, type Linter } from "eslint";

import { severityFromEslint } from "../utils/severity";
import type { AnalyzerFinding, AnalyzerInput, AnalyzerResult, CodeAnalyzer } from "../types";

export abstract class BaseEslintAnalyzer implements CodeAnalyzer {
  abstract readonly language: string;
  abstract readonly name: string;

  /** The virtual filename ESLint uses to decide parser/rules — never written to disk. */
  protected abstract readonly virtualFileName: string;

  protected abstract buildConfig(): Linter.Config;

  async analyze({ sourceCode, fileName }: AnalyzerInput): Promise<AnalyzerResult> {
    const eslint = new ESLint({
      useEslintrc: false,
      overrideConfig: this.buildConfig(),
      // ESLint's lintText never writes to disk regardless of this option —
      // it only affects how ignore patterns are resolved, which is
      // irrelevant for a single in-memory submission.
      ignore: false,
    });

    // lintText analyzes the source in memory; nothing is ever written to
    // disk and no code is executed, only parsed and statically checked.
    const results = await eslint.lintText(sourceCode, { filePath: this.virtualFileName });

    const findings: AnalyzerFinding[] = results.flatMap((result) =>
      result.messages.map((message): AnalyzerFinding => ({
        severity: severityFromEslint(message.severity, message.fatal),
        rule: message.ruleId ?? "parse-error",
        message: message.message,
        fileName,
        line: message.line ?? null,
        column: message.column ?? null,
        suggestedFix: message.suggestions?.[0]?.desc ?? null,
      }))
    );

    return { analyzerName: this.name, findings };
  }
}
