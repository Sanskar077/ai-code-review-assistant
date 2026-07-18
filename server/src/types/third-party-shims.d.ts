declare module "espree" {
  export function parse(code: string, options: Record<string, unknown>): any;
}

declare module "@typescript-eslint/parser" {
  export function parseForESLint(code: string, options: Record<string, unknown>): { ast: any };
}
