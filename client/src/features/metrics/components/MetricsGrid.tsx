import { MetricBadge } from "@/features/metrics/components/MetricBadge";
import { MetricsCard } from "@/features/metrics/components/MetricsCard";
import type { CodeMetrics } from "@/features/metrics/types";
import { formatFileSize } from "@/features/metrics/utils";

interface MetricsGridProps {
  code: CodeMetrics;
}

export function MetricsGrid({ code }: MetricsGridProps) {
  return (
    <MetricsCard title="Code metrics" description="Structural facts about this submission.">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricBadge label="Lines of code" value={code.linesOfCode} />
        <MetricBadge label="Total lines" value={code.totalLines} />
        <MetricBadge label="Blank lines" value={code.blankLines} />
        <MetricBadge label="Comment lines" value={code.commentLines} />
        <MetricBadge label="File size" value={formatFileSize(code.fileSizeBytes)} />
        <MetricBadge label="Functions" value={code.functionCount} />
        <MetricBadge label="Classes" value={code.classCount} />
        <MetricBadge label="Imports" value={code.importCount} />
        <MetricBadge label="Max function length" value={`${code.maxFunctionLength} lines`} />
        <MetricBadge label="Avg function length" value={`${code.avgFunctionLength} lines`} />
        <MetricBadge
          label="Max nesting depth"
          value={code.maxNestingDepth !== null ? code.maxNestingDepth : "N/A"}
        />
      </dl>
    </MetricsCard>
  );
}
