import type { NextRequest } from "next/server";

/** Server logs: `AUTH_DEBUG_COOKIES=1` or `NODE_ENV=development`. */
export function authCookieDebugEnabled(): boolean {
  return process.env.AUTH_DEBUG_COOKIES === "1" || process.env.NODE_ENV === "development";
}

/** Cookie names from raw `Cookie` header (no values). */
export function cookieNamesFromHeader(cookieHeader: string): string[] {
  if (!cookieHeader.trim()) return [];
  return cookieHeader.split(";").map((p) => p.trim().split("=")[0]?.trim()).filter(Boolean);
}

/** First segment of each Set-Cookie string = name (no value logged). */
export function setCookieHeaderNames(setCookies: string[]): string[] {
  return setCookies
    .map((line) => line.split(";")[0]?.trim().split("=")[0]?.trim())
    .filter(Boolean) as string[];
}

const TAG = "[auth-cookie-debug]";

export function logRefreshIncoming(req: NextRequest, refreshCookieName: string): void {
  if (!authCookieDebugEnabled()) return;
  const raw = req.headers.get("cookie") ?? "";
  const names = cookieNamesFromHeader(raw);
  const fromParser = req.cookies.get(refreshCookieName);
  console.log(TAG, `${req.method} /api/auth/refresh incoming`, {
    host: req.headers.get("host"),
    cookieHeaderLength: raw.length,
    cookieNames: names,
    refreshCookieName,
    nextParsedHasRefreshCookie: Boolean(fromParser?.value),
    refreshValueLength: fromParser?.value?.length ?? 0,
  });
  if (!fromParser?.value && names.length === 0) {
    console.warn(
      TAG,
      "No Cookie header — browser did not send cookies. Same host as sign-in? Try one host only (localhost vs 127.0.0.1). credentials:'include' is already set on the client.",
    );
  } else if (!fromParser?.value) {
    console.warn(
      TAG,
      `Cookie header present but no "${refreshCookieName}" cookie. Names received:`,
      names,
      "After sign-in, DevTools → Application → Cookies for this exact host should show that name.",
    );
  }
}

export function logSigninBackendCookies(backendRes: Response, setCookieListLength: number): void {
  if (!authCookieDebugEnabled()) return;
  const single = backendRes.headers.get("set-cookie");
  console.log(TAG, "Backend sign-in response Set-Cookie", {
    getSetCookieCount: setCookieListLength,
    singleHeaderLength: single?.length ?? 0,
    hasGetSetCookie:
      typeof (backendRes.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie ===
      "function",
  });
}

export function logSigninMirror(args: {
  setCookieLines: number;
  setCookieNames: string[];
  refreshSource: "set-cookie" | "json" | null;
  refreshCookieName: string;
  willSetHttpOnly: boolean;
  secure: boolean;
  jsonBodyKeys: string[];
}): void {
  if (!authCookieDebugEnabled()) return;
  console.log(TAG, "POST /api/auth/signin → mirror refresh cookie", args);
  if (!args.willSetHttpOnly) {
    console.warn(
      TAG,
      "No refresh token found. Backend must send Set-Cookie (jwt / refreshToken / …) or JSON { refreshToken } / { refresh_token }. Check AUTH_BACKEND_REFRESH_COOKIE_NAMES.",
      { jsonBodyKeys: args.jsonBodyKeys },
    );
  }
}

export function logBackendRefreshForward(args: {
  forwardedCookieHeaderLength: number;
  backendStatus: number;
  forwardedCookieNames?: string[];
  mirrorRefreshInJsonBody?: boolean;
  backendHttpMethod?: "GET" | "POST";
}): void {
  if (!authCookieDebugEnabled()) return;
  console.log(TAG, "Forwarding to backend /refresh", args);
}

export function warnRefreshBackend401WhileCookieSent(): void {
  if (!authCookieDebugEnabled()) return;
  console.warn(
    TAG,
    "Backend returned 401 but a refresh cookie was forwarded. The wire format is likely correct (length matches). Fix the API (jwt.verify / refresh handler, same secret that signed login). In development we usually keep the jwt cookie after this error (AUTH_REFRESH_DELETE_COOKIE_ON_ERROR defaults off) so the next refresh can retry; in production the cookie is cleared.",
  );
}
