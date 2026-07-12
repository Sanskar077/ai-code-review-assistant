"use client";

import { useEffect } from "react";

import { useBreadcrumbLabelContext } from "@/lib/breadcrumb-context";

export function useSetBreadcrumbLabel(label: string | null | undefined) {
  const { setLabel } = useBreadcrumbLabelContext();

  useEffect(() => {
    setLabel(label ?? null);
    return () => setLabel(null);
  }, [label, setLabel]);
}
