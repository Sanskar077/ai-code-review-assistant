/**
 * Mirrors the Prisma `AIReviewStatus` enum (prisma/schema.prisma). Defined
 * locally so the service layer's runtime behavior never depends on Prisma
 * client generation — see constants/analysisStatus.ts for the same pattern.
 */
export const AIReviewStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  SKIPPED: "SKIPPED",
} as const;
export type AIReviewStatus = (typeof AIReviewStatus)[keyof typeof AIReviewStatus];
