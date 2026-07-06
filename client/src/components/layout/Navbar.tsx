"use client";

import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/common/Logo";
import { PageContainer } from "@/components/common/PageContainer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/store/auth-context";
import { useLogout } from "@/features/auth/hooks/use-auth-mutations";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading, isAuthenticated, clearUser } = useAuth();
  const logout = useLogout();

  function handleLogout() {
    logout.mutate(undefined, {
      onSettled: () => clearUser(),
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <PageContainer className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user?.name.split(" ")[0]}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={logout.isPending}>
                <LogOut />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={ROUTES.login}>Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={ROUTES.register}>Get started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </PageContainer>

      {mobileOpen && (
        <div className="border-t border-border md:hidden">
          <PageContainer className="flex flex-col gap-4 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center justify-between border-t border-border pt-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut />
                  Log out
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={ROUTES.login}>Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={ROUTES.register}>Get started</Link>
                  </Button>
                </div>
              )}
            </div>
          </PageContainer>
        </div>
      )}
    </header>
  );
}
