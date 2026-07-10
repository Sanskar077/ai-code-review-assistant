export const SUPPORTED_LANGUAGES = ["javascript", "typescript", "python"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
};

export type SubmissionMethod = "paste" | "upload";

export type AnalysisStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type FindingSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Finding {
  id: string;
  reviewId: string;
  severity: FindingSeverity;
  /** Analyzer name that produced this finding, e.g. "ESLint", "Pylint". */
  category: string;
  /** Rule identifier, e.g. "no-unused-vars" or "unused-variable". */
  issue: string;
  /** The analyzer's descriptive message. */
  explanation: string;
  suggestedFix: string | null;
  lineNumber: number | null;
  column: number | null;
  fileName: string | null;
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
  createdAt: string;
  updatedAt: string;
  submissions: CodeSubmission[];
  findings: Finding[];
}
