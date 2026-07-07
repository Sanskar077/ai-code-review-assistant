"use client";

import { Bell, Search } from "lucide-react";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="hidden md:block">
        <Breadcrumb />
      </div>

      <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          disabled
          placeholder="Search coming soon…"
          aria-label="Search (coming soon)"
          className="w-full cursor-not-allowed rounded-md border border-input bg-transparent py-2 pl-9 pr-3 text-sm text-muted-foreground placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:ml-0">
        <button
          disabled
          aria-label="Notifications (coming soon)"
          title="Notifications — coming soon"
          className="relative flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md text-muted-foreground/60"
        >
          <Bell className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
}
