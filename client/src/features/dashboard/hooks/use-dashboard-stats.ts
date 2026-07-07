import { useQuery } from "@tanstack/react-query";

import type { DashboardStats } from "@/features/dashboard/types";

/**
 * No `/reviews/stats` backend endpoint exists yet (review functionality is
 * a future milestone — see Day 4 scope). This resolves placeholder data
 * through the same async query shape a real fetch would use, so swapping in
 * `apiClient.get<ApiSuccess<DashboardStats>>("/reviews/stats")` later
 * requires no changes to any component that calls this hook.
 */
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return {
        totalReviews: 0,
        filesUploaded: 0,
        aiReviewsCompleted: 0,
        averageScore: null,
      };
    },
  });
}
