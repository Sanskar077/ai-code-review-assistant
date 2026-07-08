export const SUPPORTED_LANGUAGES = ["javascript", "typescript", "python"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
};

export type SubmissionMethod = "paste" | "upload";

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
  createdAt: string;
  updatedAt: string;
  submissions: CodeSubmission[];
}
