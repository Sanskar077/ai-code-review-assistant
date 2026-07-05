import type { Request, Response } from "express";

import { HttpStatus } from "../constants/httpStatus";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

export const userController = {
  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const user = await userService.updateProfile(userId, req.body);
    res.status(HttpStatus.OK).json({ success: true, data: { user } });
  }),
};
