import type { AIReviewStatus, AnalysisStatus } from "@/features/review/types";

export type ReviewStatusFilter = "COMPLETED" | "FAILED" | "PROCESSING";
export type DateRangeFilter = "today" | "7days" | "30days" | "all";
export type ReviewTypeFilter = "static" | "ai" | "combined";
export type SortOption = "newest" | "oldest" | "mostFindings" | "leastFindings" | "language" | "status";
export type PageSize = 10 | 25 | 50;

export interface ReviewListItem {
  id: string;
  title: string;
  language: string;
  createdAt: string;
  analysisStatus: AnalysisStatus;
  aiReviewStatus: AIReviewStatus;
  totalFindings: number;
  staticFindings: number;
  aiFindings: number;
  aiModel: string | null;
  aiSummaryPreview: string | null;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListReviewsResult {
  items: ReviewListItem[];
  pagination: Pagination;
}

export interface HistoryFilters {
  search: string;
  language: string[];
  status: ReviewStatusFilter[];
  dateRange: DateRangeFilter;
  reviewType: ReviewTypeFilter[];
  sortBy: SortOption;
  page: number;
  pageSize: PageSize;
}

export const DEFAULT_HISTORY_FILTERS: HistoryFilters = {
  search: "",
  language: [],
  status: [],
  dateRange: "all",
  reviewType: [],
  sortBy: "newest",
  page: 1,
  pageSize: 10,
};
