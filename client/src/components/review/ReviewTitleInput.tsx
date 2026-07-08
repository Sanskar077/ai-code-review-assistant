import * as React from "react";

import { Input, type InputProps } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";

interface ReviewTitleInputProps extends InputProps {
  error?: string;
}

/** Thin wrapper so `register("title")` spreads directly onto it, same pattern as Day 3's auth forms. */
export const ReviewTitleInput = React.forwardRef<HTMLInputElement, ReviewTitleInputProps>(
  ({ error, ...props }, ref) => {
    return (
      <FormField id="review-title" label="Review title" error={error} required>
        <Input ref={ref} placeholder="e.g. User authentication service" maxLength={200} {...props} />
      </FormField>
    );
  }
);
ReviewTitleInput.displayName = "ReviewTitleInput";
