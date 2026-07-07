import { useQuery } from "@tanstack/react-query";

import type { ReviewSummary } from "@/features/dashboard/types";

/** No `/reviews` list endpoint exists yet — see use-dashboard-stats.ts for the pattern this follows. */
export function useRecentReviews() {
  return useQuery<ReviewSummary[]>({
    queryKey: ["dashboard", "recent-reviews"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return [];
    },
  });
}
