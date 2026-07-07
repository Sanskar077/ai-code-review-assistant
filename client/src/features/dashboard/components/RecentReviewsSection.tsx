import { FileSearch } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import type { ReviewSummary } from "@/features/dashboard/types";

const columns: DataTableColumn<ReviewSummary>[] = [
  { key: "title", header: "Review", render: (row) => row.title },
  {
    key: "language",
    header: "Language",
    render: (row) => <Badge variant="outline">{row.language}</Badge>,
  },
  {
    key: "score",
    header: "Score",
    render: (row) => (row.overallScore != null ? `${row.overallScore}/100` : "—"),
  },
  {
    key: "createdAt",
    header: "Date",
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

interface RecentReviewsSectionProps {
  reviews: ReviewSummary[];
  loading: boolean;
}

export function RecentReviewsSection({ reviews, loading }: RecentReviewsSectionProps) {
  return (
    <SectionCard title="Recent reviews" description="Your most recently submitted code reviews.">
      <DataTable
        columns={columns}
        data={reviews}
        rowKey={(row) => row.id}
        loading={loading}
        emptyIcon={FileSearch}
        emptyTitle="No reviews yet"
        emptyDescription="Once you submit code for review, it'll show up here with its score and findings."
      />
    </SectionCard>
  );
}
