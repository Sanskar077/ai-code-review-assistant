import { SearchInput } from "@/components/common/SearchInput";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Search by title, language, or summary…"
      aria-label="Search reviews"
    />
  );
}
