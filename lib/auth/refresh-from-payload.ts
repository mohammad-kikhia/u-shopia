/** Pull refresh token from common API JSON shapes; strip from payload so it is not sent to the client. */
export function takeRefreshTokenFromPayload(payload: Record<string, unknown>): string | null {
  let rt: unknown = payload.refreshToken ?? payload.refresh_token;
  if (typeof rt !== "string" || !rt.length) {
    const inner = payload.data;
    if (inner && typeof inner === "object") {
      const d = inner as Record<string, unknown>;
      rt = d.refreshToken ?? d.refresh_token;
    }
  }
  if (typeof rt !== "string" || !rt.length) return null;

  delete payload.refreshToken;
  delete payload.refresh_token;
  if (payload.data && typeof payload.data === "object") {
    const d = payload.data as Record<string, unknown>;
    delete d.refreshToken;
    delete d.refresh_token;
  }
  return rt;
}
