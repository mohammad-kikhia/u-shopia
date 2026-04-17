/** localStorage key for guest cart (client-only). */
export const CART_STORAGE_KEY = "ushopia-cart-v1";

/**
 * HttpOnly refresh cookie name on **this** app (browser → Next `/api/*`).
 * Must match the cookie name your **backend** reads on `/refresh` (Cookie header).
 */
export function getRefreshCookieName(): string {
  const n = process.env.AUTH_REFRESH_COOKIE_NAME?.trim();
  return n && n.length > 0 ? n : "jwt";
}

/**
 * When proxying sign-in, we read `Set-Cookie` from the backend. Names to try (first match wins).
 * Override with `AUTH_BACKEND_REFRESH_COOKIE_NAMES=jwt,refreshToken`.
 */
export function getBackendRefreshSetCookieNames(): string[] {
  const raw = process.env.AUTH_BACKEND_REFRESH_COOKIE_NAMES?.trim();
  if (raw) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return ["jwt", "refreshToken", "refresh_token"];
}

/**
 * `secure` flag for the refresh cookie. Default: true in production only.
 * Set `AUTH_COOKIE_SECURE=false` if you run `next start` on http://localhost (otherwise the browser drops the cookie).
 */
export function getAuthCookieSecure(): boolean {
  if (process.env.AUTH_COOKIE_SECURE === "false") return false;
  if (process.env.AUTH_COOKIE_SECURE === "true") return true;
  return process.env.NODE_ENV === "production";
}

/**
 * POST /refresh also sends JSON `{ refreshToken }` (many Express setups read `req.body` before cookies).
 * Default: **on in development**, off in production. Override: `1` / `0`.
 */
export function authRefreshMirrorTokenInBody(): boolean {
  if (process.env.AUTH_REFRESH_MIRROR_TOKEN_IN_BODY === "0") return false;
  if (process.env.AUTH_REFRESH_MIRROR_TOKEN_IN_BODY === "1") return true;
  return process.env.NODE_ENV === "development";
}

/**
 * Clear the refresh cookie when the backend returns an error for POST /refresh.
 * Default: **off in development** (keeps jwt while you fix Railway secrets / handlers), **on in production**.
 */
export function authRefreshDeleteCookieOnBackendError(): boolean {
  const v = process.env.AUTH_REFRESH_DELETE_COOKIE_ON_ERROR?.trim().toLowerCase();
  if (v === "0" || v === "false" || v === "no") return false;
  if (v === "1" || v === "true" || v === "yes") return true;
  return process.env.NODE_ENV === "production";
}

/**
 * Legacy Pages API used `axios.get(BASE + "/refresh", { headers: { Cookie: req.headers.cookie } })`.
 * Default **GET**. Set `AUTH_REFRESH_HTTP_METHOD=POST` if your API only accepts POST.
 */
export function getBackendRefreshHttpMethod(): "GET" | "POST" {
  const m = process.env.AUTH_REFRESH_HTTP_METHOD?.trim().toUpperCase();
  if (m === "POST") return "POST";
  return "GET";
}

/**
 * Legacy BFF forwarded the **full** browser `Cookie` header. `narrow` = only configured auth cookies (see AUTH_FORWARD_TO_BACKEND_COOKIES).
 */
export function authRefreshUseFullIncomingCookieHeader(): boolean {
  const v = process.env.AUTH_REFRESH_COOKIE_FORWARD?.trim().toLowerCase();
  if (v === "narrow") return false;
  if (v === "full") return true;
  return true;
}
