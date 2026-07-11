import type { Finding } from "@prisma/client";

import { AIProviderError } from "../ai/errors";
import { OpenRouterProvider } from "../ai/providers/OpenRouterProvider";
import type { AIProvider } from "../ai/types";
import { AIReviewStatus } from "../constants/aiReviewStatus";
import { findingRepository } from "../repositories/finding.repository";
import { reviewRepository } from "../repositories/review.repository";
import { logger } from "../utils/logger";

export interface RunAIReviewInput {
  reviewId: string;
  language: string;
  sourceCode: string;
}

export interface AIReviewOutcome {
  status: typeof AIReviewStatus.COMPLETED | typeof AIReviewStatus.FAILED | typeof AIReviewStatus.SKIPPED;
  error: string | null;
  summary: string | null;
  findings: Finding[];
}

/** Safe, generic messages only — the specific reason is logged server-side, never shown to the client. */
const SAFE_MESSAGES: Record<string, string> = {
  MISSING_API_KEY: "AI review isn't enabled for this deployment.",
  INVALID_API_KEY: "AI review is temporarily unavailable.",
  RATE_LIMITED: "AI review is temporarily unavailable (rate limited). Please try again shortly.",
  TIMEOUT: "AI review took too long and was stopped.",
  INVALID_RESPONSE: "AI review returned an unexpected response.",
  PROVIDER_UNAVAILABLE: "The AI provider is temporarily unavailable.",
  NETWORK_ERROR: "Couldn't reach the AI provider.",
  UNKNOWN: "AI review failed unexpectedly.",
};

/**
 * AIReviewService is the only layer that talks to an AIProvider. Swapping
 * OpenRouter for a different provider later means changing the one line
 * below, not any calling code (controllers/routes never see AIProvider).
 */
function getProvider(): AIProvider {
  return new OpenRouterProvider();
}

export const aiReviewService = {
  async runForReview(input: RunAIReviewInput): Promise<AIReviewOutcome> {
    const { reviewId, language, sourceCode } = input;
    const provider = getProvider();

    await reviewRepository.updateAiReview(reviewId, { status: AIReviewStatus.IN_PROGRESS });
    logger.info("AI review started", { reviewId, language, provider: provider.name, model: provider.model });

    const startedAt = Date.now();

    try {
      const result = await provider.review({ sourceCode, language });
      const durationMs = Date.now() - startedAt;

      logger.info("AI review completed", {
        reviewId,
        language,
        provider: provider.name,
        model: provider.model,
        durationMs,
        findingCount: result.findings.length,
        promptTokens: result.tokenUsage.promptTokens,
        completionTokens: result.tokenUsage.completionTokens,
      });

      const findings = await findingRepository.createMany(
        result.findings.map((f) => ({
          reviewId,
          severity: f.severity,
          category: f.category,
          issue: f.title,
          explanation: f.description,
          suggestedFix: f.recommendation,
          lineNumber: null,
          column: null,
          fileName: null,
          source: "ai",
        }))
      );

      await reviewRepository.updateAiReview(reviewId, {
        status: AIReviewStatus.COMPLETED,
        summary: result.summary,
        provider: result.provider,
        model: result.model,
        processingTimeMs: result.processingTimeMs,
        promptTokens: result.tokenUsage.promptTokens,
        completionTokens: result.tokenUsage.completionTokens,
      });

      return { status: AIReviewStatus.COMPLETED, error: null, summary: result.summary, findings };
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      const code = error instanceof AIProviderError ? error.code : "UNKNOWN";
      const isSkipped = code === "MISSING_API_KEY";
      const safeMessage = SAFE_MESSAGES[code] ?? SAFE_MESSAGES.UNKNOWN;
      const finalStatus = isSkipped ? AIReviewStatus.SKIPPED : AIReviewStatus.FAILED;

      logger[isSkipped ? "info" : "error"]("AI review " + (isSkipped ? "skipped" : "failed"), {
        reviewId,
        language,
        provider: provider.name,
        durationMs,
        code,
        error: error instanceof Error ? error.message : String(error),
      });

      await reviewRepository.updateAiReview(reviewId, { status: finalStatus, error: safeMessage });

      return { status: finalStatus, error: safeMessage, summary: null, findings: [] };
    }
  },
};
