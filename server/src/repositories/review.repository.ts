import { AnalysisStatus, AIReviewStatus, Prisma } from "@prisma/client";

import { prisma } from "../database/prisma";
import type { ListReviewsQuery } from "../validators/reviewQuery.validator";

export interface CreateReviewWithSubmissionInput {
  userId: string;
  title: string;
  language: string;
  sourceCode: string;
  fileName?: string | null;
  storagePath?: string | null;
}

export interface UpdateAiReviewInput {
  status: AIReviewStatus;
  error?: string | null;
  summary?: string | null;
  provider?: string | null;
  model?: string | null;
  processingTimeMs?: number | null;
  promptTokens?: number | null;
  completionTokens?: number | null;
}

function buildDateThreshold(range: ListReviewsQuery["dateRange"]): Date | null {
  const now = new Date();
  switch (range) {
    case "today": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case "7days":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30days":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

function buildStatusCondition(statuses: ListReviewsQuery["status"]): Prisma.ReviewWhereInput | null {
  if (statuses.length === 0) return null;
  const conditions: Prisma.ReviewWhereInput[] = statuses.map((s) => {
    if (s === "PROCESSING") {
      return { analysisStatus: { in: ["PENDING", "IN_PROGRESS"] } };
    }
    return { analysisStatus: s === "COMPLETED" ? "COMPLETED" : "FAILED" };
  });
  return { OR: conditions };
}

/**
 * "Review Type" isn't a stored column — static analysis always runs for
 * every review (it's mandatory in the pipeline), so this is derived from
 * whether each stage actually completed:
 *  - combined: both static analysis and AI review completed
 *  - static:   static analysis completed, AI did not (skipped/failed/never ran)
 *  - ai:       AI completed but static analysis itself did not (e.g. analyzer crashed)
 */
function buildReviewTypeCondition(types: ListReviewsQuery["reviewType"]): Prisma.ReviewWhereInput | null {
  if (types.length === 0) return null;
  const conditions: Prisma.ReviewWhereInput[] = types.map((t) => {
    if (t === "combined") {
      return { analysisStatus: "COMPLETED", aiReviewStatus: "COMPLETED" };
    }
    if (t === "static") {
      return { analysisStatus: "COMPLETED", aiReviewStatus: { not: "COMPLETED" } };
    }
    return { aiReviewStatus: "COMPLETED", analysisStatus: { not: "COMPLETED" } };
  });
  return { OR: conditions };
}

function buildOrderBy(sortBy: ListReviewsQuery["sortBy"]): Prisma.ReviewOrderByWithRelationInput {
  switch (sortBy) {
    case "oldest":
      return { createdAt: "asc" };
    case "mostFindings":
      return { findings: { _count: "desc" } };
    case "leastFindings":
      return { findings: { _count: "asc" } };
    case "language":
      return { language: "asc" };
    case "status":
      return { analysisStatus: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export const reviewRepository = {
  async createWithSubmission(input: CreateReviewWithSubmissionInput) {
    return prisma.review.create({
      data: {
        userId: input.userId,
        title: input.title,
        language: input.language,
        submissions: {
          create: {
            sourceCode: input.sourceCode,
            fileName: input.fileName ?? null,
            storagePath: input.storagePath ?? null,
            language: input.language,
          },
        },
      },
      include: {
        submissions: true,
      },
    });
  },

  async updateAnalysisStatus(
    reviewId: string,
    status: AnalysisStatus,
    analysisError?: string | null,
    processingTimeMs?: number | null
  ) {
    return prisma.review.update({
      where: { id: reviewId },
      data: {
        analysisStatus: status,
        analysisError: analysisError ?? null,
        ...(processingTimeMs !== undefined ? { analysisProcessingTimeMs: processingTimeMs } : {}),
      },
    });
  },

  async updateAiReview(reviewId: string, data: UpdateAiReviewInput) {
    return prisma.review.update({
      where: { id: reviewId },
      data: {
        aiReviewStatus: data.status,
        aiReviewError: data.error ?? null,
        aiSummary: data.summary ?? null,
        aiProvider: data.provider ?? null,
        aiModel: data.model ?? null,
        aiProcessingTimeMs: data.processingTimeMs ?? null,
        aiPromptTokens: data.promptTokens ?? null,
        aiCompletionTokens: data.completionTokens ?? null,
      },
    });
  },

  /** Scoped to the owning user — a review that exists but belongs to someone else is treated identically to "doesn't exist" (returns null either way), avoiding IDOR enumeration. */
  async findByIdForUser(reviewId: string, userId: string) {
    return prisma.review.findFirst({
      where: { id: reviewId, userId },
      include: {
        submissions: true,
        findings: { orderBy: [{ severity: "desc" }, { lineNumber: "asc" }] },
      },
    });
  },

  async findManyForUser(userId: string, query: ListReviewsQuery) {
    const dateThreshold = buildDateThreshold(query.dateRange);
    const statusCondition = buildStatusCondition(query.status);
    const reviewTypeCondition = buildReviewTypeCondition(query.reviewType);

    const and: Prisma.ReviewWhereInput[] = [];
    if (query.search) {
      const search = query.search;
      and.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { language: { contains: search, mode: "insensitive" } },
          { aiSummary: { contains: search, mode: "insensitive" } },
          { findings: { some: { issue: { contains: search, mode: "insensitive" } } } },
        ],
      });
    }
    if (query.language.length > 0) and.push({ language: { in: query.language } });
    if (statusCondition) and.push(statusCondition);
    if (dateThreshold) and.push({ createdAt: { gte: dateThreshold } });
    if (reviewTypeCondition) and.push(reviewTypeCondition);

    const where: Prisma.ReviewWhereInput = { userId, ...(and.length > 0 ? { AND: and } : {}) };
    const orderBy = buildOrderBy(query.sortBy);
    const skip = (query.page - 1) * query.pageSize;

    // Single round trip for both the page of results and the total count,
    // rather than two sequential awaits — avoids doubling latency.
    const [reviews, totalCount] = await prisma.$transaction([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: query.pageSize,
        // Lightweight projection — list rows only need finding counts by
        // source, never the full finding text. Avoids over-fetching on a
        // list endpoint (the detail page's findByIdForUser fetches full
        // findings; this deliberately does not).
        include: {
          findings: { select: { severity: true, source: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, totalCount };
  },

  /** Returns the deleted review's submissions (for on-disk file cleanup) if the user owned it, or null if not found/not owned. */
  async deleteForUser(reviewId: string, userId: string) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, userId },
      include: { submissions: { select: { storagePath: true } } },
    });
    if (!review) return null;

    // Cascades to submissions and findings at the database level (see
    // onDelete: Cascade on both relations in schema.prisma) — one query,
    // no manual multi-table deletion needed.
    await prisma.review.delete({ where: { id: reviewId } });

    return review.submissions
      .map((s: { storagePath: string | null }) => s.storagePath)
      .filter((p: string | null): p is string => Boolean(p));
  },
};
