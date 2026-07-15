import type { HistoryFilters } from "@/features/history/types";

/** Builds a URLSearchParams from filter state, using repeated keys for arrays (matches the backend's expected format). */
export function buildHistoryQueryParams(filters: HistoryFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  filters.language.forEach((l) => params.append("language", l));
  filters.status.forEach((s) => params.append("status", s));
  if (filters.dateRange !== "all") params.set("dateRange", filters.dateRange);
  filters.reviewType.forEach((t) => params.append("reviewType", t));
  params.set("sortBy", filters.sortBy);
  params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize));

  return params;
}

export function hasActiveHistoryFilters(filters: HistoryFilters): boolean {
  return (
    filters.search.length > 0 ||
    filters.language.length > 0 ||
    filters.status.length > 0 ||
    filters.dateRange !== "all" ||
    filters.reviewType.length > 0
  );
}

export const SORT_LABELS: Record<HistoryFilters["sortBy"], string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  mostFindings: "Most findings",
  leastFindings: "Least findings",
  language: "Language",
  status: "Status",
};

export const STATUS_FILTER_LABELS: Record<string, string> = {
  COMPLETED: "Completed",
  FAILED: "Failed",
  PROCESSING: "Processing",
};

export const DATE_RANGE_LABELS: Record<string, string> = {
  today: "Today",
  "7days": "Last 7 days",
  "30days": "Last 30 days",
  all: "All time",
};

export const REVIEW_TYPE_LABELS: Record<string, string> = {
  static: "Static analysis",
  ai: "AI review",
  combined: "Combined review",
};
