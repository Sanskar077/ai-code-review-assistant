import * as React from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Reusable shell for public-facing pages (landing, auth). Pages that need a
 * different chrome (e.g. a future dashboard with a Sidebar instead of a
 * Footer) should compose Navbar/Sidebar/Footer directly rather than reuse
 * this component.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
