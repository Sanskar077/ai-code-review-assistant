interface MetricBadgeProps {
  label: string;
  value: string | number;
}

export function MetricBadge({ label, value }: MetricBadgeProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-display text-lg font-semibold text-foreground">{value}</dd>
    </div>
  );
}
