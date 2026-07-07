export interface DashboardStats {
  totalReviews: number;
  filesUploaded: number;
  aiReviewsCompleted: number;
  averageScore: number | null;
}

export interface ReviewSummary {
  id: string;
  title: string;
  language: string;
  overallScore: number | null;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  createdAt: string;
}
