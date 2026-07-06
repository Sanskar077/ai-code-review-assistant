"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/common/PasswordInput";
import { FormField } from "@/components/forms/FormField";
import { ROUTES } from "@/constants/routes";
import { useRegister } from "@/features/auth/hooks/use-auth-mutations";
import { registerFormSchema, type RegisterFormValues } from "@/features/auth/schemas";
import type { NormalizedApiError } from "@/services/api-client";

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: RegisterFormValues) {
    registerUser.mutate(
      { name: values.name, email: values.email, password: values.password },
      {
        onSuccess: () => router.replace(ROUTES.dashboard),
      }
    );
  }

  const apiError = registerUser.error as NormalizedApiError | null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {apiError && (
        <Alert variant="destructive">
          <AlertDescription>{apiError.message}</AlertDescription>
        </Alert>
      )}

      <FormField id="name" label="Full name" error={errors.name?.message} required>
        <Input autoComplete="name" placeholder="Ada Lovelace" {...register("name")} />
      </FormField>

      <FormField id="email" label="Email" error={errors.email?.message} required>
        <Input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={errors.password?.message}
        hint={!errors.password ? "At least 8 characters, with upper, lower, and a number" : undefined}
        required
      >
        <PasswordInput autoComplete="new-password" placeholder="••••••••" {...register("password")} />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm password"
        error={errors.confirmPassword?.message}
        required
      >
        <PasswordInput
          autoComplete="new-password"
          placeholder="••••••••"
          {...register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting || registerUser.isPending}>
        {registerUser.isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
