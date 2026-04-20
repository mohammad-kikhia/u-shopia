# uShopia

Demo ecommerce storefront: products, cart, Stripe checkout, auth (BFF + cookies), and EN/AR i18n.

**Live site:** [https://u-shopia.vercel.app/](https://u-shopia.vercel.app/)

## Stack

- **Next.js** 16 (App Router), **React** 19, **TypeScript**
- **Tailwind CSS** 4
- **@iconify/react** — icons
- **AOS** — subtle scroll animations
- **Embla Carousel** — product gallery / related products
- **React Hook Form** + **Zod** — register form validation
- **Stripe** — checkout session API
- **@formatjs/intl-localematcher** + negotiator — locale routing

## Scripts

- `npm run dev` — local dev (`next dev --webpack`)
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — ESLint

## Docs

See `docs/` for auth, cart, API, and env (e.g. `BACKEND_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`).

## RTL directional icons

Use `components/shared/DirectionalIcon.tsx` for horizontal arrows/chevrons: one LTR icon + `rtl:rotate-180` instead of swapping icon names.

<!--

## TODO / backlog

- Prune **unused** layout/components left from earlier iterations (spot-check `components/layout/` legacy files)
- **i18n**: add locales or keys as features grow; keep EN/AR in sync
- **Images**: confirm `next/image` `remotePatterns` if you serve product images from new CDNs
- **Content**: replace placeholder copy where still using lorem-style blocks
- **GIT**: connect the new repo and push the code

-->
