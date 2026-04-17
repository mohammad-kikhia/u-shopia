/** Normalize `Set-Cookie` from a fetch `Response` (Node / undici exposes `getSetCookie`). */
export function getSetCookieList(res: Response): string[] {
  const anyHeaders = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie();
  }
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}
