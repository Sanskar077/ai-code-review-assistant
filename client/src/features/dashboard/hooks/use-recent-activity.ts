import { useQuery } from "@tanstack/react-query";

import type { ActivityItem } from "@/features/dashboard/types";

/** No activity feed endpoint exists yet — see use-dashboard-stats.ts for the pattern this follows. */
export function useRecentActivity() {
  return useQuery<ActivityItem[]>({
    queryKey: ["dashboard", "recent-activity"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return [];
    },
  });
}
