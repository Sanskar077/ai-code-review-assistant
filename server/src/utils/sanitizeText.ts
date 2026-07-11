export function sanitizeAIText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // strip any HTML tags
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // strip control characters (keep \n, \t)
    .trim();
}
