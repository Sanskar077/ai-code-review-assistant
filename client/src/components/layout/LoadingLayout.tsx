import { Spinner } from "@/components/ui/spinner";

export function LoadingLayout({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner size={28} label={label} />
      <p className="text-sm">{label}&hellip;</p>
    </div>
  );
}
