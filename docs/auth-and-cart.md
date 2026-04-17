# Auth, cart, and checkout (App Router)

This app implements a **BFF-style** layer: the browser talks to **Next.js Route Handlers** under `/api/*`, which proxy to your backend and manage the **httpOnly refresh cookie** (`jwt`).

### BFF vs “CORS + credentials” (read this before changing the backend)

Advice that says “enable `credentials: true` in CORS and whitelist the **frontend** origin” applies when the **browser calls your API host directly** (e.g. `fetch('https://api.railway.app/refresh')`). **This project does not do that for refresh.**

| Step | Who talks to whom | CORS? | Cookies |
|------|-------------------|-------|---------|
| 1 | **Browser → your Next app** `GET /api/auth/refresh` (legacy uShopia used `axiosApi.get("/auth/refresh")`) | **No** (same origin) | `credentials: 'include'` in `AuthProvider`. `POST /api/auth/refresh` also works (same handler). |
| 2 | **Next server → Railway** **`GET …/refresh` by default** (legacy `axios.get("/refresh", { headers: { Cookie: req.headers.cookie } })`) | **No** | Full `Cookie` header by default; see `AUTH_REFRESH_COOKIE_FORWARD` and `AUTH_REFRESH_HTTP_METHOD`. |

So merging a PR “only” to add CORS `credentials: true` **does not fix** a missing cookie on step 1. The cookie must exist for **your site** (e.g. `https://your-app.vercel.app`), not for `railway.app`.

**`SameSite=None`** is for third-party / cross-site cookie context. The refresh cookie here is **first-party to Next** (`sameSite: 'lax'` is normal). You only need `None` + `Secure` if you intentionally load your app in a cross-site iframe or call the API from another site in the browser—which this BFF layout avoids.

If you **later** add a client that calls Railway **directly**, then CORS + `credentials: true` + `allowedOrigins` + `SameSite=None` on the **API** cookie become relevant—not for the current Next proxy path.

## Environment

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|----------|---------|
| `BACKEND_API_BASE_URL` | Base URL of your auth API (no trailing slash). Legacy alias: `BASE_URL`. |
| `AUTH_REFRESH_COOKIE_NAME` | Optional. Cookie name on **your Next domain** (default `jwt`). Must match what your backend expects on `Cookie:` for `/refresh`. |
| `AUTH_BACKEND_REFRESH_COOKIE_NAMES` | Optional. Comma-separated names to read from backend `Set-Cookie` (default tries `jwt`, `refreshToken`, `refresh_token`). |
| `AUTH_COOKIE_SECURE` | Optional. `false` forces non-`Secure` cookies (use for `next start` on `http://localhost`). Default: `Secure` only when `NODE_ENV=production`. |
| `AUTH_FORWARD_TO_BACKEND_COOKIES` | Used when `AUTH_REFRESH_COOKIE_FORWARD=narrow` (and for `/logout`, `/users`). Comma-separated names (default: refresh cookie only). |
| `AUTH_REFRESH_HTTP_METHOD` | `GET` (default, legacy) or `POST` for backend `/refresh`. |
| `AUTH_REFRESH_COOKIE_FORWARD` | `full` (default) = forward entire browser `Cookie` string to the backend, like the old Pages API. `narrow` = only auth cookies (less noise from Next dev cookies). |
| `AUTH_REFRESH_MIRROR_TOKEN_IN_BODY` | Only when backend method is **POST**. `1` / `0` / unset (dev on, prod off). Sends `{ "refreshToken": "..." }` in the body. |
| `AUTH_REFRESH_DELETE_COOKIE_ON_ERROR` | If `1`, clear the refresh cookie when the backend returns any error on `/refresh`. If `0`, keep the cookie. If unset: **off in development**, **on in production** (so a bad 401 in dev does not wipe `jwt` until you fix Railway). |
| `STRIPE_SECRET_KEY` | **Server-only.** Stripe secret API key (`sk_live_…` / `sk_test_…`). Used by `POST /api/checkout` to create Checkout Sessions. Never use a `NEXT_PUBLIC_` prefix; never commit real keys. If unset, checkout returns `503`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | **Browser-safe** publishable key (`pk_live_…` / `pk_test_…`) for Stripe.js, Payment Element, or other client-side Stripe UI. In Next.js, client code can only read env vars that start with `NEXT_PUBLIC_`. Not used by the current server-only checkout route, but set it when you add embedded payments on the client. |

Never expose the backend URL as `NEXT_PUBLIC_*` unless you intend to leak infrastructure details.

### Debugging cookies (no secrets logged)

| Env | Where | What |
|-----|--------|------|
| `AUTH_DEBUG_COOKIES=1` | **Server terminal** (`npm run dev` / Node) | After sign-in: how many `Set-Cookie` lines came from the backend, names, whether an httpOnly cookie was set. On refresh: `Host`, cookie **names** on the request, whether `jwt` (or `AUTH_REFRESH_COOKIE_NAME`) is present. |
| `NEXT_PUBLIC_AUTH_DEBUG_COOKIES=1` | **Browser console** | Sign-in success hint; refresh failure prints status + response body snippet. |

Also: use **one host** consistently (`http://localhost:3000` **or** `http://127.0.0.1:3000`, not both) — cookies are host-specific.

### If `/api/auth/refresh` returns 401 (“no cookie”)

1. **Credentials** — `AuthProvider` already uses `credentials: 'include'` on sign-in, register, refresh, and logout (same-origin `/api/*`).
2. **Cookie never set** — Open DevTools → Application → Cookies for your **Next** origin (not the Railway API host). If empty after sign-in, either the backend did not send a matching `Set-Cookie`, or the name did not match — set `AUTH_BACKEND_REFRESH_COOKIE_NAMES`, or put the token in JSON as `refreshToken` / `refresh_token` (the BFF copies it into httpOnly and **strips** it from the JSON).
3. **`Secure` on HTTP** — Production builds use `Secure` cookies; browsers **drop** them on plain `http://`. For local `next start`, set `AUTH_COOKIE_SECURE=false`.
4. **Name mismatch** — If the backend reads `Cookie: refreshToken=...` but the browser only has `jwt`, set `AUTH_REFRESH_COOKIE_NAME=refreshToken` (or align the backend to expect `jwt`).

## Backend contract (same as legacy uShopia Pages API)

Your server should expose (relative to `BACKEND_API_BASE_URL`):

| Method | Path | Role |
|--------|------|------|
| `POST` | `/auth` | Body `{ user, pwd }`. Should set `Set-Cookie: jwt=...` for refresh. JSON body should include at least `accessToken` (and e.g. `username`, `roles`). |
| `POST` | `/register` | Body `{ user, pwd }`. |
| `GET` | `/refresh` | **Legacy contract** (same as old `pages/api/auth/refresh.js` → `axios.get("/refresh")`). Uses `Cookie` from the request. |
| `POST` | `/refresh` | Optional; set `AUTH_REFRESH_HTTP_METHOD=POST` if your server only implements POST. |
| `GET` | `/logout` | Clears session server-side (optional). |
| `GET` | `/users` | Protected list (Bearer access token + cookies as in your API). |

Paths are defined in `data/api/backend.ts` as `BackendPaths`.

## Next.js routes

- `POST /api/auth/signin` → proxies sign-in; mirrors refresh token from backend `Set-Cookie` **or** body `refreshToken` / `refresh_token` into an **httpOnly** cookie (name from `AUTH_REFRESH_COOKIE_NAME`, default `jwt`).
- `POST /api/auth/register` → registration only.
- `GET` or `POST /api/auth/refresh` → same handler; **GET** matches legacy `axiosApi.get("/auth/refresh")`. Proxies **`GET /refresh`** to the backend by default with the full `Cookie` header (legacy parity).
- `POST /api/auth/logout` → clears the refresh cookie and calls backend logout if configured.
- `GET /api/users` → proxies to backend `/users` with the client’s `Authorization` header.
- `POST /api/checkout` → Stripe Checkout Session (body shape `{ products: { value: [{ title, image, price, count }] } }`).

## Client usage

- **`AuthProvider`** + **`useAuth()`** — `signIn`, `register`, `logout`, `refreshSession`, `user`, `loading`.
- **`CartProvider`** + **`useCart()`** — guest cart persisted in `localStorage` (`CART_STORAGE_KEY` in `lib/auth/constants.ts`).
- **`fetchWithAuth()`** (`lib/auth/fetch-with-auth.ts`) — attaches `Authorization`, refreshes once on `401`/`403` using the **returned** user from `refreshSession` (no stale token bug).

## Pages

- `/{lang}/auth/signin`, `/{lang}/auth/register` — forms (noindex).
- `/{lang}/cart` — line items, Stripe checkout button.
- `/{lang}/admin/users` — demo “load users” for admins (noindex).

## Security notes

- Refresh token stays **httpOnly**; access token lives in React state (memory) like the old Redux flow.
- Route handlers validate JSON and avoid logging credentials.
- Checkout validates line items server-side; `STRIPE_SECRET_KEY` never reaches the client. Use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` only for the publishable key in browser code.
