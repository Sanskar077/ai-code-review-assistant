import type { Request, Response } from "express";

import { HttpStatus } from "../constants/httpStatus";
import { reviewService } from "../services/review.service";
import { asyncHandler } from "../utils/asyncHandler";
import type { CreateReviewFromPasteInput } from "../validators/review.validator";
import type { ListReviewsQuery } from "../validators/reviewQuery.validator";

export const reviewController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = res.locals.query as ListReviewsQuery;
    const result = await reviewService.list(req.user!.id, query);
    res.status(HttpStatus.OK).json({ success: true, data: result });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await reviewService.remove(req.user!.id, req.params.id);
    res.status(HttpStatus.OK).json({ success: true, data: null });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.getById(req.user!.id, req.params.id);
    res.status(HttpStatus.OK).json({ success: true, data: { review } });
  }),

  createFromPaste: asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as CreateReviewFromPasteInput;
    const review = await reviewService.createFromPaste(req.user!.id, input);

    res.status(HttpStatus.CREATED).json({ success: true, data: { review } });
  }),

  createFromUpload: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.createFromUpload(req.user!.id, req.body, req.file);

    res.status(HttpStatus.CREATED).json({ success: true, data: { review } });
  }),
};
