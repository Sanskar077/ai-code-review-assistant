import type { HttpStatusCode } from "../constants/httpStatus";
import type { ErrorCodeType } from "../constants/errorCode";

/**
 * Represents a known, expected ("operational") error — invalid credentials,
 * duplicate email, missing token, etc. — as opposed to an unexpected bug.
 * The centralized error middleware uses this distinction to decide what is
 * safe to expose to the client.
 */
export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorCode: ErrorCodeType;
  public readonly isOperational = true;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: HttpStatusCode,
    errorCode: ErrorCodeType,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
