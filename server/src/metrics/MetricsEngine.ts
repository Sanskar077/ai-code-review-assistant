import { MetricsCalculator } from "./MetricsCalculator";
import { ComplexityAnalyzer } from "./ComplexityAnalyzer";
import { JavaScriptMetrics } from "./language/JavaScriptMetrics";
import { PythonMetrics } from "./language/PythonMetrics";
import { TypeScriptMetrics } from "./language/TypeScriptMetrics";
import {
  ratingFromMaintainabilityScore,
  scoreFromComplexity,
  scoreFromFindings,
  scoreFromMaintainability,
  SCORE_WEIGHTS,
} from "./quality-score.config";
import type {
  CodeMetrics,
  ComplexityMetrics,
  LanguageMetricsProvider,
  MaintainabilityRating,
  QualityScoreBreakdown,
} from "./types";

const registry: Record<string, LanguageMetricsProvider> = {
  javascript: new JavaScriptMetrics(),
  typescript: new TypeScriptMetrics(),
  python: new PythonMetrics(),
};

export interface StructuralAnalysis {
  language: string;
  code: CodeMetrics;
  complexity: ComplexityMetrics;
  limitations: string[];
}

export interface FinalizedScore {
  qualityScore: number;
  maintainability: MaintainabilityRating;
  scoreBreakdown: QualityScoreBreakdown;
}

/** Neutral placeholder returned when a language has no metrics provider, or analysis genuinely fails — never fabricated numbers. */
function emptyCodeMetrics(): CodeMetrics {
  return {
    totalLines: 0,
    linesOfCode: 0,
    blankLines: 0,
    commentLines: 0,
    functionCount: 0,
    classCount: 0,
    importCount: 0,
    maxFunctionLength: 0,
    avgFunctionLength: 0,
    fileSizeBytes: 0,
    maxNestingDepth: null,
  };
}

function emptyComplexityMetrics(method: ComplexityMetrics["method"]): ComplexityMetrics {
  return { fileComplexity: 0, averageFunctionComplexity: 0, maxFunctionComplexity: 0, method };
}

export const MetricsEngine = {
  /**
   * Step 1 of 2 — runs immediately after static analysis, exactly where the
   * pipeline requires. Only needs the source code, not any findings, so it
   * never has to wait on AI review.
   */
  async analyzeCode(language: string, sourceCode: string): Promise<StructuralAnalysis> {
    const provider = registry[language];

    if (!provider) {
      return {
        language,
        code: emptyCodeMetrics(),
        complexity: emptyComplexityMetrics("ast"),
        limitations: [`No metrics provider is registered for "${language}".`],
      };
    }

    try {
      const analysis = await provider.analyze(sourceCode);
      const code = MetricsCalculator.compute(analysis, sourceCode);
      const complexity = ComplexityAnalyzer.compute(analysis);
      return { language, code, complexity, limitations: analysis.limitations };
    } catch (error) {
      // A metrics failure must never take down static analysis or AI review
      // — both are independent pipeline stages that have already run or
      // are about to run regardless of this outcome.
      return {
        language,
        code: emptyCodeMetrics(),
        complexity: emptyComplexityMetrics("ast"),
        limitations: [
          `Metrics calculation failed unexpectedly: ${error instanceof Error ? error.message : String(error)}`,
        ],
      };
    }
  },

  /**
   * Step 2 of 2 — called once AI review has completed (at the "Merge
   * Results" stage), since the quality score's formula includes AI
   * findings. Everything here is pure computation over already-known
   * inputs, so it's cheap to run synchronously at merge time.
   */
  finalizeScore(input: {
    code: CodeMetrics;
    complexity: ComplexityMetrics;
    staticSeverities: Array<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">;
    aiSeverities: Array<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">;
  }): FinalizedScore {
    const staticAnalysisScore = scoreFromFindings(input.staticSeverities);
    const aiFindingsScore = scoreFromFindings(input.aiSeverities);
    const complexityScore = scoreFromComplexity(input.complexity);
    const maintainabilityScore = scoreFromMaintainability(input.code);

    const finalScore = Math.round(
      staticAnalysisScore * SCORE_WEIGHTS.staticAnalysis +
        aiFindingsScore * SCORE_WEIGHTS.aiFindings +
        complexityScore * SCORE_WEIGHTS.complexity +
        maintainabilityScore * SCORE_WEIGHTS.maintainability
    );

    return {
      qualityScore: finalScore,
      maintainability: ratingFromMaintainabilityScore(maintainabilityScore),
      scoreBreakdown: {
        staticAnalysisScore,
        aiFindingsScore,
        complexityScore,
        maintainabilityScore,
        weights: { ...SCORE_WEIGHTS },
        finalScore,
      },
    };
  },
};
