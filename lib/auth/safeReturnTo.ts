/** Same-origin path only, scoped to current locale prefix (open-redirect safe). */
export function safeReturnTo(path: string | null, lang: string): string | null {
  if (!path || typeof path !== 'string') return null;
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  if (path.includes('://')) return null;
  if (path === `/${lang}` || path.startsWith(`/${lang}/`)) return path;
  return null;
}
