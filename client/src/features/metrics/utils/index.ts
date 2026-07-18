import type { MaintainabilityRating } from "@/features/metrics/types";

export const MAINTAINABILITY_LABELS: Record<MaintainabilityRating, string> = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
  CRITICAL: "Critical",
};

export const MAINTAINABILITY_BADGE_VARIANT: Record<
  MaintainabilityRating,
  "success" | "default" | "secondary" | "destructive"
> = {
  EXCELLENT: "success",
  GOOD: "success",
  FAIR: "default",
  POOR: "secondary",
  CRITICAL: "destructive",
};

/** Score (0-100) -> a semantic color class, used for the big quality score number and progress rings. */
export function scoreColorClass(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-primary";
  if (score >= 55) return "text-foreground";
  if (score >= 35) return "text-amber-500";
  return "text-destructive";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
