/** Strip HTML for meta descriptions and JSON-LD (API text may contain tags). */
export function stripHtmlToPlainText(input: string, maxLen = 320): string {
  const stripped = input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (stripped.length <= maxLen) return stripped;
  return `${stripped.slice(0, Math.max(0, maxLen - 1)).trimEnd()}…`;
}
