import type { Request, Response } from "express";

import { env } from "../config/env";
import { cookieOptions } from "../constants/cookies";
import { HttpStatus } from "../constants/httpStatus";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.register(req.body);
    res.cookie(env.COOKIE_NAME, token, cookieOptions());
    res.status(HttpStatus.CREATED).json({ success: true, data: { user } });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.login(req.body);
    res.cookie(env.COOKIE_NAME, token, cookieOptions());
    res.status(HttpStatus.OK).json({ success: true, data: { user } });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(env.COOKIE_NAME, cookieOptions());
    res.status(HttpStatus.OK).json({ success: true, data: null });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const user = await authService.getCurrentUser(userId);
    res.status(HttpStatus.OK).json({ success: true, data: { user } });
  }),
};
