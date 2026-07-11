import { CheckCircle2, Sparkles } from "lucide-react";

import { SeverityBadge } from "@/components/review/SeverityBadge";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import type { Finding } from "@/features/review/types";

interface FindingsListProps {
  findings: Finding[];
}

export function FindingsList({ findings }: FindingsListProps) {
  if (findings.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="No issues found"
        description="Neither static analysis nor AI review flagged anything in this submission."
      />
    );
  }

  return (
    <ul className="divide-y divide-border">
      {findings.map((finding) => {
        const isAI = finding.source === "ai";

        return (
          <li key={finding.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={finding.severity} />

              {isAI ? (
                <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
                  <Sparkles className="h-3 w-3" />
                  AI · {finding.category}
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">via {finding.category}</span>
              )}

              <span
                className={cn(
                  "font-medium",
                  isAI
                    ? "text-sm text-foreground"
                    : "rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                )}
              >
                {finding.issue}
              </span>

              {finding.lineNumber != null && (
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  Line {finding.lineNumber}
                  {finding.column != null ? `:${finding.column}` : ""}
                </span>
              )}
            </div>

            <p className="text-sm text-foreground">{finding.explanation}</p>

            {finding.suggestedFix && (
              <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">
                <span className="font-semibold">{isAI ? "Recommendation" : "Suggested fix"}:</span>{" "}
                {finding.suggestedFix}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
