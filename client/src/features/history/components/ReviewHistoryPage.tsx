"use client";

import * as React from "react";

import { EmptyHistoryState } from "@/features/history/components/EmptyHistoryState";
import { DeleteReviewDialog } from "@/features/history/components/DeleteReviewDialog";
import { FilterPanel } from "@/features/history/components/FilterPanel";
import { HistoryCard } from "@/features/history/components/HistoryCard";
import { HistorySkeleton } from "@/features/history/components/HistorySkeleton";
import { HistoryTable } from "@/features/history/components/HistoryTable";
import { Pagination } from "@/features/history/components/Pagination";
import { SearchBar } from "@/features/history/components/SearchBar";
import { SortDropdown } from "@/features/history/components/SortDropdown";
import { useDeleteReview } from "@/features/history/hooks/use-delete-review";
import { useReviewHistory } from "@/features/history/hooks/use-review-history";
import { DEFAULT_HISTORY_FILTERS, type HistoryFilters, type ReviewListItem } from "@/features/history/types";
import { hasActiveHistoryFilters } from "@/features/history/utils";
import { ErrorLayout } from "@/components/layout/ErrorLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

function toggleInArray<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function ReviewHistoryPage() {
  const [searchInput, setSearchInput] = React.useState("");
  const [filters, setFilters] = React.useState<HistoryFilters>(DEFAULT_HISTORY_FILTERS);
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  // Any change to the debounced search resets to page 1 (a new search
  // shouldn't strand the user on, say, page 4 of the old result set).
  const effectiveFilters = React.useMemo<HistoryFilters>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  const { data, isLoading, isFetching, error, refetch } = useReviewHistory(effectiveFilters);
  const deleteReview = useDeleteReview();

  const [pendingDelete, setPendingDelete] = React.useState<ReviewListItem | null>(null);

  function updateFilters(partial: Partial<HistoryFilters>) {
    setFilters((prev) => ({ ...prev, ...partial, page: partial.page ?? 1 }));
  }

  function handleClearAll() {
    setSearchInput("");
    setFilters(DEFAULT_HISTORY_FILTERS);
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteReview.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  }

  const hasFilters = hasActiveHistoryFilters(effectiveFilters);

  return (
    <div className="space-y-6">
      <PageHeader title="Review History" description="Browse, search, and manage your past reviews." />

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <SearchBar value={searchInput} onChange={setSearchInput} />
          </div>
          <SortDropdown value={filters.sortBy} onChange={(sortBy) => updateFilters({ sortBy })} />
        </div>

        <FilterPanel
          filters={effectiveFilters}
          onToggleLanguage={(v) => updateFilters({ language: toggleInArray(filters.language, v) })}
          onToggleStatus={(v) =>
            updateFilters({ status: toggleInArray(filters.status, v as HistoryFilters["status"][number]) })
          }
          onToggleReviewType={(v) =>
            updateFilters({
              reviewType: toggleInArray(filters.reviewType, v as HistoryFilters["reviewType"][number]),
            })
          }
          onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
          onClearAll={handleClearAll}
          hasActiveFilters={hasFilters}
        />
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : error ? (
        <ErrorLayout title="Couldn't load your reviews" description={error.message} onRetry={() => refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EmptyHistoryState
          variant={hasFilters ? (debouncedSearch ? "no-search-results" : "no-matching-filters") : "no-reviews"}
          onClearFilters={hasFilters ? handleClearAll : undefined}
        />
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : undefined}>
          <HistoryTable items={data.items} onDeleteClick={setPendingDelete} />
          <div className="space-y-3 md:hidden">
            {data.items.map((item) => (
              <HistoryCard key={item.id} item={item} onDeleteClick={setPendingDelete} />
            ))}
          </div>

          <div className="mt-4">
            <Pagination
              pagination={data.pagination}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              onPageSizeChange={(pageSize) => setFilters((prev) => ({ ...prev, pageSize, page: 1 }))}
            />
          </div>
        </div>
      )}

      {pendingDelete && (
        <DeleteReviewDialog
          open={Boolean(pendingDelete)}
          onOpenChange={(open) => !open && setPendingDelete(null)}
          reviewTitle={pendingDelete.title}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteReview.isPending}
        />
      )}
    </div>
  );
}
