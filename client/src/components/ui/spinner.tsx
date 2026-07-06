import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export function Spinner({ className, size = 16, label = "Loading" }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2 className={cn("animate-spin text-current", className)} width={size} height={size} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
