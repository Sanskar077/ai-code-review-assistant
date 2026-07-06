import Link from "next/link";

import { Logo } from "@/components/common/Logo";
import { PageContainer } from "@/components/common/PageContainer";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <PageContainer className="flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ReviewAI. Built as an internship project.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#about" className="transition-colors hover:text-foreground">
            About
          </Link>
        </div>
      </PageContainer>
    </footer>
  );
}
