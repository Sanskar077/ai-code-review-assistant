import { FileUp, PenLine } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SubmissionMethod } from "@/features/review/types";

interface SubmissionMethodToggleProps {
  value: SubmissionMethod;
  onChange: (value: SubmissionMethod) => void;
}

const OPTIONS: { value: SubmissionMethod; label: string; icon: typeof PenLine }[] = [
  { value: "paste", label: "Paste code", icon: PenLine },
  { value: "upload", label: "Upload file", icon: FileUp },
];

export function SubmissionMethodToggle({ value, onChange }: SubmissionMethodToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Submission method"
      className="inline-flex rounded-lg border border-border bg-muted p-1"
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
