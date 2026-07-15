import { useMutation, useQueryClient } from "@tanstack/react-query";

import { historyService } from "@/features/history/services/history.service";
import type { NormalizedApiError } from "@/services/api-client";

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, NormalizedApiError, string>({
    mutationFn: (reviewId) => historyService.remove(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
