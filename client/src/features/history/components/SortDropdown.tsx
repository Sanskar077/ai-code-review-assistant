import { Select } from "@/components/ui/select";
import type { SortOption } from "@/features/history/types";
import { SORT_LABELS } from "@/features/history/utils";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div>
      <label htmlFor="sort-select" className="mb-1.5 block text-xs font-medium text-muted-foreground">
        Sort by
      </label>
      <Select id="sort-select" value={value} onChange={(e) => onChange(e.target.value as SortOption)}>
        {Object.entries(SORT_LABELS).map(([sortValue, label]) => (
          <option key={sortValue} value={sortValue}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}
