import type { Linter } from "eslint";

import { BaseEslintAnalyzer } from "./BaseEslintAnalyzer";

export class TypeScriptAnalyzer extends BaseEslintAnalyzer {
  readonly language = "typescript";
  readonly name = "ESLint (TypeScript)";
  protected readonly virtualFileName = "submission.ts";

  protected buildConfig(): Linter.Config {
    return {
      root: true,
      env: { es2022: true, node: true, browser: true },
      parser: "@typescript-eslint/parser",
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    };
  }
}
