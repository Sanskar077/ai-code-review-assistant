"use client";

import { ActivitySection } from "@/features/dashboard/components/ActivitySection";
import { QuickActionsSection } from "@/features/dashboard/components/QuickActionsSection";
import { RecentReviewsSection } from "@/features/dashboard/components/RecentReviewsSection";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { WelcomeSection } from "@/features/dashboard/components/WelcomeSection";
import { useRecentActivity } from "@/features/dashboard/hooks/use-recent-activity";
import { useRecentReviews } from "@/features/dashboard/hooks/use-recent-reviews";

export default function DashboardPage() {
  const { data: reviews, isLoading: reviewsLoading } = useRecentReviews();
  const { data: activity, isLoading: activityLoading } = useRecentActivity();

  return (
    <div className="space-y-8">
      <WelcomeSection />
      <StatsGrid />
      <QuickActionsSection />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentReviewsSection reviews={reviews ?? []} loading={reviewsLoading} />
        </div>
        <ActivitySection activity={activity ?? []} loading={activityLoading} />
      </div>
    </div>
  );
}
