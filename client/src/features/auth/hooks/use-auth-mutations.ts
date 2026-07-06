import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CURRENT_USER_QUERY_KEY } from "@/features/auth/hooks/use-current-user";
import { authService } from "@/services/auth.service";
import type { NormalizedApiError } from "@/services/api-client";
import type { LoginPayload, RegisterPayload, User } from "@/types/auth";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<User, NormalizedApiError, LoginPayload>({
    mutationFn: authService.login,
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation<User, NormalizedApiError, RegisterPayload>({
    mutationFn: authService.register,
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation<void, NormalizedApiError, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    },
    // Even if the network call fails, the user's intent was to leave the
    // session — clear local state so the UI doesn't strand them logged in.
    onError: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    },
  });
}
