import { z } from "zod";

import { SUPPORTED_LANGUAGES } from "@/features/review/types";

// Mirrors server/src/constants/upload.ts exactly.
export const ALLOWED_UPLOAD_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".py", ".txt"] as const;
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_PASTED_CODE_LENGTH = 500_000;

const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be at most 200 characters");

const languageSchema = z.enum(SUPPORTED_LANGUAGES, {
  errorMap: () => ({ message: "Please select a language" }),
});

export function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_UPLOAD_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * A single schema (rather than a discriminated union) so one React Hook
 * Form instance can drive both submission methods — `method` just changes
 * which cross-field checks in `superRefine` apply.
 */
export const reviewFormSchema = z
  .object({
    method: z.enum(["paste", "upload"]),
    title: titleSchema,
    language: languageSchema.or(z.literal("")),
    sourceCode: z.string().optional(),
    file: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.language === "") {
      ctx.addIssue({ path: ["language"], code: z.ZodIssueCode.custom, message: "Please select a language" });
    }

    if (data.method === "paste") {
      const code = data.sourceCode?.trim() ?? "";
      if (code.length === 0) {
        ctx.addIssue({
          path: ["sourceCode"],
          code: z.ZodIssueCode.custom,
          message: "Please write or paste some code",
        });
      } else if (code.length > MAX_PASTED_CODE_LENGTH) {
        ctx.addIssue({
          path: ["sourceCode"],
          code: z.ZodIssueCode.custom,
          message: "That's too much code for a single submission",
        });
      }
    } else {
      if (!data.file) {
        ctx.addIssue({ path: ["file"], code: z.ZodIssueCode.custom, message: "Please choose a file" });
      } else {
        if (data.file.size === 0) {
          ctx.addIssue({ path: ["file"], code: z.ZodIssueCode.custom, message: "The selected file is empty" });
        } else if (data.file.size > MAX_UPLOAD_SIZE_BYTES) {
          ctx.addIssue({ path: ["file"], code: z.ZodIssueCode.custom, message: "File must be 10 MB or smaller" });
        } else if (!hasAllowedExtension(data.file.name)) {
          ctx.addIssue({
            path: ["file"],
            code: z.ZodIssueCode.custom,
            message: `Allowed file types: ${ALLOWED_UPLOAD_EXTENSIONS.join(", ")}`,
          });
        }
      }
    }
  });

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
