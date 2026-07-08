import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type ValidationVariant = "error" | "success" | "info";

interface ValidationMessageProps {
  variant?: ValidationVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<ValidationVariant, string> = {
  error: "text-destructive",
  success: "text-success",
  info: "text-muted-foreground",
};

const VARIANT_ICONS: Record<ValidationVariant, typeof AlertCircle> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export function ValidationMessage({ variant = "error", children, className }: ValidationMessageProps) {
  const Icon = VARIANT_ICONS[variant];

  return (
    <p className={cn("flex items-start gap-1.5 text-xs font-medium", VARIANT_STYLES[variant], className)}>
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
