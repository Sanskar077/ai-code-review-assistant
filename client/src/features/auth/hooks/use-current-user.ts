import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type { NormalizedApiError } from "@/services/api-client";

export const CURRENT_USER_QUERY_KEY = ["auth", "current-user"] as const;

export function useCurrentUser() {
  return useQuery<import("@/types/auth").User | null, NormalizedApiError>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      try {
        return await authService.getCurrentUser();
      } catch (error) {
        const apiError = error as NormalizedApiError;
        // No session is a normal, expected state for a guest — not a
        // fetch failure the UI should surface as an error.
        if (apiError.status === 401) return null;
        throw error;
      }
    },
    retry: false,
  });
}
