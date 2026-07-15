import { ExternalLink, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { LANGUAGE_LABELS } from "@/features/review/types";
import type { ReviewListItem } from "@/features/history/types";

const STATUS_VARIANT: Record<string, "success" | "destructive" | "outline"> = {
  COMPLETED: "success",
  FAILED: "destructive",
};

interface HistoryTableProps {
  items: ReviewListItem[];
  onDeleteClick: (item: ReviewListItem) => void;
}

function HistoryTableImpl({ items, onDeleteClick }: HistoryTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Review
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Language
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Findings
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              AI Model
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
              Date
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/40">
              <td className="max-w-xs px-4 py-3">
                <Link href={ROUTES.reviewDetail(item.id)} className="font-medium text-foreground hover:underline">
                  {item.title}
                </Link>
                {item.aiSummaryPreview && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.aiSummaryPreview}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline">
                  {LANGUAGE_LABELS[item.language as keyof typeof LANGUAGE_LABELS] ?? item.language}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[item.analysisStatus] ?? "outline"}>{item.analysisStatus}</Badge>
              </td>
              <td className="px-4 py-3 text-foreground">
                {item.totalFindings}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({item.staticFindings} static, {item.aiFindings} AI)
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {item.aiModel ? (
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {item.aiModel}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={ROUTES.reviewDetail(item.id)} aria-label={`View ${item.title}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDeleteClick(item)}
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const HistoryTable = React.memo(HistoryTableImpl);
