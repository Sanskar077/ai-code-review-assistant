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
  maxNestingDepth: number | null;
}

export interface ComplexityMetrics {
  fileComplexity: number;
  averageFunctionComplexity: number;
  maxFunctionComplexity: number;
  method: "ast" | "radon";
}

export type MaintainabilityRating = "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "CRITICAL";

export interface QualityScoreBreakdown {
  staticAnalysisScore: number;
  aiFindingsScore: number;
  complexityScore: number;
  maintainabilityScore: number;
  weights: {
    staticAnalysis: number;
    aiFindings: number;
    complexity: number;
    maintainability: number;
  };
  finalScore: number;
}

export interface MetricsJson {
  code: CodeMetrics;
  complexity: ComplexityMetrics;
  scoreBreakdown: QualityScoreBreakdown;
  limitations: string[];
}
