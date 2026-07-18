import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { MaintainabilityRating } from "@/features/metrics/types";
import { MAINTAINABILITY_BADGE_VARIANT, MAINTAINABILITY_LABELS } from "@/features/metrics/utils";

interface MaintainabilityCardProps {
  rating: MaintainabilityRating;
}

export function MaintainabilityCard({ rating }: MaintainabilityCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Maintainability
        </p>
        <Badge variant={MAINTAINABILITY_BADGE_VARIANT[rating]} className="px-3 py-1 text-sm">
          {MAINTAINABILITY_LABELS[rating]}
        </Badge>
      </CardContent>
    </Card>
  );
}
