import { getBackendRefreshSetCookieNames } from "@/lib/auth/constants";
import { normalizeSetCookieValue } from "@/lib/auth/cookie-value";

export type ParsedRefreshCookie = {
  value: string;
  maxAge?: number;
};

/**
 * Parse `Set-Cookie` headers from the auth backend to find the refresh token.
 */
export function parseRefreshFromSetCookieHeaders(headers: string[]): ParsedRefreshCookie | null {
  const names = new Set(getBackendRefreshSetCookieNames().map((n) => n.toLowerCase()));

  for (const header of headers) {
    const firstPart = header.split(";")[0]?.trim() ?? "";
    const eq = firstPart.indexOf("=");
    if (eq < 1) continue;
    const cookieName = firstPart.slice(0, eq).trim();
    const value = firstPart.slice(eq + 1);
    if (!value || !names.has(cookieName.toLowerCase())) continue;

    let maxAge: number | undefined;
    const maxAgeMatch = header.match(/Max-Age=(\d+)/i);
    if (maxAgeMatch) maxAge = parseInt(maxAgeMatch[1], 10);

    return { value: normalizeSetCookieValue(value), maxAge };
  }

  return null;
}
