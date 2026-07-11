import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("acr_token"),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(10),
  // Optional by design: AI review must degrade gracefully (SKIPPED status)
  // when unset, not prevent the server from starting.
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default("meta-llama/llama-3.3-70b-instruct:free"),
  OPENROUTER_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),
  AI_REVIEW_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  AI_MAX_SOURCE_CHARS: z.coerce.number().int().positive().default(20_000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast: an invalid/missing environment configuration should never
  // allow the server to start in an insecure or broken state.
  console.error(
    "Invalid environment configuration:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment configuration. Check your .env file against .env.example.");
}

export const env = parsed.data;
export type Env = typeof env;
