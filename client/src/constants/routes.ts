/**
 * Central registry of route paths. Nothing in the app should hardcode a
 * path string directly — import from here instead, so a route rename is a
 * one-line change.
 */
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  profile: "/dashboard/profile",
  newReview: "/dashboard/new-review",
  reviewHistory: "/dashboard/history",
  uploadFile: "/dashboard/new-review",
  settings: "/dashboard/settings",
  unauthorized: "/unauthorized",
} as const;

/** Routes that only make sense for a signed-out visitor. */
export const GUEST_ONLY_ROUTES: string[] = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword];

/** Routes that require an authenticated session. */
export const PROTECTED_ROUTES: string[] = [ROUTES.dashboard];
