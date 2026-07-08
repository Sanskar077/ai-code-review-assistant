import { z } from "zod";

import { MAX_PASTED_CODE_LENGTH, SUPPORTED_LANGUAGES } from "../constants/upload";

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be at most 200 characters");

const languageSchema = z.enum(SUPPORTED_LANGUAGES, {
  errorMap: () => ({ message: `Language must be one of: ${SUPPORTED_LANGUAGES.join(", ")}` }),
});

/** POST /api/v1/reviews — pasted code, sent as JSON. */
export const createReviewFromPasteSchema = z.object({
  title: titleSchema,
  language: languageSchema,
  sourceCode: z
    .string()
    .trim()
    .min(1, "Pasted code cannot be empty")
    .max(MAX_PASTED_CODE_LENGTH, "Pasted code is too large"),
});

/**
 * POST /api/v1/reviews/upload — multipart form fields alongside the file.
 * Multer places these in req.body as strings before the file itself is
 * validated (extension/size handled by upload.middleware.ts, emptiness
 * checked in the service once the file buffer/text is available).
 */
export const createReviewMetaSchema = z.object({
  title: titleSchema,
  language: languageSchema,
});

export type CreateReviewFromPasteInput = z.infer<typeof createReviewFromPasteSchema>;
export type CreateReviewMetaInput = z.infer<typeof createReviewMetaSchema>;
