import { clamp } from "./utils";
import { MaintainabilityRating, type CodeMetrics, type ComplexityMetrics } from "./types";

/**
 * All scoring weights in one place, as required — nothing in the rest of
 * the metrics engine hardcodes a weight or a scoring threshold. Weights
 * must sum to 1.
 */
export const SCORE_WEIGHTS = {
  staticAnalysis: 0.35,
  aiFindings: 0.3,
  complexity: 0.2,
  maintainability: 0.15,
} as const;

/** Points deducted per finding, by severity — applied identically to static and AI findings. */
export const SEVERITY_PENALTY = {
  CRITICAL: 25,
  HIGH: 15,
  MEDIUM: 7,
  LOW: 2,
} as const;

export const MAINTAINABILITY_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 55,
  POOR: 35,
  // Below POOR's threshold falls through to CRITICAL.
} as const;

/**
 * 100, minus a penalty per finding by severity. Applied the same way to
 * both static-analysis and AI-review findings (called twice, once per
 * finding set) so the two factors are directly comparable.
 */
export function scoreFromFindings(severities: Array<keyof typeof SEVERITY_PENALTY>): number {
  const penalty = severities.reduce((sum, severity) => sum + SEVERITY_PENALTY[severity], 0);
  return clamp(100 - penalty, 0, 100);
}

/**
 * Cyclomatic complexity scoring: a widely-used band is 1-5 (simple), 6-10
 * (moderate), 11-20 (complex), 21+ (very complex). This maps average
 * per-function complexity onto 0-100 with a linear decay of 8 points per
 * unit above the ideal baseline of 1, floored at 0.
 */
export function scoreFromComplexity(complexity: ComplexityMetrics): number {
  if (complexity.averageFunctionComplexity === 0) return 100; // no functions to be complex
  return clamp(100 - (complexity.averageFunctionComplexity - 1) * 8, 0, 100);
}

/**
 * Maintainability scoring from structural metrics: penalizes long
 * functions (harder to understand/test), deep nesting (harder to follow),
 * and very low comment coverage on non-trivial files.
 */
export function scoreFromMaintainability(code: CodeMetrics): number {
  let score = 100;

  if (code.avgFunctionLength > 30) {
    score -= (code.avgFunctionLength - 30) * 1;
  }

  if (code.maxNestingDepth !== null && code.maxNestingDepth > 3) {
    score -= (code.maxNestingDepth - 3) * 8;
  }

  const commentRatio = code.totalLines > 0 ? code.commentLines / code.totalLines : 0;
  if (code.linesOfCode > 20 && commentRatio < 0.05) {
    score -= 5;
  }

  return clamp(score, 0, 100);
}

export function ratingFromMaintainabilityScore(score: number): MaintainabilityRating {
  if (score >= MAINTAINABILITY_THRESHOLDS.EXCELLENT) return MaintainabilityRating.EXCELLENT;
  if (score >= MAINTAINABILITY_THRESHOLDS.GOOD) return MaintainabilityRating.GOOD;
  if (score >= MAINTAINABILITY_THRESHOLDS.FAIR) return MaintainabilityRating.FAIR;
  if (score >= MAINTAINABILITY_THRESHOLDS.POOR) return MaintainabilityRating.POOR;
  return MaintainabilityRating.CRITICAL;
}
