import * as espree from "espree";

import { BaseAstMetrics } from "./BaseAstMetrics";

export class JavaScriptMetrics extends BaseAstMetrics {
  readonly language = "javascript";

  protected parse(sourceCode: string) {
    return espree.parse(sourceCode, {
      ecmaVersion: 2022,
      sourceType: "module",
      loc: true,
      comment: true,
    });
  }
}
