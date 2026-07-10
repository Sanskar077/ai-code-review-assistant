import { AnalysisStatus } from "@prisma/client";

import { prisma } from "../database/prisma";

export interface CreateReviewWithSubmissionInput {
  userId: string;
  title: string;
  language: string;
  sourceCode: string;
  fileName?: string | null;
  storagePath?: string | null;
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
};
