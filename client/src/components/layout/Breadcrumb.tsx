"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { ROUTES } from "@/constants/routes";
import { useBreadcrumbLabelContext } from "@/lib/breadcrumb-context";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  "new-review": "New Review",
  history: "Review History",
  settings: "Settings",
  reviews: "Reviews",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const { label: overrideLabel } = useBreadcrumbLabelContext();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const label = isLast && overrideLabel ? overrideLabel : (SEGMENT_LABELS[segment] ?? segment);
    return { href, label, isLast };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          {crumb.isLast ? (
            <span className="font-medium text-foreground" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <>
              <Link
                href={crumb.href === ROUTES.dashboard ? ROUTES.dashboard : crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            </>
          )}
        </span>
      ))}
    </nav>
  );
}
