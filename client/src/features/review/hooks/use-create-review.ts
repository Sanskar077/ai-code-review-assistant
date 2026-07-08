import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reviewService } from "@/services/review.service";
import type { NormalizedApiError } from "@/services/api-client";
import type { CreateReviewFromPastePayload, CreateReviewFromUploadPayload } from "@/services/review.service";
import type { Review } from "@/features/review/types";

export function useCreateReviewFromPaste() {
  const queryClient = useQueryClient();
  return useMutation<Review, NormalizedApiError, CreateReviewFromPastePayload>({
    mutationFn: reviewService.createFromPaste,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateReviewFromUpload() {
  const queryClient = useQueryClient();
  return useMutation<Review, NormalizedApiError, CreateReviewFromUploadPayload>({
    mutationFn: reviewService.createFromUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
