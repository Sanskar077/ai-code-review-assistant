"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { LoadingLayout } from "@/components/layout/LoadingLayout";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/store/auth-context";

/**
 * Wraps pages that require an authenticated session. `middleware.ts` already
 * redirects at the edge based on cookie presence, but that check is a fast,
 * shallow one (the cookie could exist yet be expired/invalid). This
 * component is the source of truth: it waits for the verified /auth/me
 * result and redirects the moment it resolves to "no user".
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingLayout label="Checking your session" />;
  }

  return <>{children}</>;
}
