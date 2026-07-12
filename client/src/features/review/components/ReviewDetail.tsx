"use client";

import { FileQuestion, History, Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AIInsightsCard } from "@/components/review/AIInsightsCard";
import { FindingCard } from "@/components/review/FindingCard";
import { FindingsFilterBar } from "@/components/review/FindingsFilterBar";
import { ReviewDetailSkeleton } from "@/components/review/ReviewDetailSkeleton";
import { ReviewSummaryCard } from "@/components/review/ReviewSummaryCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { SearchInput } from "@/components/common/SearchInput";
import { ErrorLayout } from "@/components/layout/ErrorLayout";
import { ROUTES } from "@/constants/routes";
import { useReview } from "@/features/review/hooks/use-review";
import { useSetBreadcrumbLabel } from "@/hooks/use-set-breadcrumb-label";

interface ReviewDetailProps {
  reviewId: string;
}

export function ReviewDetail({ reviewId }: ReviewDetailProps) {
  const { data: review, isLoading, error, refetch } = useReview(reviewId);

  useSetBreadcrumbLabel(review?.title);

  const [search, setSearch] = React.useState("");
  const [severities, setSeverities] = React.useState<Set<string>>(new Set());
  const [categories, setCategories] = React.useState<Set<string>>(new Set());
  const [sources, setSources] = React.useState<Set<string>>(new Set());

  const availableCategories = React.useMemo(() => {
    if (!review) return [];
    return [...new Set(review.findings.map((f) => f.category))].sort();
  }, [review]);

  const availableSources = React.useMemo(() => {
    if (!review) return [];
    return [...new Set(review.findings.map((f) => f.source).filter((s): s is string => Boolean(s)))];
  }, [review]);

  const filteredFindings = React.useMemo(() => {
    if (!review) return [];
    const query = search.trim().toLowerCase();

    return review.findings.filter((f) => {
      if (severities.size > 0 && !severities.has(f.severity)) return false;
      if (categories.size > 0 && !categories.has(f.category)) return false;
      if (sources.size > 0 && !sources.has(f.source ?? "")) return false;

      if (query) {
        const haystack = `${f.issue} ${f.explanation} ${f.suggestedFix ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [review, search, severities, categories, sources]);

  const hasActiveFilters =
    severities.size > 0 || categories.size > 0 || sources.size > 0 || search.length > 0;

  function toggleInSet(setter: React.Dispatch<React.SetStateAction<Set<string>>>) {
    return (value: string) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return next;
      });
    };
  }

  function clearAllFilters() {
    setSearch("");
    setSeverities(new Set());
    setCategories(new Set());
    setSources(new Set());
  }

  if (isLoading) {
    return <ReviewDetailSkeleton />;
  }

  if (error) {
    if (error.status === 404) {
      return (
        <EmptyState
          icon={FileQuestion}
          title="Review not found"
          description="This review doesn't exist, or you don't have access to it."
          action={
            <Button asChild className="mt-2">
              <Link href={ROUTES.dashboard}>Back to dashboard</Link>
            </Button>
          }
        />
      );
    }

    return (
      <ErrorLayout title="Couldn't load this review" description={error.message} onRetry={() => refetch()} />
    );
  }

  if (!review) return null;

  const sourceCode = review.submissions[0]?.sourceCode;

  return (
    <div className="space-y-6">
      <nav aria-label="Review navigation" className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.dashboard}>Back to dashboard</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.newReview}>
            <Plus />
            New review
          </Link>
        </Button>
        <span
          className="flex cursor-not-allowed items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground/50"
          aria-disabled="true"
        >
          <History className="h-4 w-4" />
          Review history
          <Badge variant="secondary" className="text-[10px]">
            Soon
          </Badge>
        </span>
      </nav>

      <ReviewSummaryCard review={review} />

      <AIInsightsCard review={review} />

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Findings ({review.findings.length})
          </h2>
          <div className="w-full sm:max-w-xs">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search findings…"
              aria-label="Search findings"
            />
          </div>
        </div>

        <FindingsFilterBar
          availableCategories={availableCategories}
          availableSources={availableSources}
          selectedSeverities={severities}
          selectedCategories={categories}
          selectedSources={sources}
          onToggleSeverity={toggleInSet(setSeverities)}
          onToggleCategory={toggleInSet(setCategories)}
          onToggleSource={toggleInSet(setSources)}
          onClearAll={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {review.findings.length === 0 ? (
          <EmptyState
            title="No issues found"
            description="Neither static analysis nor AI review flagged anything in this submission."
          />
        ) : filteredFindings.length === 0 ? (
          <EmptyState
            title="No matching findings"
            description="Try adjusting your search or filters."
            action={
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-2">
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredFindings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} sourceCode={sourceCode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
