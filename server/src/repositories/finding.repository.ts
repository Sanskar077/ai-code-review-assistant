import type { Severity } from "@prisma/client";

import { prisma } from "../database/prisma";

export interface CreateFindingInput {
  reviewId: string;
  severity: Severity;
  category: string;
  issue: string;
  explanation: string;
  suggestedFix: string | null;
  lineNumber: number | null;
  column: number | null;
  fileName: string | null;
  source: string | null;
}

export const findingRepository = {
  async createMany(inputs: CreateFindingInput[]) {
    if (inputs.length === 0) return [];

    return Promise.all(
      inputs.map((input) =>
        prisma.finding.create({
          data: {
            reviewId: input.reviewId,
            severity: input.severity,
            category: input.category,
            issue: input.issue,
            explanation: input.explanation,
            suggestedFix: input.suggestedFix,
            lineNumber: input.lineNumber,
            column: input.column,
            fileName: input.fileName,
            source: input.source,
          },
        })
      )
    );
  },

  async findByReviewId(reviewId: string) {
    return prisma.finding.findMany({
      where: { reviewId },
      orderBy: [{ lineNumber: "asc" }],
    });
  },
};
