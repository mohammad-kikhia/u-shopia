import { BackendPaths, getBackendBaseUrl } from "@/data/api/backend";
import { getRefreshCookieName } from "@/lib/auth/constants";
import { buildBackendAuthCookieHeader } from "@/lib/auth/forward-cookies";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const base = getBackendBaseUrl();
  const cookieForBackend = buildBackendAuthCookieHeader(req);

  if (base) {
    try {
      await fetch(`${base}${BackendPaths.logout}`, {
        method: "GET",
        headers: cookieForBackend ? { Cookie: cookieForBackend } : {},
        cache: "no-store",
      });
    } catch {
      /* still clear local cookie */
    }
  }

  const res = NextResponse.json({ ok: true, message: "Signed out" });
  res.cookies.delete(getRefreshCookieName());
  return res;
}
