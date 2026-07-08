import fs from "node:fs/promises";
import path from "node:path";

import { ErrorCode } from "../constants/errorCode";
import { HttpStatus } from "../constants/httpStatus";
import { UPLOAD_DIR } from "../middleware/upload.middleware";
import { reviewRepository } from "../repositories/review.repository";
import { AppError } from "../utils/AppError";
import { createReviewMetaSchema, type CreateReviewFromPasteInput } from "../validators/review.validator";

/** Best-effort delete — an upload that fails validation shouldn't leave an orphaned file on disk. */
async function deleteUploadedFileSafely(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch {
    // Nothing more we can do here; this is already inside a failure path.
  }
}

export const reviewService = {
  async createFromPaste(userId: string, input: CreateReviewFromPasteInput) {
    return reviewRepository.createWithSubmission({
      userId,
      title: input.title,
      language: input.language,
      sourceCode: input.sourceCode,
    });
  },

  async createFromUpload(userId: string, rawMeta: unknown, file: Express.Multer.File | undefined) {
    if (!file) {
      throw new AppError("A file is required for this submission method", HttpStatus.BAD_REQUEST, ErrorCode.FILE_REQUIRED);
    }

    try {
      // Validated here (rather than via the shared `validate` middleware, which
      // would run before this try/catch) so a validation failure still
      // triggers cleanup of the file Multer already wrote to disk.
      const meta = createReviewMetaSchema.parse(rawMeta);

      if (file.size === 0) {
        throw new AppError("The uploaded file is empty", HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.EMPTY_FILE);
      }

      let sourceCode: string;
      try {
        sourceCode = await fs.readFile(file.path, "utf-8");
      } catch {
        throw new AppError(
          "The uploaded file could not be read as text",
          HttpStatus.UNPROCESSABLE_ENTITY,
          ErrorCode.VALIDATION_ERROR
        );
      }

      if (sourceCode.trim().length === 0) {
        throw new AppError("The uploaded file is empty", HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.EMPTY_FILE);
      }

      const storagePath = path.relative(UPLOAD_DIR, file.path);

      return await reviewRepository.createWithSubmission({
        userId,
        title: meta.title,
        language: meta.language,
        sourceCode,
        fileName: file.originalname,
        storagePath,
      });
    } catch (error) {
      await deleteUploadedFileSafely(file.path);
      throw error;
    }
  },
};
