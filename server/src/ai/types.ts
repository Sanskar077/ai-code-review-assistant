/** Defined locally, same rationale as analyzers/types.ts — this layer doesn't depend on the ORM's generated types. */
export const Severity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type Severity = (typeof Severity)[keyof typeof Severity];

export interface AIFinding {
  severity: Severity;
  category: string;
  title: string;
  description: string;
  recommendation: string;
}

export interface TokenUsage {
  promptTokens: number | null;
  completionTokens: number | null;
}

export interface AIReviewInput {
  sourceCode: string;
  language: string;
}

export interface AIReviewResult {
  summary: string;
  findings: AIFinding[];
  provider: string;
  model: string;
  processingTimeMs: number;
  tokenUsage: TokenUsage;
}

/**
 * Contract every AI provider implements. AIReviewService is the only layer
 * that calls this — no controller, route, or other service talks to a
 * provider (or OpenRouter specifically) directly, so swapping providers
 * later never touches calling code.
 */
export interface AIProvider {
  readonly name: string;
  readonly model: string;
  review(input: AIReviewInput): Promise<AIReviewResult>;
}
