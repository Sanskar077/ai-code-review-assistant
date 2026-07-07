import { Activity } from "lucide-react";

import { SectionCard } from "@/components/dashboard/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { ActivityItem } from "@/features/dashboard/types";

interface ActivitySectionProps {
  activity: ActivityItem[];
  loading: boolean;
}

export function ActivitySection({ activity, loading }: ActivitySectionProps) {
  return (
    <SectionCard title="Activity" description="A timeline of recent review events.">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : activity.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Review events — completions, comments, and score changes — will appear here as they happen."
        />
      ) : (
        <ul className="space-y-3">
          {activity.map((item) => (
            <li key={item.id} className="flex items-start gap-3 text-sm">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-foreground">{item.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
