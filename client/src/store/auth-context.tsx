"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";

import { registerSessionExpiredHandler } from "@/services/api-client";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import type { User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Re-fetches /auth/me, e.g. after login/register succeed. */
  refetchUser: () => Promise<unknown>;
  /** Clears cached user state locally, without calling the API (used after logout). */
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const CURRENT_USER_QUERY_KEY = ["auth", "current-user"] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading, refetch } = useCurrentUser();

  useEffect(() => {
    // If any API call comes back 401 (expired/invalid cookie), drop the
    // cached user immediately so protected UI reacts without waiting for
    // the next /me refetch.
    registerSessionExpiredHandler(() => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    });
  }, [queryClient]);

  function clearUser() {
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: Boolean(user),
        refetchUser: refetch,
        clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { CURRENT_USER_QUERY_KEY };
