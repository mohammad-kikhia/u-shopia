/** Build an absolute URL for OG/Twitter/JSON-LD when the API returns relative paths. */
export function toAbsoluteUrl(siteOrigin: string, pathOrUrl: string): string {
  const base = siteOrigin.replace(/\/$/, '');
  const raw = pathOrUrl.trim();
  if (!raw) return base;
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return `${base}${path}`;
}
