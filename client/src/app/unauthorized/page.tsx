import { ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { MainLayout } from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/routes";

export default function UnauthorizedPage() {
  return (
    <MainLayout>
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <EmptyState
          icon={ShieldAlert}
          title="You don't have access to this page"
          description="Sign in with an account that has permission, or head back to somewhere you can go."
          action={
            <div className="mt-2 flex gap-3">
              <Button variant="outline" asChild>
                <Link href={ROUTES.home}>Back to home</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.login}>Sign in</Link>
              </Button>
            </div>
          }
        />
      </div>
    </MainLayout>
  );
}
