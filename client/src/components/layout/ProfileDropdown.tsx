"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { useLogout } from "@/features/auth/hooks/use-auth-mutations";
import { useAuth } from "@/store/auth-context";

export function ProfileDropdown() {
  const { user, clearUser } = useAuth();
  const logout = useLogout();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!user) return null;

  function handleLogout() {
    setOpen(false);
    logout.mutate(undefined, { onSettled: () => clearUser() });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        <UserAvatar name={user.name} size="sm" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-card p-1.5 shadow-lg"
        >
          <div className="flex items-center gap-3 px-2 py-2">
            <UserAvatar name={user.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="my-1 h-px bg-border" />

          <Link
            href={ROUTES.profile}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-accent"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>

          <span
            role="menuitem"
            aria-disabled="true"
            className="flex cursor-not-allowed items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground/50"
          >
            <Settings className="h-4 w-4" />
            Settings
            <Badge variant="secondary" className="ml-auto text-[10px]">
              Soon
            </Badge>
          </span>

          <div className="my-1 h-px bg-border" />

          <button
            role="menuitem"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {logout.isPending ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
