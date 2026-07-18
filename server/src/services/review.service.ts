import fs from "node:fs/promises";
import path from "node:path";

import { ErrorCode } from "../constants/errorCode";
import { HttpStatus } from "../constants/httpStatus";
import { MetricsEngine } from "../metrics/MetricsEngine";
import { UPLOAD_DIR } from "../middleware/upload.middleware";
import { reviewRepository } from "../repositories/review.repository";
import { aiReviewService } from "./ai-review.service";
import { analysisService } from "./analysis.service";
import { AppError } from "../utils/AppError";
import { createReviewMetaSchema, type CreateReviewFromPasteInput } from "../validators/review.validator";
import type { ListReviewsQuery } from "../validators/reviewQuery.validator";

/** Best-effort delete — an upload that fails validation shouldn't leave an orphaned file on disk. */
async function deleteUploadedFileSafely(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch {
    // Nothing more we can do here; this is already inside a failure path.
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + "…";
}

/**
 * Runs the full review pipeline for a just-created review: static
 * analysis -> metrics (structural) -> AI review -> merge/score, exactly
 * the order the spec requires. Everything is folded into the object
 * returned to the client in one round-trip rather than requiring the
 * frontend to poll.
 *
 * AI review runs regardless of whether static analysis succeeded: they
 * analyze the same source independently, so a static-analysis failure
 * shouldn't also deny the user an AI review (and vice versa). Metrics
 * follow the same principle — a metrics failure never blocks either.
 */
async function withReviewPipeline<
  T extends { id: string; language: string; submissions: { sourceCode: string; fileName: string | null }[] }
>(review: T) {
  const submission = review.submissions[0];

  const analysisOutcome = await analysisService.runForReview({
    reviewId: review.id,
    language: review.language,
    sourceCode: submission.sourceCode,
    fileName: submission.fileName,
  });

  const structuralMetrics = await MetricsEngine.analyzeCode(review.language, submission.sourceCode);

  const aiOutcome = await aiReviewService.runForReview({
    reviewId: review.id,
    language: review.language,
    sourceCode: submission.sourceCode,
  });

  // Finalized at merge time since the score formula needs AI findings,
  // which only exist once aiOutcome resolves — see MetricsEngine's doc
  // comment for why this is a separate step from analyzeCode().
  const { qualityScore, maintainability, scoreBreakdown } = MetricsEngine.finalizeScore({
    code: structuralMetrics.code,
    complexity: structuralMetrics.complexity,
    staticSeverities: analysisOutcome.findings.map((f) => f.severity),
    aiSeverities: aiOutcome.findings.map((f) => f.severity),
  });

  await reviewRepository.updateMetrics(review.id, {
    overallScore: qualityScore,
    maintainabilityRating: maintainability,
    metricsJson: {
      code: structuralMetrics.code,
      complexity: structuralMetrics.complexity,
      scoreBreakdown,
      limitations: structuralMetrics.limitations,
    },
  });

  return {
    ...review,
    analysisStatus: analysisOutcome.status,
    analysisError: analysisOutcome.error,
    aiReviewStatus: aiOutcome.status,
    aiReviewError: aiOutcome.error,
    aiSummary: aiOutcome.summary,
    overallScore: qualityScore,
    maintainabilityRating: maintainability,
    metricsJson: {
      code: structuralMetrics.code,
      complexity: structuralMetrics.complexity,
      scoreBreakdown,
      limitations: structuralMetrics.limitations,
    },
    // Merged so the frontend consumes one unified findings list, as required.
    findings: [...analysisOutcome.findings, ...aiOutcome.findings],
  };
}

export const reviewService = {
  async list(userId: string, query: ListReviewsQuery) {
    const { reviews, totalCount } = await reviewRepository.findManyForUser(userId, query);

    const items = reviews.map((review: (typeof reviews)[number]) => {
      const staticFindings = review.findings.filter((f: { source: string | null }) => f.source !== "ai").length;
      const aiFindings = review.findings.filter((f: { source: string | null }) => f.source === "ai").length;
      return {
        id: review.id,
        title: review.title,
        language: review.language,
        createdAt: review.createdAt,
        analysisStatus: review.analysisStatus,
        aiReviewStatus: review.aiReviewStatus,
        totalFindings: staticFindings + aiFindings,
        staticFindings,
        aiFindings,
        aiModel: review.aiModel,
        aiSummaryPreview: review.aiSummary ? truncate(review.aiSummary, 160) : null,
      };
    });

    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / query.pageSize)),
      },
    };
  },

  async remove(userId: string, reviewId: string) {
    const storagePaths = await reviewRepository.deleteForUser(reviewId, userId);
    if (storagePaths === null) {
      throw new AppError("Review not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }

    // Best-effort — the database row is already gone regardless of whether
    // this cleanup succeeds, so a stale file on disk is not a correctness
    // issue, just a minor cleanup miss.
    await Promise.all(
      storagePaths.map((relativePath: string) => deleteUploadedFileSafely(path.join(UPLOAD_DIR, relativePath)))
    );
  },

  async getById(userId: string, reviewId: string) {
    const review = await reviewRepository.findByIdForUser(reviewId, userId);
    if (!review) {
      throw new AppError("Review not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    return review;
  },

  async createFromPaste(userId: string, input: CreateReviewFromPasteInput) {
    const review = await reviewRepository.createWithSubmission({
      userId,
      title: input.title,
      language: input.language,
      sourceCode: input.sourceCode,
    });

    return withReviewPipeline(review);
  },

  async createFromUpload(userId: string, rawMeta: unknown, file: Express.Multer.File | undefined) {
    if (!file) {
      throw new AppError("A file is required for this submission method", HttpStatus.BAD_REQUEST, ErrorCode.FILE_REQUIRED);
    }

    try {
      // Validated here (rather than via the shared `validate` middleware, which
      // would run before this try/catch) so a validation failure still
      // triggers cleanup of the file Multer already wrote to disk.
      const meta = createReviewMetaSchema.parse(rawMeta);

      if (file.size === 0) {
        throw new AppError("The uploaded file is empty", HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.EMPTY_FILE);
      }

      let sourceCode: string;
      try {
        sourceCode = await fs.readFile(file.path, "utf-8");
      } catch {
        throw new AppError(
          "The uploaded file could not be read as text",
          HttpStatus.UNPROCESSABLE_ENTITY,
          ErrorCode.VALIDATION_ERROR
        );
      }

      if (sourceCode.trim().length === 0) {
        throw new AppError("The uploaded file is empty", HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.EMPTY_FILE);
      }

      const storagePath = path.relative(UPLOAD_DIR, file.path);

      const review = await reviewRepository.createWithSubmission({
        userId,
        title: meta.title,
        language: meta.language,
        sourceCode,
        fileName: file.originalname,
        storagePath,
      });

      return withReviewPipeline(review);
    } catch (error) {
      await deleteUploadedFileSafely(file.path);
      throw error;
    }
  },
};
