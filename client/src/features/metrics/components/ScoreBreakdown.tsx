import { MetricsCard } from "@/features/metrics/components/MetricsCard";
import { Progress } from "@/components/ui/progress";
import type { QualityScoreBreakdown } from "@/features/metrics/types";

interface ScoreBreakdownProps {
  breakdown: QualityScoreBreakdown;
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const rows = [
    { label: "Static analysis", score: breakdown.staticAnalysisScore, weight: breakdown.weights.staticAnalysis },
    { label: "AI findings", score: breakdown.aiFindingsScore, weight: breakdown.weights.aiFindings },
    { label: "Complexity", score: breakdown.complexityScore, weight: breakdown.weights.complexity },
    { label: "Maintainability", score: breakdown.maintainabilityScore, weight: breakdown.weights.maintainability },
  ];

  return (
    <MetricsCard
      title="Score breakdown"
      description="Each factor is scored 0-100, then weighted to produce the final quality score."
    >
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-foreground">
                {row.label}{" "}
                <span className="text-xs text-muted-foreground">
                  ({Math.round(row.weight * 100)}% weight)
                </span>
              </span>
              <span className="font-medium text-foreground">
                {row.score}{" "}
                <span className="text-xs text-muted-foreground">
                  → {Math.round(row.score * row.weight)} pts
                </span>
              </span>
            </div>
            <Progress value={row.score} label={`${row.label} score`} />
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold text-foreground">
          <span>Final score</span>
          <span>{breakdown.finalScore} / 100</span>
        </div>
      </div>
    </MetricsCard>
  );
}
