import * as React from "react";

import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { BreadcrumbLabelProvider } from "@/lib/breadcrumb-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Standard layout for every authenticated page going forward. New protected
 * pages should be added under app/(protected)/ so they automatically get
 * this shell via app/(protected)/layout.tsx — no per-page wiring needed.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <BreadcrumbLabelProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopNavbar />
          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
          <DashboardFooter />
        </div>
      </div>
    </BreadcrumbLabelProvider>
  );
}
