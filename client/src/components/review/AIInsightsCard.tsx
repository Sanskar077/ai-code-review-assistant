import { AlertCircle, Sparkles } from "lucide-react";

import { SeverityBadge } from "@/components/review/SeverityBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Review } from "@/features/review/types";
import { getTopAIFinding, severityCounts } from "@/features/review/utils";

const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

export function AIInsightsCard({ review }: { review: Review }) {
  if (review.aiReviewStatus === "FAILED" || review.aiReviewStatus === "SKIPPED") {
    return (
      <Card className="border-border bg-muted/30">
        <CardContent className="flex items-start gap-3 p-6 text-sm text-muted-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {review.aiReviewError ?? "AI review was unavailable for this submission."} Static analysis
            results are still shown below.
          </span>
        </CardContent>
      </Card>
    );
  }

  if (review.aiReviewStatus !== "COMPLETED" || !review.aiSummary) {
    return null;
  }

  const aiFindings = review.findings.filter((f) => f.source === "ai");
  const counts = severityCounts(aiFindings);
  const topFinding = getTopAIFinding(review.findings);

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Sparkles className="h-4 w-4 text-primary" />
        <CardTitle className="text-base">AI Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Executive summary
          </p>
          <p className="mt-1.5 text-sm text-foreground">{review.aiSummary}</p>
        </div>

        {aiFindings.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Overall assessment
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {SEVERITY_ORDER.filter((s) => counts[s] > 0).map((s) => (
                <Badge key={s} variant="outline" className="gap-1">
                  {counts[s]} {s.charAt(0) + s.slice(1).toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {aiFindings.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Main concerns
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {aiFindings.slice(0, 5).map((f) => (
                <li key={f.id} className="flex items-start gap-2 text-sm">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-foreground">{f.issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Final recommendation
          </p>
          <p className="mt-1.5 text-sm text-foreground">
            {topFinding?.suggestedFix ??
              "No specific recommendations — the AI review found no significant issues."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
