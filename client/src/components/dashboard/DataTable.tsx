import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  skeletonRows?: number;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  emptyIcon?: React.ComponentProps<typeof EmptyState>["icon"];
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  skeletonRows = 4,
  emptyTitle,
  emptyDescription,
  emptyAction,
  emptyIcon,
}: DataTableProps<T>) {
  if (!loading && data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-3 py-2 font-medium text-muted-foreground", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-3 py-3", col.className)}>
                      <Skeleton className="h-4 w-full max-w-[160px]" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row) => (
                <tr key={rowKey(row)} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-3 py-3 text-foreground", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
