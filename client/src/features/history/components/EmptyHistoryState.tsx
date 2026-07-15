import { FileSearch, FilterX, SearchX } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

type EmptyHistoryVariant = "no-reviews" | "no-search-results" | "no-matching-filters";

interface EmptyHistoryStateProps {
  variant: EmptyHistoryVariant;
  onClearFilters?: () => void;
}

const CONTENT: Record<EmptyHistoryVariant, { icon: typeof FileSearch; title: string; description: string }> = {
  "no-reviews": {
    icon: FileSearch,
    title: "No reviews yet",
    description: "Submit your first code review to see it show up here.",
  },
  "no-search-results": {
    icon: SearchX,
    title: "No results found",
    description: "Try a different search term.",
  },
  "no-matching-filters": {
    icon: FilterX,
    title: "No matching reviews",
    description: "Try adjusting or clearing your filters.",
  },
};

export function EmptyHistoryState({ variant, onClearFilters }: EmptyHistoryStateProps) {
  const { icon, title, description } = CONTENT[variant];

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={
        variant !== "no-reviews" &&
        onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="mt-2">
            Clear filters
          </Button>
        )
      }
    />
  );
}
