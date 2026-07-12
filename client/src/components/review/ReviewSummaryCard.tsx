import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LANGUAGE_LABELS } from "@/features/review/types";
import type { Review } from "@/features/review/types";
import {
  countBySource,
  formatDuration,
  getReviewDisplayStatus,
  REVIEW_STATUS_LABEL,
} from "@/features/review/utils";

const STATUS_BADGE_VARIANT = {
  complete: "success",
  partial: "secondary",
  failed: "destructive",
  processing: "outline",
} as const;

interface StatRowProps {
  label: string;
  value: React.ReactNode;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export function ReviewSummaryCard({ review }: { review: Review }) {
  const status = getReviewDisplayStatus(review);
  const { staticCount, aiCount, total } = countBySource(review.findings);
  const languageLabel =
    LANGUAGE_LABELS[review.language as keyof typeof LANGUAGE_LABELS] ?? review.language;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{review.title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(review.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <Badge variant={STATUS_BADGE_VARIANT[status]}>{REVIEW_STATUS_LABEL[status]}</Badge>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        <StatRow label="Language" value={languageLabel} />
        <StatRow label="Total findings" value={total} />
        <StatRow label="Static analysis findings" value={staticCount} />
        <StatRow label="AI review findings" value={aiCount} />
        <StatRow label="Static analysis duration" value={formatDuration(review.analysisProcessingTimeMs)} />
        <StatRow label="AI review duration" value={formatDuration(review.aiProcessingTimeMs)} />
        <StatRow label="AI provider" value={review.aiProvider ?? "—"} />
        <StatRow label="AI model" value={review.aiModel ?? "—"} />
      </CardContent>
    </Card>
  );
}
