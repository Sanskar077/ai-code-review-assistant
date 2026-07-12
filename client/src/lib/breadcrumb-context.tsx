"use client";

import { createContext, useContext, useState } from "react";

interface BreadcrumbLabelContextValue {
  label: string | null;
  setLabel: (label: string | null) => void;
}

const BreadcrumbLabelContext = createContext<BreadcrumbLabelContextValue | undefined>(undefined);

export function BreadcrumbLabelProvider({ children }: { children: React.ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  return (
    <BreadcrumbLabelContext.Provider value={{ label, setLabel }}>
      {children}
    </BreadcrumbLabelContext.Provider>
  );
}

export function useBreadcrumbLabelContext() {
  const ctx = useContext(BreadcrumbLabelContext);
  if (!ctx) throw new Error("useBreadcrumbLabelContext must be used within a BreadcrumbLabelProvider");
  return ctx;
}
