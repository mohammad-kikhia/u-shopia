import { BackendPaths, getBackendBaseUrl } from "@/data/api/backend";
import { buildBackendAuthCookieHeader } from "@/lib/auth/forward-cookies";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies to your backend `GET /users` with the same Authorization + cookies.
 * Use from the client only after sign-in (Bearer access token in memory).
 */
export async function GET(req: NextRequest) {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json(
      { message: "Auth backend is not configured (set BACKEND_API_BASE_URL)." },
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization");
  const cookieForBackend = buildBackendAuthCookieHeader(req);

  const backendRes = await fetch(`${base}${BackendPaths.users}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(auth ? { Authorization: auth } : {}),
      ...(cookieForBackend ? { Cookie: cookieForBackend } : {}),
    },
    cache: "no-store",
  });

  const text = await backendRes.text();
  const contentType = backendRes.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: backendRes.status,
    headers: { "content-type": contentType },
  });
}
