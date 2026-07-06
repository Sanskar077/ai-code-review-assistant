import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create your account — ReviewAI",
};

export default function RegisterPage() {
  return (
    <AuthCard title="Create your account" description="Start getting AI-powered feedback on your code.">
      <RegisterForm />
    </AuthCard>
  );
}
