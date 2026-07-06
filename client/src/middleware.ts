import { NextResponse, type NextRequest } from "next/server";

import { GUEST_ONLY_ROUTES, PROTECTED_ROUTES, ROUTES } from "@/constants/routes";

// Must match server/src/config/env.ts COOKIE_NAME default ("acr_token").
// Kept as a literal (rather than importing server code) since the client
// and server are separate deployable apps.
const AUTH_COOKIE_NAME = "acr_token";

/**
 * This is a fast, shallow check — it only confirms a cookie exists, not
 * that it's a valid/unexpired JWT (that would require a network call the
 * edge runtime shouldn't make on every request). The real source of truth
 * is the client-side ProtectedRoute/GuestOnly, which waits on a verified
 * /auth/me response. This middleware exists purely to avoid a flash of
 * protected content before that check resolves.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (isGuestOnlyRoute && hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};
