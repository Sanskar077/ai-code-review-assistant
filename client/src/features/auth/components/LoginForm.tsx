"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/common/PasswordInput";
import { FormField } from "@/components/forms/FormField";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/features/auth/hooks/use-auth-mutations";
import { loginFormSchema, type LoginFormValues } from "@/features/auth/schemas";
import type { NormalizedApiError } from "@/services/api-client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        const redirectTo = searchParams.get("redirectTo") || ROUTES.dashboard;
        router.replace(redirectTo);
      },
    });
  }

  const apiError = login.error as NormalizedApiError | null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {apiError && (
        <Alert variant="destructive">
          <AlertDescription>{apiError.message}</AlertDescription>
        </Alert>
      )}

      <FormField id="email" label="Email" error={errors.email?.message} required>
        <Input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
      </FormField>

      <FormField id="password" label="Password" error={errors.password?.message} required>
        <PasswordInput autoComplete="current-password" placeholder="••••••••" {...register("password")} />
      </FormField>

      <div className="flex justify-end">
        <Link
          href={ROUTES.forgotPassword}
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || login.isPending}>
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
