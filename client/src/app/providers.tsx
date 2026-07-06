"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

import { createQueryClient } from "@/lib/query-client";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/store/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
