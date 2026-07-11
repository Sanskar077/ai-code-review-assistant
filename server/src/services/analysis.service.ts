import type { Finding } from "@prisma/client";

import { AnalyzerFactory } from "../analyzers/AnalyzerFactory";
import { ANALYSIS_TIMEOUT_MS } from "../constants/analysis";
import { AnalysisStatus } from "../constants/analysisStatus";
import { findingRepository } from "../repositories/finding.repository";
import { reviewRepository } from "../repositories/review.repository";
import { logger } from "../utils/logger";
import { withTimeout, TimeoutError } from "../utils/withTimeout";

export interface RunAnalysisInput {
  reviewId: string;
  language: string;
  sourceCode: string;
  fileName: string | null;
}

export interface AnalysisOutcome {
  status: typeof AnalysisStatus.COMPLETED | typeof AnalysisStatus.FAILED;
  error: string | null;
  findings: Finding[];
}

/** Safe, generic messages only — never a raw error message or stack trace reaches the client. */
const SAFE_MESSAGES = {
  unsupportedLanguage: "Static analysis isn't available for this language yet.",
  emptySubmission: "There's no code to analyze.",
  timeout: "Analysis took too long and was stopped. Please try again with a smaller submission.",
  analyzerUnavailable: "The static analysis tool for this language is temporarily unavailable.",
  generic: "Static analysis failed unexpectedly. Please try again.",
};

export const analysisService = {
  async runForReview(input: RunAnalysisInput): Promise<AnalysisOutcome> {
    const { reviewId, language, sourceCode, fileName } = input;

    if (sourceCode.trim().length === 0) {
      await reviewRepository.updateAnalysisStatus(reviewId, AnalysisStatus.FAILED, SAFE_MESSAGES.emptySubmission);
      return { status: AnalysisStatus.FAILED, error: SAFE_MESSAGES.emptySubmission, findings: [] };
    }

    const analyzer = AnalyzerFactory.getAnalyzer(language);
    if (!analyzer) {
      logger.warn("No analyzer registered for language", { reviewId, language });
      await reviewRepository.updateAnalysisStatus(reviewId, AnalysisStatus.FAILED, SAFE_MESSAGES.unsupportedLanguage);
      return { status: AnalysisStatus.FAILED, error: SAFE_MESSAGES.unsupportedLanguage, findings: [] };
    }

    await reviewRepository.updateAnalysisStatus(reviewId, AnalysisStatus.IN_PROGRESS);
    logger.info("Static analysis started", { reviewId, language, analyzer: analyzer.name });

    const startedAt = Date.now();

    try {
      const result = await withTimeout(
        analyzer.analyze({ sourceCode, fileName }),
        ANALYSIS_TIMEOUT_MS
      );

      const durationMs = Date.now() - startedAt;
      logger.info("Static analysis completed", {
        reviewId,
        language,
        analyzer: analyzer.name,
        durationMs,
        findingCount: result.findings.length,
      });

      const findings = await findingRepository.createMany(
        result.findings.map((f) => ({
          reviewId,
          severity: f.severity,
          category: result.analyzerName,
          issue: f.rule,
          explanation: f.message,
          suggestedFix: f.suggestedFix,
          lineNumber: f.line,
          column: f.column,
          fileName: f.fileName,
          source: result.source,
        }))
      );

      await reviewRepository.updateAnalysisStatus(reviewId, AnalysisStatus.COMPLETED);
      return { status: AnalysisStatus.COMPLETED, error: null, findings };
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      const isTimeout = error instanceof TimeoutError;
      const safeMessage = isTimeout ? SAFE_MESSAGES.timeout : resolveSafeMessage(error);

      logger.error("Static analysis failed", {
        reviewId,
        language,
        analyzer: analyzer.name,
        durationMs,
        error: error instanceof Error ? error.message : String(error),
      });

      await reviewRepository.updateAnalysisStatus(reviewId, AnalysisStatus.FAILED, safeMessage);
      return { status: AnalysisStatus.FAILED, error: safeMessage, findings: [] };
    }
  },
};

function resolveSafeMessage(error: unknown): string {
  // Node's child_process rejects with an ENOENT code when the analyzer
  // binary (e.g. `pylint`) isn't installed on the host — a deployment
  // issue, not something to blame on the user's code.
  if (typeof error === "object" && error !== null && "code" in error && (error as any).code === "ENOENT") {
    return SAFE_MESSAGES.analyzerUnavailable;
  }
  return SAFE_MESSAGES.generic;
}
