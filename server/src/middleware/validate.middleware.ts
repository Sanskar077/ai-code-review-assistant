import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

import { ErrorCode } from "../constants/errorCode";
import { HttpStatus } from "../constants/httpStatus";
import { AppError } from "../utils/AppError";

/**
 * Validates and sanitizes `req.body` against the given Zod schema.
 * Never trusts client input directly — on failure, forwards a structured
 * AppError to the centralized error handler instead of the raw ZodError.
 *
 * Typed as `ZodTypeAny` rather than `AnyZodObject` so schemas that use
 * `.refine()` / `.transform()` (e.g. updateProfileSchema, which becomes a
 * ZodEffects, not a plain ZodObject) are still accepted.
 */
export function validate(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.flatten();
      return next(
        new AppError("Validation failed", HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_ERROR, details)
      );
    }

    req.body = result.data;
    next();
  };
}

/**
 * Same pattern as validate(), for query string params instead of the body.
 * The parsed, coerced result (e.g. page/pageSize as numbers, repeated keys
 * normalized to arrays) is attached to res.locals.query rather than
 * reassigned onto req.query, since Express's Request.query is typed
 * read-only in this version and some setups make it a getter-only property
 * at runtime.
 */
export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const details = result.error.flatten();
      return next(
        new AppError("Invalid query parameters", HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_ERROR, details)
      );
    }

    res.locals.query = result.data;
    next();
  };
}
