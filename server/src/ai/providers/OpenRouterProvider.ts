import { env } from "../../config/env";
import { sanitizeAIText } from "../../utils/sanitizeText";
import { AIProviderError } from "../errors";
import { buildUserPrompt, SYSTEM_PROMPT } from "../prompt";
import { tryParseAIResponse } from "../responseSchema";
import type { AIFinding, AIProvider, AIReviewInput, AIReviewResult } from "../types";

interface OpenRouterChatResponse {
  choices?: { message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

export class OpenRouterProvider implements AIProvider {
  readonly name = "OpenRouter";
  readonly model: string;

  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxSourceChars: number;

  constructor() {
    this.apiKey = env.OPENROUTER_API_KEY;
    this.model = env.OPENROUTER_MODEL;
    this.baseUrl = env.OPENROUTER_BASE_URL;
    this.timeoutMs = env.AI_REVIEW_TIMEOUT_MS;
    this.maxSourceChars = env.AI_MAX_SOURCE_CHARS;
  }

  async review({ sourceCode, language }: AIReviewInput): Promise<AIReviewResult> {
    if (!this.apiKey) {
      throw new AIProviderError("MISSING_API_KEY", "No OpenRouter API key is configured");
    }

    const truncated = sourceCode.length > this.maxSourceChars;
    const truncatedCode = truncated ? sourceCode.slice(0, this.maxSourceChars) : sourceCode;

    const startedAt = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          // Required/recommended by OpenRouter to identify the calling app.
          "HTTP-Referer": env.CLIENT_URL,
          "X-Title": "AI Code Review Assistant",
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.2,
          max_tokens: 2000,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(language, truncatedCode, truncated) },
          ],
        }),
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new AIProviderError("TIMEOUT", `AI review timed out after ${this.timeoutMs}ms`);
      }
      throw new AIProviderError("NETWORK_ERROR", "Could not reach the AI provider");
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 401 || response.status === 403) {
      throw new AIProviderError("INVALID_API_KEY", "The AI provider rejected the configured API key");
    }
    if (response.status === 429) {
      throw new AIProviderError("RATE_LIMITED", "The AI provider's rate limit was exceeded");
    }
    if (response.status >= 500) {
      throw new AIProviderError("PROVIDER_UNAVAILABLE", `The AI provider returned a server error (${response.status})`);
    }
    if (!response.ok) {
      throw new AIProviderError("PROVIDER_UNAVAILABLE", `The AI provider returned an unexpected status (${response.status})`);
    }

    let body: OpenRouterChatResponse;
    try {
      body = (await response.json()) as OpenRouterChatResponse;
    } catch {
      throw new AIProviderError("INVALID_RESPONSE", "The AI provider's response was not valid JSON");
    }

    const rawText = body.choices?.[0]?.message?.content;
    if (!rawText) {
      throw new AIProviderError("INVALID_RESPONSE", "The AI provider returned an empty response");
    }

    const parsed = tryParseAIResponse(rawText);
    if (!parsed) {
      throw new AIProviderError("INVALID_RESPONSE", "The AI provider's response did not match the expected format");
    }

    const findings: AIFinding[] = parsed.findings.map((f) => ({
      severity: f.severity,
      category: sanitizeAIText(f.category),
      title: sanitizeAIText(f.title),
      description: sanitizeAIText(f.description),
      recommendation: sanitizeAIText(f.recommendation),
    }));

    return {
      summary: sanitizeAIText(parsed.summary),
      findings,
      provider: this.name,
      model: this.model,
      processingTimeMs: Date.now() - startedAt,
      tokenUsage: {
        promptTokens: body.usage?.prompt_tokens ?? null,
        completionTokens: body.usage?.completion_tokens ?? null,
      },
    };
  }
}
