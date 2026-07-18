import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { scoreColorClass } from "@/features/metrics/utils";

interface QualityScoreCardProps {
  score: number;
}

export function QualityScoreCard({ score }: QualityScoreCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-1 p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quality score</p>
        <p className={cn("font-display text-5xl font-bold tabular-nums", scoreColorClass(score))}>
          {score}
          <span className="text-lg font-medium text-muted-foreground">/100</span>
        </p>
      </CardContent>
    </Card>
  );
}
