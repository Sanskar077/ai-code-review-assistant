import { z } from "zod";

import { SUPPORTED_LANGUAGES } from "../constants/upload";

const PAGE_SIZES = [10, 25, 50] as const;

const REVIEW_STATUS_FILTERS = ["COMPLETED", "FAILED", "PROCESSING"] as const;
const DATE_RANGE_FILTERS = ["today", "7days", "30days", "all"] as const;
const REVIEW_TYPE_FILTERS = ["static", "ai", "combined"] as const;
const SORT_OPTIONS = [
  "newest",
  "oldest",
  "mostFindings",
  "leastFindings",
  "language",
  "status",
] as const;

/** Query params arrive as either a single string or an array (repeated keys, e.g. ?language=js&language=py) — normalize to an array either way. */
function toArray<T extends string>(allowed: readonly T[]) {
  return z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => {
      if (v === undefined) return [];
      const arr = Array.isArray(v) ? v : [v];
      return arr.filter((item): item is T => (allowed as readonly string[]).includes(item));
    });
}

export const listReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((v): v is (typeof PAGE_SIZES)[number] => (PAGE_SIZES as readonly number[]).includes(v), {
      message: "pageSize must be 10, 25, or 50",
    })
    .default(10),
  search: z.string().trim().max(200).optional(),
  language: toArray(SUPPORTED_LANGUAGES),
  status: toArray(REVIEW_STATUS_FILTERS),
  dateRange: z.enum(DATE_RANGE_FILTERS).default("all"),
  reviewType: toArray(REVIEW_TYPE_FILTERS),
  sortBy: z.enum(SORT_OPTIONS).default("newest"),
});

export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;
