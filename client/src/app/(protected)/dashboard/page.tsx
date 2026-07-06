"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/store/auth-context";

/**
 * Placeholder only — dashboard functionality (Day 4+) is explicitly out of
 * scope for Day 3. This page exists solely to give ProtectedRoute and the
 * edge middleware something real to protect, so the redirect/session flow
 * is demonstrably working end to end.
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome{user ? `, ${user.name.split(" ")[0]}` : ""}</CardTitle>
        <CardDescription>
          You&apos;re signed in. Code submission, review results, and history land here in a
          future milestone.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        This placeholder confirms route protection is working — reaching this page requires an
        active, verified session.
      </CardContent>
    </Card>
  );
}
