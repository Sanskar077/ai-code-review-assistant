import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { ErrorCode } from "../constants/errorCode";
import { HttpStatus } from "../constants/httpStatus";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

/**
 * Requires a valid JWT in the auth cookie. On success, attaches the
 * authenticated user's id to `req.user`. On failure, forwards a specific
 * AppError (missing / expired / invalid token) rather than a generic 401.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.COOKIE_NAME];

  if (!token) {
    return next(
      new AppError("Authentication required", HttpStatus.UNAUTHORIZED, ErrorCode.TOKEN_MISSING)
    );
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub };
    return next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(
        new AppError("Session expired, please log in again", HttpStatus.UNAUTHORIZED, ErrorCode.TOKEN_EXPIRED)
      );
    }
    return next(
      new AppError("Invalid authentication token", HttpStatus.UNAUTHORIZED, ErrorCode.TOKEN_INVALID)
    );
  }
}
