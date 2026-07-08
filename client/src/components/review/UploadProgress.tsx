import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  percent: number;
  fileName: string;
}

export function UploadProgress({ percent, fileName }: UploadProgressProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">Uploading {fileName}…</span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} label={`Uploading ${fileName}`} />
    </div>
  );
}
