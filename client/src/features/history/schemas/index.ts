import { z } from "zod";

export const reviewStatusFilterSchema = z.enum(["COMPLETED", "FAILED", "PROCESSING"]);
export const dateRangeFilterSchema = z.enum(["today", "7days", "30days", "all"]);
export const reviewTypeFilterSchema = z.enum(["static", "ai", "combined"]);
export const sortOptionSchema = z.enum([
  "newest",
  "oldest",
  "mostFindings",
  "leastFindings",
  "language",
  "status",
]);
export const pageSizeSchema = z.union([z.literal(10), z.literal(25), z.literal(50)]);

export const historyFiltersSchema = z.object({
  search: z.string().trim().max(200).default(""),
  language: z.array(z.string()).default([]),
  status: z.array(reviewStatusFilterSchema).default([]),
  dateRange: dateRangeFilterSchema.default("all"),
  reviewType: z.array(reviewTypeFilterSchema).default([]),
  sortBy: sortOptionSchema.default("newest"),
  page: z.number().int().positive().default(1),
  pageSize: pageSizeSchema.default(10),
});
