import { apiClient } from "@/services/api-client";
import type { ApiSuccess } from "@/types/auth";
import { buildHistoryQueryParams } from "@/features/history/utils";
import type { HistoryFilters, ListReviewsResult } from "@/features/history/types";

export const historyService = {
  async list(filters: HistoryFilters): Promise<ListReviewsResult> {
    const params = buildHistoryQueryParams(filters);
    const { data } = await apiClient.get<ApiSuccess<ListReviewsResult>>(`/v1/reviews?${params.toString()}`);
    return data.data;
  },

  async remove(reviewId: string): Promise<void> {
    await apiClient.delete(`/v1/reviews/${reviewId}`);
  },
};
