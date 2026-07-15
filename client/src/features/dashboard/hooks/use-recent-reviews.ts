import { useQuery } from "@tanstack/react-query";

import { historyService } from "@/features/history/services/history.service";
import { DEFAULT_HISTORY_FILTERS } from "@/features/history/types";

/** Latest 5 reviews for the dashboard's Recent Reviews section — same list endpoint the history page uses, just one small page. */
export function useRecentReviews() {
  return useQuery({
    queryKey: ["dashboard", "recent-reviews"],
    queryFn: () =>
      historyService.list({ ...DEFAULT_HISTORY_FILTERS, pageSize: 10, page: 1 }).then((r) => r.items.slice(0, 5)),
  });
}
