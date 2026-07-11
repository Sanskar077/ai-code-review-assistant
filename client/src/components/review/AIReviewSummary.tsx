import { AlertCircle, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AIReviewStatus } from "@/features/review/types";

interface AIReviewSummaryProps {
  status: AIReviewStatus;
  summary: string | null;
  error: string | null;
}

export function AIReviewSummary({ status, summary, error }: AIReviewSummaryProps) {
  if (status === "COMPLETED" && summary) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">AI Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground">{summary}</CardContent>
      </Card>
    );
  }

  if (status === "FAILED" || status === "SKIPPED") {
    return (
      <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          {error ?? "AI review was unavailable for this submission."} Static analysis results are shown below.
        </span>
      </div>
    );
  }

  // PENDING / IN_PROGRESS: shouldn't normally be visible since the API call
  // resolves synchronously, but handled defensively.
  return null;
}
