import path from "node:path";

import { env } from "../config/env";

/** Kept in sync with the client's language dropdown (client/src/features/review/schemas.ts). */
export const SUPPORTED_LANGUAGES = ["javascript", "typescript", "python"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Allowlist of accepted file extensions for upload. This is a security
 * boundary, not a language match — the user still picks the language
 * explicitly (no auto-detection yet), so an uploaded .txt file can be
 * submitted as "python", for example.
 */
export const ALLOWED_UPLOAD_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".py", ".txt"] as const;

export const MAX_UPLOAD_SIZE_BYTES = env.MAX_UPLOAD_SIZE_MB * 1024 * 1024;

/** App-level cap on pasted source code length, independent of file uploads. */
export const MAX_PASTED_CODE_LENGTH = 500_000; // ~500 KB of text

export function hasAllowedExtension(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return (ALLOWED_UPLOAD_EXTENSIONS as readonly string[]).includes(ext);
}
