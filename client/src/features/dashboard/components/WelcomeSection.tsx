"use client";

import { useAuth } from "@/store/auth-context";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function WelcomeSection() {
  const { user } = useAuth();
  const now = new Date();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {getGreeting(now.getHours())}, {firstName}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s what&apos;s happening with your code reviews.
      </p>
    </div>
  );
}
