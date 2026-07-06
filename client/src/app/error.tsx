"use client";

import { useEffect } from "react";

import { ErrorLayout } from "@/components/layout/ErrorLayout";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where an error-reporting service would be
    // notified. Logged to the console for now so failures are still visible
    // during development.
    console.error(error);
  }, [error]);

  return (
    <ErrorLayout
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. Try again, or head back home."
      onRetry={reset}
    />
  );
}
