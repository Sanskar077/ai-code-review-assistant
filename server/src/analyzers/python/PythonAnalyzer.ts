import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { severityFromPylintType } from "../utils/severity";
import { withTempFile } from "../utils/tempFile";
import type { AnalyzerFinding, AnalyzerInput, AnalyzerResult, CodeAnalyzer } from "../types";

const execFileAsync = promisify(execFile);

interface PylintMessage {
  type: string; // convention | refactor | warning | error | fatal
  line: number;
  column: number; // 0-based
  symbol: string;
  message: string;
}

const PYLINT_TIMEOUT_MS = 10_000;
const MAX_BUFFER_BYTES = 5 * 1024 * 1024;

export class PythonAnalyzer implements CodeAnalyzer {
  readonly language = "python";
  readonly name = "Pylint";
  readonly source = "pylint";

  async analyze({ sourceCode, fileName }: AnalyzerInput): Promise<AnalyzerResult> {
    const messages = await withTempFile(sourceCode, ".py", async (filePath) => {
      try {
        const { stdout } = await execFileAsync(
          "pylint",
          ["--output-format=json", "--exit-zero", "--score=no", filePath],
          { timeout: PYLINT_TIMEOUT_MS, maxBuffer: MAX_BUFFER_BYTES }
        );
        return JSON.parse(stdout || "[]") as PylintMessage[];
      } catch (error) {
        // execFile rejects on non-zero exit, ENOENT (pylint not installed),
        // or timeout. --exit-zero means pylint itself always exits 0 when it
        // ran successfully, so any rejection here is a genuine analyzer
        // failure, not "issues were found" — let it propagate to the
        // orchestrating service, which maps it to a safe, user-facing message.
        throw error;
      }
    });

    const findings: AnalyzerFinding[] = messages.map((message) => ({
      severity: severityFromPylintType(message.type),
      rule: message.symbol || "unknown-rule",
      message: message.message,
      fileName,
      line: message.line ?? null,
      column: typeof message.column === "number" ? message.column + 1 : null, // pylint is 0-based
      suggestedFix: null, // Pylint's JSON output doesn't include fix suggestions
    }));

    return { analyzerName: this.name, source: this.source, findings };
  }
}
