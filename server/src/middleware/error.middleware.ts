import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";

import { env } from "../config/env";
import { ErrorCode } from "../constants/errorCode";
import { HttpStatus } from "../constants/httpStatus";
import { AppError } from "../utils/AppError";

export function notFoundHandler(req: Request, res: Response) {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    error: {
      code: ErrorCode.NOT_FOUND,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
}

/**
 * Single point of error handling for the entire API. Every route relies on
 * this middleware (via asyncHandler / next(err)) instead of handling errors
 * ad hoc, so response shape and status codes stay consistent everywhere.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.errorCode, message: err.message, details: err.details },
    });
  }

  if (err instanceof ZodError) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: "Validation failed",
        details: err.flatten(),
      },
    });
  }

  if (err instanceof multer.MulterError) {
    const isTooLarge = err.code === "LIMIT_FILE_SIZE";
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      error: {
        code: isTooLarge ? ErrorCode.FILE_TOO_LARGE : ErrorCode.VALIDATION_ERROR,
        message: isTooLarge
          ? "File is too large. Please upload a smaller file."
          : `File upload failed: ${err.message}`,
      },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(HttpStatus.CONFLICT).json({
        success: false,
        error: {
          code: ErrorCode.DUPLICATE_EMAIL,
          message: "A record with these details already exists",
        },
      });
    }
    if (err.code === "P2025") {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: { code: ErrorCode.NOT_FOUND, message: "Requested record was not found" },
      });
    }
  }

  // Unexpected/programmer error: log full detail server-side, but never
  // leak internals to the client in production.
  console.error("Unhandled error:", err);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message:
        env.NODE_ENV === "production" ? "Something went wrong" : (err as Error)?.message ?? "Unknown error",
    },
  });
}
