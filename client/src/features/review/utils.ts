import type { Finding, Review } from "@/features/review/types";

export type ReviewDisplayStatus = "complete" | "partial" | "failed" | "processing";

export function getReviewDisplayStatus(review: Review): ReviewDisplayStatus {
  if (review.analysisStatus === "FAILED") return "failed";
  if (review.analysisStatus !== "COMPLETED") return "processing";
  if (review.aiReviewStatus === "COMPLETED") return "complete";
  return "partial"; // static analysis done, AI skipped/failed
}

export const REVIEW_STATUS_LABEL: Record<ReviewDisplayStatus, string> = {
  complete: "Complete",
  partial: "Complete (AI unavailable)",
  failed: "Analysis failed",
  processing: "Processing",
};

export function formatDuration(ms: number | null): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function countBySource(findings: Finding[]) {
  const staticCount = findings.filter((f) => f.source !== "ai").length;
  const aiCount = findings.filter((f) => f.source === "ai").length;
  return { staticCount, aiCount, total: findings.length };
}

/** Highest-severity finding first — used to surface a single "final recommendation." */
const SEVERITY_RANK: Record<Finding["severity"], number> = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };

export function getTopAIFinding(findings: Finding[]): Finding | null {
  const aiFindings = findings.filter((f) => f.source === "ai");
  if (aiFindings.length === 0) return null;
  return [...aiFindings].sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity])[0];
}

export function severityCounts(findings: Finding[]) {
  return {
    CRITICAL: findings.filter((f) => f.severity === "CRITICAL").length,
    HIGH: findings.filter((f) => f.severity === "HIGH").length,
    MEDIUM: findings.filter((f) => f.severity === "MEDIUM").length,
    LOW: findings.filter((f) => f.severity === "LOW").length,
  };
}
