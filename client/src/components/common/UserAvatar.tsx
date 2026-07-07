import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-display font-semibold text-primary",
        SIZE_CLASSES[size],
        className
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
