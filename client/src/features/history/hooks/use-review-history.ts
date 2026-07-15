import { useQuery } from "@tanstack/react-query";

import { historyService } from "@/features/history/services/history.service";
import type { HistoryFilters, ListReviewsResult } from "@/features/history/types";
import type { NormalizedApiError } from "@/services/api-client";

export function useReviewHistory(filters: HistoryFilters) {
  return useQuery<ListReviewsResult, NormalizedApiError>({
    queryKey: ["reviews", "list", filters],
    queryFn: () => historyService.list(filters),
    placeholderData: (previousData) => previousData, // keeps the old page visible while the next one loads, avoiding layout flash
  });
}
