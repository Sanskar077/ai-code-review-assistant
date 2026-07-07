"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useAuth } from "@/store/auth-context";

/**
 * Read-only for now — editing profile fields (which the backend already
 * supports via PATCH /users/me, see server/src/routes/user.routes.ts) is a
 * future milestone. This page exists so the "Profile" nav link and
 * dropdown item are real, working destinations rather than dead links.
 */
export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account information." />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <UserAvatar name={user.name} size="lg" />
          <div>
            <p className="font-display text-lg font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
