import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AnalysisStatus } from "@/features/review/types";

interface AnalysisStatusBannerProps {
  status: AnalysisStatus;
  error: string | null;
  findingCount: number;
}

export function AnalysisStatusBanner({ status, error, findingCount }: AnalysisStatusBannerProps) {
  if (status === "FAILED") {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Analysis failed</AlertTitle>
        <AlertDescription>
          {error ?? "Something went wrong while analyzing this submission."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="success">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Analysis completed</AlertTitle>
      <AlertDescription>
        {findingCount === 0
          ? "No issues were found in your submission."
          : `Found ${findingCount} issue${findingCount === 1 ? "" : "s"} to review below.`}
      </AlertDescription>
    </Alert>
  );
}
