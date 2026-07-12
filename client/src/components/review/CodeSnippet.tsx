interface CodeSnippetProps {
  sourceCode: string;
  line: number | null;
  column?: number | null;
  contextLines?: number;
}

export function CodeSnippet({ sourceCode, line, column, contextLines = 2 }: CodeSnippetProps) {
  if (line == null) return null;

  const lines = sourceCode.split("\n");
  const targetIndex = line - 1;
  if (targetIndex < 0 || targetIndex >= lines.length) return null;

  const start = Math.max(0, targetIndex - contextLines);
  const end = Math.min(lines.length, targetIndex + contextLines + 1);
  const visibleLines = lines.slice(start, end);

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <pre className="overflow-x-auto bg-muted/30 py-1 font-mono text-xs leading-relaxed">
        {visibleLines.map((text, i) => {
          const lineNumber = start + i + 1;
          const isTarget = lineNumber === line;
          return (
            <div
              key={lineNumber}
              className={
                isTarget
                  ? "border-l-2 border-destructive bg-destructive/10 px-3"
                  : "border-l-2 border-transparent px-3"
              }
            >
              <span className="mr-4 inline-block w-8 select-none text-right text-muted-foreground/60">
                {lineNumber}
              </span>
              <span className={isTarget ? "text-foreground" : "text-muted-foreground"}>
                {text || " "}
              </span>
              {isTarget && column != null && <span className="sr-only">, column {column}</span>}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
