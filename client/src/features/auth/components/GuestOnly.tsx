"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { LoadingLayout } from "@/components/layout/LoadingLayout";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/store/auth-context";

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.dashboard);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return <LoadingLayout label="Loading" />;
  }

  return <>{children}</>;
}
