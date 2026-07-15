import { X } from "lucide-react";

import { FilterChipGroup } from "@/components/review/FilterChipGroup";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from "@/features/review/types";
import type { HistoryFilters } from "@/features/history/types";
import { DATE_RANGE_LABELS, REVIEW_TYPE_LABELS, STATUS_FILTER_LABELS } from "@/features/history/utils";

const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_LABELS[l] }));
const STATUS_OPTIONS = Object.entries(STATUS_FILTER_LABELS).map(([value, label]) => ({ value, label }));
const REVIEW_TYPE_OPTIONS = Object.entries(REVIEW_TYPE_LABELS).map(([value, label]) => ({ value, label }));
const DATE_RANGE_OPTIONS = Object.entries(DATE_RANGE_LABELS);

interface FilterPanelProps {
  filters: HistoryFilters;
  onToggleLanguage: (value: string) => void;
  onToggleStatus: (value: string) => void;
  onToggleReviewType: (value: string) => void;
  onDateRangeChange: (value: HistoryFilters["dateRange"]) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FilterPanel({
  filters,
  onToggleLanguage,
  onToggleStatus,
  onToggleReviewType,
  onDateRangeChange,
  onClearAll,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FilterChipGroup
          label="Language"
          options={LANGUAGE_OPTIONS}
          selected={new Set(filters.language)}
          onToggle={onToggleLanguage}
        />
        <FilterChipGroup
          label="Status"
          options={STATUS_OPTIONS}
          selected={new Set(filters.status)}
          onToggle={onToggleStatus}
        />
        <FilterChipGroup
          label="Review type"
          options={REVIEW_TYPE_OPTIONS}
          selected={new Set(filters.reviewType)}
          onToggle={onToggleReviewType}
        />
        <div>
          <label htmlFor="date-range-filter" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Date
          </label>
          <Select
            id="date-range-filter"
            value={filters.dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as HistoryFilters["dateRange"])}
          >
            {DATE_RANGE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 px-2 text-xs">
          <X className="h-3 w-3" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}
