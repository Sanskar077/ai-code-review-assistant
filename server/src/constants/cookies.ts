import type { CookieOptions } from "express";

import { env } from "../config/env";
import { parseDurationToMs } from "../utils/duration";

/**
 * Options for the HTTP-only JWT cookie. Centralized here so the same
 * options are used both when setting the cookie (register/login) and when
 * clearing it (logout) — mismatched options are a common cause of cookies
 * that fail to clear.
 */
export function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseDurationToMs(env.JWT_EXPIRES_IN),
    path: "/",
  };
}
