import { ErrorCode } from "../constants/errorCode";
import { HttpStatus } from "../constants/httpStatus";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { generateToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { toSafeUser, type SafeUser } from "../utils/sanitize";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

export interface AuthResult {
  user: SafeUser;
  token: string;
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(
        "An account with this email already exists",
        HttpStatus.CONFLICT,
        ErrorCode.DUPLICATE_EMAIL
      );
    }

    const hashedPassword = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    const token = generateToken({ sub: user.id });
    return { user: toSafeUser(user), token };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmail(input.email);

    // Deliberately identical error for "no such user" and "wrong password"
    // to avoid leaking which emails are registered (user enumeration).
    if (!user) {
      throw new AppError(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS
      );
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS
      );
    }

    const token = generateToken({ sub: user.id });
    return { user: toSafeUser(user), token };
  },

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    }
    return toSafeUser(user);
  },
};
