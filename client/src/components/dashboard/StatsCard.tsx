import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
  hint?: string;
  className?: string;
}

export function StatsCard({ label, value, icon: Icon, loading, hint, className }: StatsCardProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
          )}
          {hint && !loading && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}
