import { BackendPaths, getBackendBaseUrl } from "@/data/api/backend";
import { fetchBackendPost } from "@/lib/api/fetch-backend-post";
import { NextRequest, NextResponse } from "next/server";

function parseBackendJson(raw: string, ok: boolean): Record<string, unknown> {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return { message: raw || "Request failed" };
  } catch {
    return { message: ok ? "Invalid response" : raw.trim() || "Request failed" };
  }
}

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
    return NextResponse.json(
      { message: "Missing username or password" },
      { status: 400 },
    );
  }

  const backendRes = await fetchBackendPost(
    `${base}${BackendPaths.register}`,
    { "Content-Type": "application/json", Accept: "application/json" },
    JSON.stringify({ user, pwd }),
  );

  const raw = await backendRes.text();
  const data = parseBackendJson(raw, backendRes.ok);
  return NextResponse.json(data, { status: backendRes.status });
}
