# Project structure

This document summarizes where major concerns live so new code stays easy to find.

## App routes (`app/`)

- **`app/[lang]/`** — Locale-prefixed pages (`en`, `ar`). Layout wraps Navbar, main content, footer, and global providers.
- **`app/[lang]/products/(products)/`** — Product listing route group (layout + `page.tsx`).
- **`app/[lang]/products/[productId]/`** — Product detail page and parallel route `@related` for the related-products carousel.

## Data & static references (`data/`)

- **`data/files.ts`** — Public asset paths (images, PDFs) under `/public`.
- **`data/api/endpoints.ts`** — **External API base URLs and path builders** (e.g. Escuela JS). Pages should not duplicate these strings.

## Auth & cart (client)

- **`components/layout/AuthProvider.tsx`** — Session restore, sign-in / register / logout via `/api/auth/*`.
- **`components/layout/CartProvider.tsx`** — Guest cart + persistence.
- See **`docs/auth-and-cart.md`**.

## API integration (`lib/api/`)

- **`lib/api/escuelajs/`** — All Escuela JS usage in one place:
  - **`types.ts`** — Raw and normalized TypeScript shapes.
  - **`normalize.ts`** — Map API JSON to app-friendly objects.
  - **`query.ts`** — Build list URLs / `URLSearchParams` for filtered product lists.
  - **`server.ts`** — `fetch` helpers for **Server Components** (Next.js `cache` / `revalidate` / `tags`).
  - **`index.ts`** — Public exports.

See **`docs/api-escuelajs.md`** for how to call these helpers and add endpoints.

## UI sections (`sections/`)

Feature-level components tied to a route or flow (e.g. `sections/products/products-view.tsx`). They stay thin: data loading stays in `page.tsx` or `lib/api` where possible.

## Components (`components/`)

Reusable UI (header, footer, modals, shared widgets).

## Dictionaries (`dictionaries/`)

JSON copy for `en` and `ar`; loaded via `getDictionary(lang)`.
