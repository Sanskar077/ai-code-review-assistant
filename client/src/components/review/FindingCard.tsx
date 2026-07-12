import { Sparkles } from "lucide-react";
import * as React from "react";

import { CodeSnippet } from "@/components/review/CodeSnippet";
import { SeverityBadge } from "@/components/review/SeverityBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Finding } from "@/features/review/types";

interface FindingCardProps {
  finding: Finding;
  sourceCode?: string;
}

function FindingCardImpl({ finding, sourceCode }: FindingCardProps) {
  const isAI = finding.source === "ai";

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={finding.severity} />

          {isAI ? (
            <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
              <Sparkles className="h-3 w-3" />
              AI · {finding.category}
            </Badge>
          ) : (
            <Badge variant="outline">{finding.category}</Badge>
          )}

          {!isAI && (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              {finding.issue}
            </code>
          )}

          {(finding.fileName || finding.lineNumber != null) && (
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {finding.fileName ?? "submission"}
              {finding.lineNumber != null &&
                `:${finding.lineNumber}${finding.column != null ? `:${finding.column}` : ""}`}
            </span>
          )}
        </div>

        <div>
          {isAI && <p className="text-sm font-semibold text-foreground">{finding.issue}</p>}
          <p className="mt-0.5 text-sm text-foreground">{finding.explanation}</p>
        </div>

        {sourceCode && finding.lineNumber != null && (
          <CodeSnippet sourceCode={sourceCode} line={finding.lineNumber} column={finding.column} />
        )}

        {finding.suggestedFix && (
          <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">
            <span className="font-semibold">{isAI ? "Recommendation" : "Suggested fix"}:</span>{" "}
            {finding.suggestedFix}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export const FindingCard = React.memo(FindingCardImpl);
