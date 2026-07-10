import { JavaScriptAnalyzer } from "./eslint/JavaScriptAnalyzer";
import { TypeScriptAnalyzer } from "./eslint/TypeScriptAnalyzer";
import { PythonAnalyzer } from "./python/PythonAnalyzer";
import type { CodeAnalyzer } from "./types";

const registry: Record<string, CodeAnalyzer> = {
  javascript: new JavaScriptAnalyzer(),
  typescript: new TypeScriptAnalyzer(),
  python: new PythonAnalyzer(),
};

export const AnalyzerFactory = {
  /** Returns null for any language without a registered analyzer — callers must handle this as "unsupported", not throw. */
  getAnalyzer(language: string): CodeAnalyzer | null {
    return registry[language] ?? null;
  },
};
