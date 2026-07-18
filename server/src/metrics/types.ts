export interface CodeMetrics {
  totalLines: number;
  linesOfCode: number;
  blankLines: number;
  commentLines: number;
  functionCount: number;
  classCount: number;
  importCount: number;
  maxFunctionLength: number;
  avgFunctionLength: number;
  fileSizeBytes: number;
  /** Null when nesting depth genuinely can't be computed for this input (see `limitations`). */
  maxNestingDepth: number | null;
}

export interface ComplexityMetrics {
  /** Sum of per-function cyclomatic complexity across the file (McCabe). */
  fileComplexity: number;
  averageFunctionComplexity: number;
  maxFunctionComplexity: number;
  /** How this was computed — always documented, never silently approximated. */
  method: "ast" | "radon";
}

export const MaintainabilityRating = {
  EXCELLENT: "EXCELLENT",
  GOOD: "GOOD",
  FAIR: "FAIR",
  POOR: "POOR",
  CRITICAL: "CRITICAL",
} as const;
export type MaintainabilityRating = (typeof MaintainabilityRating)[keyof typeof MaintainabilityRating];

export interface QualityScoreBreakdown {
  /** Each sub-score is 0-100 before weighting is applied. */
  staticAnalysisScore: number;
  aiFindingsScore: number;
  complexityScore: number;
  maintainabilityScore: number;
  /** The weight (0-1) applied to each sub-score — copied from quality-score.config.ts at calculation time, so the breakdown is self-describing even if weights change later. */
  weights: {
    staticAnalysis: number;
    aiFindings: number;
    complexity: number;
    maintainability: number;
  };
  /** Final 0-100 score: sum of (subScore * weight) for all four factors. */
  finalScore: number;
}

export interface MetricsResult {
  language: string;
  code: CodeMetrics;
  complexity: ComplexityMetrics;
  maintainability: MaintainabilityRating;
  qualityScore: number;
  scoreBreakdown: QualityScoreBreakdown;
  /** Any documented approximations or metrics that couldn't be computed for this input. Empty array means fully exact. */
  limitations: string[];
}

/** Raw, language-specific structural facts a provider extracts — MetricsCalculator/ComplexityAnalyzer turn this into the final CodeMetrics/ComplexityMetrics. */
export interface FunctionInfo {
  lineCount: number;
  complexity: number;
}

export interface RawStructuralData {
  functions: FunctionInfo[];
  classCount: number;
  importCount: number;
  maxNestingDepth: number | null;
  /** Decision points at module/file scope, outside any function — included in file-level complexity but not attributed to any single function. */
  moduleLevelDecisionPoints: number;
}

export interface LanguageAnalysisResult {
  raw: RawStructuralData;
  totalLines: number;
  blankLines: number;
  commentLines: number;
  complexityMethod: ComplexityMetrics["method"];
  limitations: string[];
}

/**
 * Contract every language module implements. Metrics and complexity are
 * computed together from a single parse/analysis pass (not two separate
 * calls) to avoid parsing the same source twice — see the Performance
 * requirement in the Day 10 brief.
 */
export interface LanguageMetricsProvider {
  readonly language: string;
  analyze(sourceCode: string): Promise<LanguageAnalysisResult> | LanguageAnalysisResult;
}
