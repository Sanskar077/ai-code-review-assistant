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
  const isProduction = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    // Must be true whenever sameSite is "none" — browsers reject
    // third-party cookies over plain HTTP regardless of this flag.
    secure: isProduction,
    // Vercel (client) and Render (server) are different sites, so the
    // cookie must be sent cross-site. "lax" silently gets dropped on
    // cross-origin requests, causing "logged in" to never stick after
    // register/login even though the request itself succeeds.
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseDurationToMs(env.JWT_EXPIRES_IN),
    path: "/",
  };
}
