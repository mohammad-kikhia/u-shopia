import { BackendPaths, getBackendBaseUrl } from "@/data/api/backend";
import { readBackendJsonBody } from "@/lib/api/parse-backend-response-body";
import { fetchBackendWithRedirects } from "@/lib/api/fetch-backend-post";
import {
  authRefreshDeleteCookieOnBackendError,
  authRefreshMirrorTokenInBody,
  getAuthCookieSecure,
  getBackendRefreshHttpMethod,
  getRefreshCookieName,
} from "@/lib/auth/constants";
import {
  logBackendRefreshForward,
  logRefreshIncoming,
  warnRefreshBackend401WhileCookieSent,
} from "@/lib/auth/cookie-debug";
import { buildRefreshProxyCookieHeader, getForwardedAuthCookieNames } from "@/lib/auth/forward-cookies";
import { takeRefreshTokenFromPayload } from "@/lib/auth/refresh-from-payload";
import { parseRefreshFromSetCookieHeaders } from "@/lib/auth/set-cookie";
import { getSetCookieList } from "@/lib/auth/response-headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Same handler for GET and POST — matches legacy `axiosApi.get("/auth/refresh")` + Pages `GET /refresh` to backend. */
async function handleRefresh(req: NextRequest) {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json(
      { message: "Auth backend is not configured (set BACKEND_API_BASE_URL)." },
      { status: 503 },
    );
  }

  const cookieKey = getRefreshCookieName();
  logRefreshIncoming(req, cookieKey);

  const cookieForBackend = buildRefreshProxyCookieHeader(req);
  const rawRefresh = req.cookies.get(cookieKey)?.value ?? "";
  const backendMethod = getBackendRefreshHttpMethod();

  let backendRes: Response;
  if (backendMethod === "GET") {
    backendRes = await fetchBackendWithRedirects(`${base}${BackendPaths.refresh}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(cookieForBackend ? { Cookie: cookieForBackend } : {}),
      },
    });
  } else {
    const refreshBody =
      authRefreshMirrorTokenInBody() && rawRefresh
        ? JSON.stringify({ refreshToken: rawRefresh })
        : "{}";
    backendRes = await fetchBackendWithRedirects(`${base}${BackendPaths.refresh}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(cookieForBackend ? { Cookie: cookieForBackend } : {}),
      },
      body: refreshBody,
    });
  }

  logBackendRefreshForward({
    forwardedCookieHeaderLength: cookieForBackend.length,
    backendStatus: backendRes.status,
    forwardedCookieNames: getForwardedAuthCookieNames().filter((n) => req.cookies.get(n)?.value),
    mirrorRefreshInJsonBody:
      backendMethod === "POST" && authRefreshMirrorTokenInBody() && rawRefresh.length > 0,
    backendHttpMethod: backendMethod,
  });

  const data = await readBackendJsonBody(backendRes);

  if (!backendRes.ok) {
    if (cookieForBackend.length > 0) warnRefreshBackend401WhileCookieSent();
    const res = NextResponse.json(data, { status: backendRes.status });
    if (authRefreshDeleteCookieOnBackendError()) {
      res.cookies.delete(cookieKey);
    }
    return res;
  }

  const setCookies = getSetCookieList(backendRes);
  let refresh = parseRefreshFromSetCookieHeaders(setCookies);
  const payload =
    data && typeof data === "object" ? { ...(data as Record<string, unknown>) } : data;
  if (!refresh && payload && typeof payload === "object") {
    const fromJson = takeRefreshTokenFromPayload(payload);
    if (fromJson) refresh = { value: fromJson };
  }

  const res = NextResponse.json(payload, { status: backendRes.status });
  if (refresh) {
    res.cookies.set(cookieKey, refresh.value, {
      httpOnly: true,
      secure: getAuthCookieSecure(),
      sameSite: "lax",
      path: "/",
      maxAge: refresh.maxAge && refresh.maxAge > 0 ? refresh.maxAge : 60 * 60 * 24 * 7,
    });
  }

  return res;
}

export async function GET(req: NextRequest) {
  return handleRefresh(req);
}

export async function POST(req: NextRequest) {
  return handleRefresh(req);
}
