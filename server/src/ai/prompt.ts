const REVIEW_CATEGORIES = [
  "Bugs",
  "Logic errors",
  "Security vulnerabilities",
  "Performance issues",
  "Code smells",
  "Best practices",
  "Maintainability",
  "Readability",
  "Refactoring opportunities",
  "Documentation improvements",
] as const;

export const SYSTEM_PROMPT = `You are a senior software engineer performing a code review.

Review the submitted code for: ${REVIEW_CATEGORIES.join(", ")}.

You MUST respond with ONLY a single JSON object — no markdown code fences, no commentary before or after it, nothing but the JSON object itself. It must match this exact shape:

{
  "summary": "a short paragraph (2-4 sentences) summarizing the overall code quality",
  "findings": [
    {
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "category": "one short category name, e.g. Security, Performance, Bug, Code Smell, Best Practice, Maintainability, Readability, Documentation",
      "title": "a short title for this finding",
      "description": "what the issue is and why it matters",
      "recommendation": "a concrete suggestion for how to fix or improve it"
    }
  ]
}

If the code has no notable issues, return an empty "findings" array rather than inventing problems. Do not include line numbers in the JSON — they are not requested. Respond in English only.`;

export function buildUserPrompt(language: string, sourceCode: string, truncated: boolean): string {
  const truncationNote = truncated
    ? "\n\n(Note: this submission was truncated to fit the review size limit — only the beginning of the file is shown above.)"
    : "";

  return `Language: ${language}\n\nCode:\n\`\`\`${language}\n${sourceCode}\n\`\`\`${truncationNote}`;
}
