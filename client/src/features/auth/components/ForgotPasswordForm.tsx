"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";
import { ROUTES } from "@/constants/routes";
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas";

/**
 * There is no `/auth/forgot-password` endpoint yet (out of Day 2's scope,
 * see server/src/routes/auth.routes.ts). This form is intentionally UI-only:
 * it validates input and simulates a submission so the flow and states are
 * fully in place, ready to swap in a real mutation once the backend
 * endpoint exists — no page/component changes should be needed beyond that
 * swap.
 */
export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Alert variant="success">
        <AlertDescription>
          If an account exists for that email, we&apos;ve sent a link to reset the password.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField id="email" label="Email" error={errors.email?.message} required>
        <Input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending link…" : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
