import { AlertTriangle, Bug, ShieldAlert } from "lucide-react";

const CODE_LINES = [
  { kind: "context", text: "function getUserById(id) {" },
  { kind: "remove", text: "  const user = db.query(`SELECT * FROM users WHERE id = ${id}`);" },
  { kind: "add", text: "  const user = db.query('SELECT * FROM users WHERE id = ?', [id]);" },
  { kind: "context", text: "  if (user == null) return null;" },
  { kind: "remove", text: "  return user" },
  { kind: "add", text: "  return user;" },
  { kind: "context", text: "}" },
] as const;

const ANNOTATIONS = [
  {
    line: 2,
    icon: ShieldAlert,
    tone: "border-destructive/40 bg-destructive/10 text-destructive",
    label: "Security",
    note: "String interpolation in a query is a SQL injection risk — use a parameterized query.",
  },
  {
    line: 5,
    icon: Bug,
    tone: "border-primary/40 bg-primary/10 text-primary",
    label: "Bug",
    note: "Loose equality (==) coerces types unpredictably — use === for null checks.",
  },
  {
    line: 5,
    icon: AlertTriangle,
    tone: "border-muted-foreground/30 bg-muted text-muted-foreground",
    label: "Style",
    note: "Missing semicolon — inconsistent with the rest of the file.",
  },
] as const;

export function HeroDiffPanel() {
  return (
    <div className="animate-fade-up overflow-hidden rounded-xl border border-border bg-card shadow-xl">
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-diff-remove/70" />
        <span className="h-3 w-3 rounded-full bg-primary/70" />
        <span className="h-3 w-3 rounded-full bg-diff-add/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">users.service.js</span>
      </div>

      <div className="grid gap-px bg-border font-mono text-[13px] leading-relaxed sm:grid-cols-[1fr]">
        {CODE_LINES.map((line, i) => (
          <div
            key={i}
            className={
              "flex gap-3 px-4 py-1.5 " +
              (line.kind === "add"
                ? "bg-diff-add-bg"
                : line.kind === "remove"
                  ? "bg-diff-remove-bg"
                  : "bg-card")
            }
          >
            <span className="w-3 select-none text-muted-foreground">
              {line.kind === "add" ? "+" : line.kind === "remove" ? "−" : ""}
            </span>
            <span
              className={
                line.kind === "add"
                  ? "text-diff-add"
                  : line.kind === "remove"
                    ? "text-diff-remove"
                    : "text-foreground"
              }
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-border bg-muted/30 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          ReviewAI found 3 issues
        </p>
        {ANNOTATIONS.map((a, i) => (
          <div
            key={i}
            className={`flex animate-pin-pop items-start gap-3 rounded-md border px-3 py-2 ${a.tone}`}
            style={{ animationDelay: `${300 + i * 150}ms`, animationFillMode: "backwards" }}
          >
            <a.icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold">
                {a.label} · line {a.line}
              </span>
              <p className="mt-0.5 text-foreground/90">{a.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
