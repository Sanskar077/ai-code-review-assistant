"use client";

import { FileText, UploadCloud, X } from "lucide-react";
import * as React from "react";

import { ValidationMessage } from "@/components/review/ValidationMessage";
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_SIZE_BYTES,
} from "@/features/review/schemas";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_UPLOAD_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function FileUploader({ file, onFileChange, error }: FileUploaderProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function validateAndSet(candidate: File) {
    if (!hasAllowedExtension(candidate.name)) {
      setLocalError(`Unsupported file type. Allowed: ${ALLOWED_UPLOAD_EXTENSIONS.join(", ")}`);
      return;
    }
    if (candidate.size === 0) {
      setLocalError("This file is empty.");
      return;
    }
    if (candidate.size > MAX_UPLOAD_SIZE_BYTES) {
      setLocalError("File must be 10 MB or smaller.");
      return;
    }
    setLocalError(null);
    onFileChange(candidate);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSet(dropped);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) validateAndSet(selected);
  }

  const displayError = localError ?? error;

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            onFileChange(null);
            setLocalError(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          aria-label="Remove file"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border p-8 text-center transition-colors",
          dragOver && "border-primary bg-primary/5"
        )}
      >
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          Drag and drop a file, or <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {ALLOWED_UPLOAD_EXTENSIONS.join(", ")} — up to 10 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_UPLOAD_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
      {displayError && <ValidationMessage variant="error">{displayError}</ValidationMessage>}
    </div>
  );
}
