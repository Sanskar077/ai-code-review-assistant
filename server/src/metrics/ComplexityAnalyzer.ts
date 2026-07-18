import { average, round } from "./utils";
import type { ComplexityMetrics, LanguageAnalysisResult } from "./types";

export const ComplexityAnalyzer = {
  compute(analysis: LanguageAnalysisResult): ComplexityMetrics {
    const { raw, complexityMethod } = analysis;
    const functionComplexities = raw.functions.map((f) => f.complexity);

    // File complexity = sum of every function's complexity, plus any
    // decision points at module scope (outside all functions).
    const fileComplexity =
      functionComplexities.reduce((sum, c) => sum + c, 0) + raw.moduleLevelDecisionPoints;

    return {
      fileComplexity,
      averageFunctionComplexity: round(average(functionComplexities)),
      maxFunctionComplexity: functionComplexities.length > 0 ? Math.max(...functionComplexities) : 0,
      method: complexityMethod,
    };
  },
};
