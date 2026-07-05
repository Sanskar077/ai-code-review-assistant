import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";

export interface JwtPayload {
  sub: string;
}

export function generateToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

/**
 * Verifies a JWT and returns its decoded payload.
 * Throws jwt.TokenExpiredError or jwt.JsonWebTokenError on failure —
 * callers (auth middleware) are responsible for translating these into
 * AppError instances with the appropriate HTTP status/error code.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
