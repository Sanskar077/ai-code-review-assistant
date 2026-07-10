import { CheckCircle2 } from "lucide-react";

import { SeverityBadge } from "@/components/review/SeverityBadge";
import { EmptyState } from "@/components/common/EmptyState";
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
        description="Static analysis didn't flag anything in this submission."
      />
    );
  }

  return (
    <ul className="divide-y divide-border">
      {findings.map((finding) => (
        <li key={finding.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={finding.severity} />
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              {finding.issue}
            </code>
            <span className="text-xs text-muted-foreground">via {finding.category}</span>
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
              <span className="font-semibold">Suggested fix:</span> {finding.suggestedFix}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
