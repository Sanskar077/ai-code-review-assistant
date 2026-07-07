"use client";

import { ChevronLeft, LogOut, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Logo } from "@/components/common/Logo";
import { SidebarItem } from "@/components/layout/SidebarItem";
import { DASHBOARD_NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/auth/hooks/use-auth-mutations";
import { useAuth } from "@/store/auth-context";

const COLLAPSE_STORAGE_KEY = "acr-sidebar-collapsed";

function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggle = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { collapsed, toggle };
}

function LogoutItem({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const logout = useLogout();
  const { clearUser } = useAuth();

  function handleLogout() {
    onNavigate?.();
    logout.mutate(undefined, { onSettled: () => clearUser() });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={logout.isPending}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? "Log out" : undefined}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{logout.isPending ? "Logging out…" : "Log out"}</span>}
    </button>
  );
}

function SidebarNav({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {DASHBOARD_NAV_ITEMS.map((item) => (
        <SidebarItem
          key={item.href + item.label}
          item={item}
          active={pathname === item.href}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
      <div className="mt-auto border-t border-border pt-2">
        <LogoutItem collapsed={collapsed} onNavigate={onNavigate} />
      </div>
    </nav>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 md:flex",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && <Logo href={null} />}
          <button
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              collapsed && "mx-auto"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
        <SidebarNav collapsed={collapsed} />
      </aside>

      {/* Mobile trigger */}
      <div className="flex h-14 items-center border-b border-border px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-md p-2 text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="ml-3">
          <Logo href={null} />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-card shadow-lg">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Logo href={null} />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="rounded-md p-2 text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
