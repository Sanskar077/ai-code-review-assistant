import { MetricBadge } from "@/features/metrics/components/MetricBadge";
import { MetricsCard } from "@/features/metrics/components/MetricsCard";
import type { ComplexityMetrics } from "@/features/metrics/types";

interface ComplexityCardProps {
  complexity: ComplexityMetrics;
}

const METHOD_LABEL: Record<ComplexityMetrics["method"], string> = {
  ast: "AST-based analysis",
  radon: "radon (Python)",
};

export function ComplexityCard({ complexity }: ComplexityCardProps) {
  return (
    <MetricsCard title="Cyclomatic complexity" description={`Computed via ${METHOD_LABEL[complexity.method]}.`}>
      <dl className="grid grid-cols-3 gap-3">
        <MetricBadge label="File complexity" value={complexity.fileComplexity} />
        <MetricBadge label="Avg per function" value={complexity.averageFunctionComplexity} />
        <MetricBadge label="Max function" value={complexity.maxFunctionComplexity} />
      </dl>
    </MetricsCard>
  );
}
