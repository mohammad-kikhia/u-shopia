/**
 * Normalize a cookie value from a Set-Cookie first segment (name=value).
 * Safe decodeURIComponent (invalid % sequences fall back to raw); strip quotes.
 */
export function normalizeSetCookieValue(raw: string): string {
  let v = raw.trim();
  if (v.startsWith('"') && v.endsWith('"')) {
    v = v.slice(1, -1);
  }
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}
