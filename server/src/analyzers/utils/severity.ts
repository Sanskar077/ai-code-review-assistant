import { Severity } from "../types";

/** ESLint message severity: 1 = warning, 2 = error. Fatal parse errors also arrive as severity 2 with `fatal: true`. */
export function severityFromEslint(severity: 0 | 1 | 2, fatal?: boolean): Severity {
  if (fatal) return Severity.CRITICAL;
  return severity === 2 ? Severity.HIGH : Severity.MEDIUM;
}

/** Pylint message "type": convention | refactor | warning | error | fatal. */
export function severityFromPylintType(type: string): Severity {
  switch (type) {
    case "fatal":
      return Severity.CRITICAL;
    case "error":
      return Severity.HIGH;
    case "warning":
      return Severity.MEDIUM;
    default:
      // "convention" and "refactor" are style-level suggestions.
      return Severity.LOW;
  }
}
