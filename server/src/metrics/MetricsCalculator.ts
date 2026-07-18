import { average, round } from "./utils";
import type { CodeMetrics, LanguageAnalysisResult } from "./types";

export const MetricsCalculator = {
  compute(analysis: LanguageAnalysisResult, sourceCode: string): CodeMetrics {
    const { raw, totalLines, blankLines, commentLines } = analysis;
    const functionLengths = raw.functions.map((f) => f.lineCount);

    return {
      totalLines,
      linesOfCode: Math.max(0, totalLines - blankLines - commentLines),
      blankLines,
      commentLines,
      functionCount: raw.functions.length,
      classCount: raw.classCount,
      importCount: raw.importCount,
      maxFunctionLength: functionLengths.length > 0 ? Math.max(...functionLengths) : 0,
      avgFunctionLength: round(average(functionLengths)),
      fileSizeBytes: Buffer.byteLength(sourceCode, "utf-8"),
      maxNestingDepth: raw.maxNestingDepth,
    };
  },
};
