import Link from "next/link";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface LogoProps {
  className?: string;
  href?: string | null;
}

/**
 * The mark is a stylized diff gutter: two ticks (add/remove) framing the
 * product initial, echoing the annotated-diff visual language used
 * throughout the marketing site.
 */
export function Logo({ className, href = ROUTES.home }: LogoProps) {
  const mark = (
    <span className={cn("inline-flex items-center gap-2 font-display font-semibold", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
        <span className="relative -top-px">R</span>
      </span>
      <span className="text-base tracking-tight text-foreground">
        Review<span className="text-primary">AI</span>
      </span>
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} aria-label="ReviewAI home">
      {mark}
    </Link>
  );
}
