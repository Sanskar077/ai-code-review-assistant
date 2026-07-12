"use client";

import { use } from "react";

import { ReviewDetail } from "@/features/review/components/ReviewDetail";

interface ReviewDetailPageProps {
  params: Promise<{ reviewId: string }>;
}

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { reviewId } = use(params);

  return <ReviewDetail reviewId={reviewId} />;
}
