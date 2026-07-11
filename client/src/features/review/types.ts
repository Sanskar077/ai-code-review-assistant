export const SUPPORTED_LANGUAGES = ["javascript", "typescript", "python"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
};

export type SubmissionMethod = "paste" | "upload";

export type AnalysisStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type AIReviewStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "SKIPPED";

export type FindingSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Finding {
  id: string;
  reviewId: string;
  severity: FindingSeverity;
  /** Analyzer name (e.g. "ESLint", "Pylint") for static findings, or the AI's category (e.g. "Security") for AI findings. */
  category: string;
  /** Rule identifier for static findings, or the AI's finding title. */
  issue: string;
  /** The analyzer's descriptive message, or the AI's finding description. */
  explanation: string;
  suggestedFix: string | null;
  lineNumber: number | null;
  column: number | null;
  fileName: string | null;
  /** Which engine produced this finding: "eslint" | "pylint" | "ai". */
  source: string | null;
  createdAt: string;
}

export interface CodeSubmission {
  id: string;
  reviewId: string;
  sourceCode: string;
  fileName: string | null;
  language: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  title: string;
  language: string;
  overallScore: number | null;
  aiSummary: string | null;
  analysisStatus: AnalysisStatus;
  analysisError: string | null;
  aiReviewStatus: AIReviewStatus;
  aiReviewError: string | null;
  createdAt: string;
  updatedAt: string;
  submissions: CodeSubmission[];
  findings: Finding[];
}
