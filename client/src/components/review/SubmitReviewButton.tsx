import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

interface SubmitReviewButtonProps extends Omit<ButtonProps, "children"> {
  loading?: boolean;
  loadingLabel?: string;
  label?: string;
}

export function SubmitReviewButton({
  loading,
  loadingLabel = "Submitting…",
  label = "Submit for review",
  disabled,
  ...props
}: SubmitReviewButtonProps) {
  return (
    <Button type="submit" disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? loadingLabel : label}
    </Button>
  );
}
