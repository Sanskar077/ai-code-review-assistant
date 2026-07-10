import type { Linter } from "eslint";

import { BaseEslintAnalyzer } from "./BaseEslintAnalyzer";

export class JavaScriptAnalyzer extends BaseEslintAnalyzer {
  readonly language = "javascript";
  readonly name = "ESLint";
  protected readonly virtualFileName = "submission.js";

  protected buildConfig(): Linter.Config {
    return {
      root: true,
      env: { es2022: true, node: true, browser: true },
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
      extends: ["eslint:recommended"],
    };
  }
}
