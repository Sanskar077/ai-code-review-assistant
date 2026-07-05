import rateLimit from "express-rate-limit";

import { ErrorCode } from "../constants/errorCode";

/**
 * Limits register/login attempts per IP to slow down credential-stuffing
 * and brute-force attacks against authentication endpoints.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: "Too many attempts. Please try again later.",
    },
  },
});
