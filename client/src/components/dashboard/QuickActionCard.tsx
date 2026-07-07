import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
  description?: string;
}

export function QuickActionCard({ label, href, icon: Icon, enabled, description }: QuickActionCardProps) {
  const content = (
    <>
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md",
          enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/60"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", !enabled && "text-muted-foreground/60")}>{label}</p>
        {description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {!enabled && (
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          Soon
        </Badge>
      )}
    </>
  );

  const baseClasses = "flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors";

  if (!enabled) {
    return (
      <span className={cn(baseClasses, "cursor-not-allowed opacity-70")} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={cn(baseClasses, "hover:border-primary/40 hover:bg-accent")}>
      {content}
    </Link>
  );
}
