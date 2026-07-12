import { useQuery } from "@tanstack/react-query";

import { reviewService } from "@/services/review.service";
import type { NormalizedApiError } from "@/services/api-client";
import type { Review } from "@/features/review/types";

export function useReview(reviewId: string) {
  return useQuery<Review, NormalizedApiError>({
    queryKey: ["review", reviewId],
    queryFn: () => reviewService.getById(reviewId),
    retry: false,
  });
}
