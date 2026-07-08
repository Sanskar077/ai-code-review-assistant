"use client";

import dynamic from "next/dynamic";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/lib/theme-provider";
import type { SupportedLanguage } from "@/features/review/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-[420px] w-full" />,
});

const MONACO_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: SupportedLanguage | "";
  placeholder?: string;
  height?: number;
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder = "Paste or write your code here…",
  height = 420,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-md border border-input">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">
          {language ? MONACO_LANGUAGE_MAP[language] : "plaintext"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          disabled={value.length === 0}
          className="h-7 px-2 text-xs"
        >
          Clear
        </Button>
      </div>

      <div className="relative">
        {value.length === 0 && !focused && (
          <span className="pointer-events-none absolute left-[52px] top-2 z-10 font-mono text-sm text-muted-foreground/70">
            {placeholder}
          </span>
        )}
        <MonacoEditor
          height={height}
          language={language ? MONACO_LANGUAGE_MAP[language] : "plaintext"}
          value={value}
          onChange={(v) => onChange(v ?? "")}
          theme={theme === "dark" ? "vs-dark" : "light"}
          onMount={(editor) => {
            editor.onDidFocusEditorText(() => setFocused(true));
            editor.onDidBlurEditorText(() => setFocused(false));
          }}
          options={{
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            minimap: { enabled: false },
            lineNumbers: "on",
            automaticLayout: true,
            autoIndent: "full",
            tabSize: 2,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
}
