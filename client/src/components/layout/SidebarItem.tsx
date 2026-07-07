import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import type { NavItem } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  item: NavItem;
  active: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({ item, active, collapsed, onNavigate }: SidebarItemProps) {
  const { label, href, icon: Icon, enabled } = item;

  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && !enabled && (
        <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">
          Soon
        </Badge>
      )}
    </>
  );

  const baseClasses = cn(
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
    collapsed && "justify-center px-2"
  );

  if (!enabled) {
    return (
      <span
        className={cn(baseClasses, "cursor-not-allowed text-muted-foreground/50")}
        aria-disabled="true"
        title={collapsed ? `${label} — coming soon` : undefined}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        baseClasses,
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
    >
      {content}
    </Link>
  );
}
