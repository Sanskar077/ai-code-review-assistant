/**
 * Defined locally rather than imported from "@prisma/client" — the analyzer
 * layer is a pure domain concern and shouldn't depend on the ORM's
 * generated types. The persistence layer (finding.repository.ts) maps this
 * value at the boundary; the two are structurally identical string unions.
 */
export const Severity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type Severity = (typeof Severity)[keyof typeof Severity];

/** A single normalized finding, in the exact shape the frontend receives regardless of which analyzer produced it. */
export interface AnalyzerFinding {
  severity: Severity;
  /** Rule identifier, e.g. ESLint's ruleId ("no-unused-vars") or Pylint's symbol ("unused-variable"). */
  rule: string;
  message: string;
  fileName: string | null;
  line: number | null;
  /** 1-based column, normalized across analyzers (Pylint reports 0-based columns natively). */
  column: number | null;
  suggestedFix: string | null;
}

export interface AnalyzerResult {
  /** Human-readable name of the tool that produced these findings, e.g. "ESLint", "Pylint". Stored as Finding.category. */
  analyzerName: string;
  /** Machine-readable identifier, e.g. "eslint", "pylint". Stored as Finding.source. */
  source: string;
  findings: AnalyzerFinding[];
}

export interface AnalyzerInput {
  sourceCode: string;
  /** The submission's original filename, if any (used for display only — never for path resolution). */
  fileName: string | null;
}

/**
 * Contract every static analyzer implements. New languages are added by
 * implementing this interface and registering an instance in
 * AnalyzerFactory — existing analyzers are never modified (Open/Closed).
 */
export interface CodeAnalyzer {
  readonly language: string;
  readonly name: string;
  /** Machine-readable identifier used for Finding.source, e.g. "eslint", "pylint". */
  readonly source: string;
  analyze(input: AnalyzerInput): Promise<AnalyzerResult>;
}
