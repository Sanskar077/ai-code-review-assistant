import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

import { env } from "../config/env";
import { ErrorCode } from "../constants/errorCode";
import { HttpStatus } from "../constants/httpStatus";
import { ALLOWED_UPLOAD_EXTENSIONS, MAX_UPLOAD_SIZE_BYTES, hasAllowedExtension } from "../constants/upload";
import { AppError } from "../utils/AppError";

export const UPLOAD_DIR = path.join(process.cwd(), env.UPLOAD_DIR);

// Ensure the upload directory exists before Multer ever needs to write to it.
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Never trust the client-supplied filename for the stored name — only
    // its (already-validated) extension. The original name is preserved
    // separately in the database for display purposes.
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (!hasAllowedExtension(file.originalname)) {
    cb(
      new AppError(
        `Unsupported file type. Allowed types: ${ALLOWED_UPLOAD_EXTENSIONS.join(", ")}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.UNSUPPORTED_FILE_TYPE
      )
    );
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
    files: 1,
  },
});
