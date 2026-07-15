import { ExternalLink, FileSearch } from "lucide-react";
import Link from "next/link";

import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { ReviewListItem } from "@/features/history/types";

const STATUS_VARIANT: Record<string, "success" | "destructive" | "outline"> = {
  COMPLETED: "success",
  FAILED: "destructive",
};

const columns: DataTableColumn<ReviewListItem>[] = [
  {
    key: "title",
    header: "Review",
    render: (row) => (
      <Link href={ROUTES.reviewDetail(row.id)} className="font-medium text-foreground hover:underline">
        {row.title}
      </Link>
    ),
  },
  {
    key: "language",
    header: "Language",
    render: (row) => <Badge variant="outline">{row.language}</Badge>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={STATUS_VARIANT[row.analysisStatus] ?? "outline"}>{row.analysisStatus}</Badge>
    ),
  },
  {
    key: "findings",
    header: "Findings",
    render: (row) => row.totalFindings,
  },
  {
    key: "createdAt",
    header: "Date",
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    key: "actions",
    header: "",
    render: (row) => (
      <Button variant="ghost" size="sm" asChild className="h-7 px-2">
        <Link href={ROUTES.reviewDetail(row.id)} aria-label={`View ${row.title}`}>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </Button>
    ),
  },
];

interface RecentReviewsSectionProps {
  reviews: ReviewListItem[];
  loading: boolean;
}

export function RecentReviewsSection({ reviews, loading }: RecentReviewsSectionProps) {
  return (
    <SectionCard
      title="Recent reviews"
      description="Your most recently submitted code reviews."
      action={
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.reviewHistory}>View all</Link>
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={reviews}
        rowKey={(row) => row.id}
        loading={loading}
        emptyIcon={FileSearch}
        emptyTitle="No reviews yet"
        emptyDescription="Once you submit code for review, it'll show up here with its status and findings."
      />
    </SectionCard>
  );
}
