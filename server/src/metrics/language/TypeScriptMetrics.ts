import { parseForESLint } from "@typescript-eslint/parser";

import { BaseAstMetrics } from "./BaseAstMetrics";

export class TypeScriptMetrics extends BaseAstMetrics {
  readonly language = "typescript";

  protected parse(sourceCode: string) {
    const { ast } = parseForESLint(sourceCode, {
      ecmaVersion: 2022,
      sourceType: "module",
      loc: true,
      comment: true,
      range: true,
    });
    return ast;
  }
}
