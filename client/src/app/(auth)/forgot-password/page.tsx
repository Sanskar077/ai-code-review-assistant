import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password — ReviewAI",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we'll send you a link to reset it."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
