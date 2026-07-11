export type AIProviderErrorCode =
  | "MISSING_API_KEY"
  | "INVALID_API_KEY"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "INVALID_RESPONSE"
  | "PROVIDER_UNAVAILABLE"
  | "NETWORK_ERROR";

export class AIProviderError extends Error {
  readonly code: AIProviderErrorCode;

  constructor(code: AIProviderErrorCode, message: string) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
  }
}
