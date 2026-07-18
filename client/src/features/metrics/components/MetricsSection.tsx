import { AlertCircle } from "lucide-react";

import { ComplexityCard } from "@/features/metrics/components/ComplexityCard";
import { MaintainabilityCard } from "@/features/metrics/components/MaintainabilityCard";
import { MetricsGrid } from "@/features/metrics/components/MetricsGrid";
import { QualityScoreCard } from "@/features/metrics/components/QualityScoreCard";
import { ScoreBreakdown } from "@/features/metrics/components/ScoreBreakdown";
import type { MaintainabilityRating, MetricsJson } from "@/features/metrics/types";

interface MetricsSectionProps {
  overallScore: number | null;
  maintainabilityRating: MaintainabilityRating | null;
  metricsJson: MetricsJson | null;
}

export function MetricsSection({ overallScore, maintainabilityRating, metricsJson }: MetricsSectionProps) {
  if (overallScore === null || maintainabilityRating === null || metricsJson === null) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Code quality metrics aren&apos;t available for this review.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {metricsJson.limitations.length > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <ul className="space-y-0.5">
            {metricsJson.limitations.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <QualityScoreCard score={overallScore} />
        <MaintainabilityCard rating={maintainabilityRating} />
      </div>

      <MetricsGrid code={metricsJson.code} />
      <ComplexityCard complexity={metricsJson.complexity} />
      <ScoreBreakdown breakdown={metricsJson.scoreBreakdown} />
    </div>
  );
}
