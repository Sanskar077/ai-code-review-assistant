import { Suspense } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingLayout } from "@/components/layout/LoadingLayout";
import { ReviewForm } from "@/features/review/components/ReviewForm";

export default function NewReviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Review"
        description="Paste your code or upload a file to get it ready for review."
      />
      <Suspense fallback={<LoadingLayout label="Loading" />}>
        <ReviewForm />
      </Suspense>
    </div>
  );
}
