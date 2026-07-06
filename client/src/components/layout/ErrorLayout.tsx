"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";

interface ErrorLayoutProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorLayout({
  title = "Something went wrong",
  description = "An unexpected error occurred. You can try again, and if the problem continues, please come back later.",
  onRetry,
}: ErrorLayoutProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <EmptyState
        icon={AlertTriangle}
        title={title}
        description={description}
        action={
          onRetry && (
            <Button onClick={onRetry} className="mt-2">
              Try again
            </Button>
          )
        }
      />
    </div>
  );
}
