import { ExternalLink, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { LANGUAGE_LABELS } from "@/features/review/types";
import type { ReviewListItem } from "@/features/history/types";

const STATUS_VARIANT: Record<string, "success" | "destructive" | "outline"> = {
  COMPLETED: "success",
  FAILED: "destructive",
};

interface HistoryCardProps {
  item: ReviewListItem;
  onDeleteClick: (item: ReviewListItem) => void;
}

function HistoryCardImpl({ item, onDeleteClick }: HistoryCardProps) {
  return (
    <Card className="md:hidden">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={ROUTES.reviewDetail(item.id)} className="font-medium text-foreground hover:underline">
            {item.title}
          </Link>
          <Badge variant={STATUS_VARIANT[item.analysisStatus] ?? "outline"}>{item.analysisStatus}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">
            {LANGUAGE_LABELS[item.language as keyof typeof LANGUAGE_LABELS] ?? item.language}
          </Badge>
          <span>{item.totalFindings} findings</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>

        {item.aiModel && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            {item.aiModel}
          </p>
        )}

        {item.aiSummaryPreview && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.aiSummaryPreview}</p>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.reviewDetail(item.id)}>
              <ExternalLink className="h-3.5 w-3.5" />
              View
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDeleteClick(item)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export const HistoryCard = React.memo(HistoryCardImpl);
