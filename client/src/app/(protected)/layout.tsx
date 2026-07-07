import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
