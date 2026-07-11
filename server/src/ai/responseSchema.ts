import { z } from "zod";

export const aiFindingSchema = z.object({
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  category: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  recommendation: z.string().trim().min(1).max(2000),
});

export const aiResponseSchema = z.object({
  summary: z.string().trim().min(1).max(2000),
  findings: z.array(aiFindingSchema).max(100),
});

export type AIResponsePayload = z.infer<typeof aiResponseSchema>;

/**
 * Parses the model's raw text output as JSON, tolerating the common case of
 * a model wrapping the object in a markdown code fence despite being told
 * not to. Returns null (never throws) so the caller can map this to a
 * proper AIProviderError with full context.
 */
export function tryParseAIResponse(rawText: string): AIResponsePayload | null {
  const candidates = [rawText.trim()];

  const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) candidates.push(fenced[1].trim());

  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(rawText.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      const json = JSON.parse(candidate);
      const result = aiResponseSchema.safeParse(json);
      if (result.success) return result.data;
    } catch {
      // Try the next candidate extraction strategy.
    }
  }

  return null;
}
