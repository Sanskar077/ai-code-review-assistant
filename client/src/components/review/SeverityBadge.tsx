import { Badge } from "@/components/ui/badge";
import type { FindingSeverity } from "@/features/review/types";

const SEVERITY_VARIANT: Record<FindingSeverity, "destructive" | "default" | "secondary"> = {
  CRITICAL: "destructive",
  HIGH: "destructive",
  MEDIUM: "default",
  LOW: "secondary",
};

const SEVERITY_LABEL: Record<FindingSeverity, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  return <Badge variant={SEVERITY_VARIANT[severity]}>{SEVERITY_LABEL[severity]}</Badge>;
}
