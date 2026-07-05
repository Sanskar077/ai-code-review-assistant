import { ErrorCode } from "../constants/errorCode";
import { HttpStatus } from "../constants/httpStatus";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { toSafeUser, type SafeUser } from "../utils/sanitize";
import type { UpdateProfileInput } from "../validators/auth.validator";

export const userService = {
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<SafeUser> {
    if (input.email) {
      const existingUser = await userRepository.findByEmail(input.email);
      if (existingUser && existingUser.id !== userId) {
        throw new AppError(
          "This email is already in use by another account",
          HttpStatus.CONFLICT,
          ErrorCode.DUPLICATE_EMAIL
        );
      }
    }

    const updatedUser = await userRepository.updateById(userId, input);
    return toSafeUser(updatedUser);
  },
};
