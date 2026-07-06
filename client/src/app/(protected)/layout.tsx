import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
