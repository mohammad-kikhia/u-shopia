import { BackendPaths, getBackendBaseUrl } from "@/data/api/backend";
import { fetchBackendPost } from "@/lib/api/fetch-backend-post";
import { getAuthCookieSecure, getRefreshCookieName } from "@/lib/auth/constants";
import {
  logSigninBackendCookies,
  logSigninMirror,
  setCookieHeaderNames,
} from "@/lib/auth/cookie-debug";
import { takeRefreshTokenFromPayload } from "@/lib/auth/refresh-from-payload";
import { parseRefreshFromSetCookieHeaders } from "@/lib/auth/set-cookie";
import { getSetCookieList } from "@/lib/auth/response-headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json(
      { message: "Auth backend is not configured (set BACKEND_API_BASE_URL)." },
      { status: 503 },
    );
  }

  let body: { user?: string; pwd?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const user = typeof body.user === "string" ? body.user.trim() : "";
  const pwd = typeof body.pwd === "string" ? body.pwd : "";
  if (!user || !pwd) {
    return NextResponse.json({ message: "Missing username or password" }, { status: 400 });
  }

  const backendRes = await fetchBackendPost(
    `${base}${BackendPaths.auth}`,
    { "Content-Type": "application/json", Accept: "application/json" },
    JSON.stringify({ user, pwd }),
  );

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const setCookies = getSetCookieList(backendRes);
  logSigninBackendCookies(backendRes, setCookies.length);
  let refresh = parseRefreshFromSetCookieHeaders(setCookies);
  let refreshSource: "set-cookie" | "json" | null = refresh ? "set-cookie" : null;
  const payload =
    data && typeof data === "object" ? { ...(data as Record<string, unknown>) } : data;
  if (!refresh && payload && typeof payload === "object") {
    const fromJson = takeRefreshTokenFromPayload(payload);
    if (fromJson) {
      refresh = { value: fromJson };
      refreshSource = "json";
    }
  }

  const refreshCookieName = getRefreshCookieName();
  const secure = getAuthCookieSecure();
  logSigninMirror({
    setCookieLines: setCookies.length,
    setCookieNames: setCookieHeaderNames(setCookies),
    refreshSource,
    refreshCookieName,
    willSetHttpOnly: Boolean(refresh),
    secure,
    jsonBodyKeys: payload && typeof payload === "object" ? Object.keys(payload) : [],
  });

  const res = NextResponse.json(payload, { status: backendRes.status });
  if (refresh) {
    res.cookies.set(refreshCookieName, refresh.value, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: refresh.maxAge && refresh.maxAge > 0 ? refresh.maxAge : 60 * 60 * 24 * 7,
    });
  }

  return res;
}
