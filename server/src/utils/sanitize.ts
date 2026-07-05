import type { User } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

/**
 * Removes the password hash from a User record. This must be called on
 * every User object before it leaves the service layer, so a hashed
 * password can never leak into an API response by accident.
 */
export function toSafeUser(user: User): SafeUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}
