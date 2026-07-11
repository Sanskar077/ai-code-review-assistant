import { AnalysisStatus, AIReviewStatus } from "@prisma/client";

import { prisma } from "../database/prisma";

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

  async updateAnalysisStatus(reviewId: string, status: AnalysisStatus, analysisError?: string | null) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { analysisStatus: status, analysisError: analysisError ?? null },
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
};
