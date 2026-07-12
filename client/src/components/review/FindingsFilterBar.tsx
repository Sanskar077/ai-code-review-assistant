import { X } from "lucide-react";

import { FilterChipGroup } from "@/components/review/FilterChipGroup";
import { Button } from "@/components/ui/button";

const SEVERITY_OPTIONS = [
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const SOURCE_LABELS: Record<string, string> = {
  ai: "AI Review",
  eslint: "ESLint",
  pylint: "Pylint",
};

interface FindingsFilterBarProps {
  availableCategories: string[];
  availableSources: string[];
  selectedSeverities: Set<string>;
  selectedCategories: Set<string>;
  selectedSources: Set<string>;
  onToggleSeverity: (value: string) => void;
  onToggleCategory: (value: string) => void;
  onToggleSource: (value: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FindingsFilterBar({
  availableCategories,
  availableSources,
  selectedSeverities,
  selectedCategories,
  selectedSources,
  onToggleSeverity,
  onToggleCategory,
  onToggleSource,
  onClearAll,
  hasActiveFilters,
}: FindingsFilterBarProps) {
  const categoryOptions = availableCategories.map((c) => ({ value: c, label: c }));
  const sourceOptions = availableSources.map((s) => ({ value: s, label: SOURCE_LABELS[s] ?? s }));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-6">
        <FilterChipGroup
          label="Severity"
          options={SEVERITY_OPTIONS}
          selected={selectedSeverities}
          onToggle={onToggleSeverity}
        />
        <FilterChipGroup
          label="Category"
          options={categoryOptions}
          selected={selectedCategories}
          onToggle={onToggleCategory}
        />
        <FilterChipGroup
          label="Source"
          options={sourceOptions}
          selected={selectedSources}
          onToggle={onToggleSource}
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 px-2 text-xs">
          <X className="h-3 w-3" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
