"use client";

import { LayoutDashboard, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [{ href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard }];

function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-border px-4">
          <Logo />
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile trigger + slide-over */}
      <div className="flex h-14 items-center border-b border-border px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-md p-2 text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="ml-3">
          <Logo />
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-card shadow-lg">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="rounded-md p-2 text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav />
          </aside>
        </div>
      )}
    </>
  );
}
