# Escuela JS API (shop data)

The storefront uses the public **Escuela JS** REST API for demo products and categories. All URLs are defined in **`data/api/endpoints.ts`**. All fetch logic, types, and normalization live under **`lib/api/escuelajs/`**.

## Endpoints map

| Purpose | Constant / helper | HTTP |
|--------|-------------------|------|
| Product list (filters, pagination) | `EscuelaApiPaths.products` | `GET /api/v1/products?...` |
| Categories | `EscuelaApiPaths.categories` | `GET /api/v1/categories` |
| Single product by slug | `EscuelaApiPaths.productBySlug(slug)` | `GET /api/v1/products/slug/{slug}` |
| Related products | `EscuelaApiPaths.relatedBySlug(slug)` | `GET /api/v1/products/slug/{slug}/related` |

To change the provider or version, update **`ESCUELA_API_BASE`** and **`EscuelaApiPaths`** only.

## Server Components

Use the helpers from **`@/lib/api/escuelajs`** (they pass Next.js `fetch` `next: { revalidate, tags }` where appropriate):

- **`fetchProductsAndCategoriesServer(input)`** — Listing page: products + categories in one `Promise.all`.
- **`fetchProductsListServer(input)`** — Products only (if you split the page later).
- **`fetchCategoriesServer()`** — Categories only.
- **`fetchProductBySlugServer(slug)`** — PDP; returns `null` if missing.
- **`fetchRelatedBySlugServer(slug)`** — Related carousel slice (max 9).

`input` for list endpoints matches **`ProductsListFilterInput`**: `title`, `categorySlug`, `price_min`, `price_max`, `offset`, `limit`.

## Client Components (browser `fetch`)

Next.js cache tags are **not** applied in the browser. For infinite scroll or other client-side calls:

1. Build the URL with **`getProductsListUrl(input)`** or **`buildProductsListSearchParams(input)`**.
2. Call `fetch(url)`.
3. Parse JSON and map each item with **`normalizeProductListItem`**.

Example: `sections/products/products-view.tsx` (`loadMore`).

## Normalized types

- **`ProductListItem`** — Grid, cards, related carousel, infinite scroll.
- **`ProductDetail`** — Product detail page (strict `category` string, `images` array).
- **`EscuelaCategoryRaw`** — Category dropdown / filters (still API-shaped).

## Adding a new Escuela endpoint

1. Add a path (or builder) to **`data/api/endpoints.ts`** under `EscuelaApiPaths`.
2. Add raw types to **`lib/api/escuelajs/types.ts`** if needed.
3. Add **`normalize*`** in **`normalize.ts`** if the response shape differs from list/detail.
4. Add **`fetch*Server`** (and optional client URL helper) in **`server.ts`** / **`query.ts`**.
5. Re-export from **`lib/api/escuelajs/index.ts`**.
6. Import from **`@/lib/api/escuelajs`** in the route or section — avoid raw `fetch("https://...")` in pages.
