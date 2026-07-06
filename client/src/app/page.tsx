import { Bug, GaugeCircle, GitBranch, History, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroDiffPanel } from "@/components/common/HeroDiffPanel";
import { PageContainer } from "@/components/common/PageContainer";
import { MainLayout } from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/routes";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Security-aware review",
    description:
      "Flags injection risks, unsafe defaults, and other security issues alongside every functional bug.",
  },
  {
    icon: Bug,
    title: "Bugs & code smells",
    description:
      "Combines static analysis (ESLint, Pylint) with an AI reviewer to catch what linters alone miss.",
  },
  {
    icon: GaugeCircle,
    title: "Complexity at a glance",
    description:
      "Cyclomatic complexity, function and file size, and other metrics surfaced per submission.",
  },
  {
    icon: History,
    title: "A record you can search",
    description: "Every review is saved, so you can revisit, filter, and track improvement over time.",
  },
] as const;

export default function LandingPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="overflow-hidden">
        <PageContainer className="grid items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">
          <div className="space-y-6">
            <Badge variant="outline" className="font-mono">
              Static analysis + AI, together
            </Badge>
            <h1 className="text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              A senior engineer&apos;s read on every commit.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Paste a snippet or upload a file and ReviewAI reads it the way a thoughtful reviewer
              would — pointing at the exact line, naming the issue, and explaining why it matters.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={ROUTES.register}>Start reviewing for free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
          </div>

          <HeroDiffPanel />
        </PageContainer>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-muted/20">
        <PageContainer className="py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">What it does</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              Everything a code review should cover
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border">
        <PageContainer className="py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">The flow</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              From code to comments in two steps
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <GitBranch className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">1. Static analysis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Language-specific tools scan for syntax errors, unused variables, and style
                violations first — fast, deterministic checks before the AI even looks.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">2. AI review</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                An AI model reads the code and the static analysis output together, explaining
                bugs, smells, and fixes in plain language.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* About */}
      <section id="about" className="border-t border-border bg-muted/20">
        <PageContainer className="grid items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">About the project</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              Built to mirror a real engineering workflow
            </h2>
          </div>
          <p className="text-muted-foreground">
            ReviewAI started as a two-week internship project, built to mirror the tools
            professional teams actually use: authenticated accounts, a normalized database,
            pluggable static analyzers, and an AI review layer designed to swap models without
            touching the rest of the app. Every part of it is built with free, open-source
            tooling from end to end.
          </p>
        </PageContainer>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <PageContainer className="flex flex-col items-center gap-6 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Get feedback on your next commit
          </h2>
          <p className="max-w-md text-muted-foreground">
            Create a free account and paste your first snippet in under a minute.
          </p>
          <Button size="lg" asChild>
            <Link href={ROUTES.register}>Create your account</Link>
          </Button>
        </PageContainer>
      </section>
    </MainLayout>
  );
}
