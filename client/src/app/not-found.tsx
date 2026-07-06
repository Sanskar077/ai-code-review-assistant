import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { MainLayout } from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <EmptyState
          icon={FileQuestion}
          title="Page not found"
          description="The page you're looking for doesn't exist or may have moved."
          action={
            <Button asChild className="mt-2">
              <Link href={ROUTES.home}>Back to home</Link>
            </Button>
          }
        />
      </div>
    </MainLayout>
  );
}
