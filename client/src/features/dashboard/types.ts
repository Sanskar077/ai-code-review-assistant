export interface DashboardStats {
  totalReviews: number;
  filesUploaded: number;
  aiReviewsCompleted: number;
  averageScore: number | null;
}

export interface ActivityItem {
  id: string;
  message: string;
  createdAt: string;
}
