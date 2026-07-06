import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Standardizes the label → control → error/hint pattern so every form in
 * the app looks and behaves consistently, with correct aria wiring for
 * screen readers out of the box.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>

      {React.isValidElement(children)
        ? React.cloneElement(
            children as React.ReactElement<{
              id?: string;
              "aria-invalid"?: boolean;
              "aria-describedby"?: string;
            }>,
            {
              id,
              "aria-invalid": Boolean(error) || undefined,
              "aria-describedby": error ? errorId : hint ? hintId : undefined,
            }
          )
        : children}

      {error ? (
        <p id={errorId} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
