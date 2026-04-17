/**
 * Central place for external API base URLs and path builders.
 * App routes and `lib/api/*` should import from here — avoid hard-coding URLs in pages.
 */

export const ESCUELA_API_BASE = "https://api.escuelajs.co/api/v1" as const;

/** Escuela JS (Fake Store API) — products & categories used by the shop. */
export const EscuelaApiPaths = {
  products: `${ESCUELA_API_BASE}/products`,
  categories: `${ESCUELA_API_BASE}/categories`,
  productBySlug: (slug: string) =>
    `${ESCUELA_API_BASE}/products/slug/${encodeURIComponent(slug)}`,
  relatedBySlug: (slug: string) =>
    `${ESCUELA_API_BASE}/products/slug/${encodeURIComponent(slug)}/related`,
} as const;
