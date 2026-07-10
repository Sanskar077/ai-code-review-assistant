/**
 * Mirrors the Prisma `AnalysisStatus` enum (prisma/schema.prisma). Defined
 * locally, the same way analyzers/types.ts defines its own Severity,
 * so the service layer's runtime behavior never depends on whether the
 * Prisma client was generated — only the repository layer (the actual
 * persistence boundary) needs the ORM's own type.
 */
export const AnalysisStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;
export type AnalysisStatus = (typeof AnalysisStatus)[keyof typeof AnalysisStatus];
