"use client";

import { BarChart3, Bot, FileText, Gauge } from "lucide-react";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";

export function StatsGrid() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        label="Total Reviews"
        icon={FileText}
        loading={isLoading}
        value={stats?.totalReviews ?? 0}
      />
      <StatsCard
        label="Files Uploaded"
        icon={BarChart3}
        loading={isLoading}
        value={stats?.filesUploaded ?? 0}
      />
      <StatsCard
        label="AI Reviews Completed"
        icon={Bot}
        loading={isLoading}
        value={stats?.aiReviewsCompleted ?? 0}
      />
      <StatsCard
        label="Average Review Score"
        icon={Gauge}
        loading={isLoading}
        value={stats?.averageScore != null ? stats.averageScore : "—"}
        hint={stats?.averageScore == null ? "No reviews scored yet" : undefined}
      />
    </div>
  );
}
