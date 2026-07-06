/**
 * User-facing copy for error and status states. Keeping these here (rather
 * than inline in components) means the backend's internal error codes never
 * leak to the UI — every backend ErrorCode maps to one of these strings.
 */
export const AUTH_MESSAGES = {
  invalidCredentials: "That email or password doesn't match our records.",
  duplicateEmail: "An account with this email already exists.",
  sessionExpired: "Your session has expired. Please sign in again.",
  unauthorized: "You need to sign in to view this page.",
  networkError: "We couldn't reach the server. Check your connection and try again.",
  serverUnavailable: "Something went wrong on our end. Please try again shortly.",
  unknownError: "Something unexpected happened. Please try again.",
  registerSuccess: "Account created. Welcome aboard!",
  loginSuccess: "Welcome back!",
  logoutSuccess: "You've been signed out.",
} as const;

/** Maps a backend ErrorCode (see server/src/constants/errorCode.ts) to safe, user-facing copy. */
export function messageForErrorCode(code: string | undefined): string {
  switch (code) {
    case "INVALID_CREDENTIALS":
      return AUTH_MESSAGES.invalidCredentials;
    case "DUPLICATE_EMAIL":
      return AUTH_MESSAGES.duplicateEmail;
    case "TOKEN_EXPIRED":
      return AUTH_MESSAGES.sessionExpired;
    case "UNAUTHORIZED":
    case "TOKEN_MISSING":
    case "TOKEN_INVALID":
      return AUTH_MESSAGES.unauthorized;
    case "RATE_LIMIT_EXCEEDED":
      return "Too many attempts. Please wait a moment and try again.";
    case "VALIDATION_ERROR":
      return "Please check the form for errors.";
    default:
      return AUTH_MESSAGES.unknownError;
  }
}
