import * as React from "react";

import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

export function PageContainer({ className, narrow, ...props }: PageContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-6", narrow ? "max-w-2xl" : "max-w-6xl", className)}
      {...props}
    />
  );
}
