import type { NextRequest } from "next/server";
import {
  authRefreshUseFullIncomingCookieHeader,
  getRefreshCookieName,
} from "@/lib/auth/constants";

/**
 * Cookie names to send to the auth backend on server-side fetch.
 * Default: only the refresh cookie (e.g. `jwt`) — avoids forwarding Next/dev cookies
 * (`__next_hmr_refresh_hash__`, etc.) that can confuse some parsers.
 */
export function getForwardedAuthCookieNames(): string[] {
  const raw = process.env.AUTH_FORWARD_TO_BACKEND_COOKIES?.trim();
  if (raw) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [getRefreshCookieName()];
}

/** Build `Cookie` header value for backend proxy calls (no leading/trailing spaces). */
export function buildBackendAuthCookieHeader(req: NextRequest): string {
  const names = getForwardedAuthCookieNames();
  const parts: string[] = [];
  for (const name of names) {
    const v = req.cookies.get(name)?.value;
    if (v) parts.push(`${name}=${v}`);
  }
  return parts.join("; ");
}

/** Cookie header for backend `/refresh` — full legacy string or narrowed auth cookies. */
export function buildRefreshProxyCookieHeader(req: NextRequest): string {
  if (authRefreshUseFullIncomingCookieHeader()) {
    return req.headers.get("cookie") ?? "";
  }
  return buildBackendAuthCookieHeader(req);
}
