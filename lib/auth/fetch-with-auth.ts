import type { AuthUser } from "./types";

let refreshInFlight: Promise<AuthUser | null> | null = null;

/**
 * `fetch` with `Authorization: Bearer` and one automatic refresh on 401/403.
 * Uses the user returned from `refreshSession` for the retry (avoids stale closure).
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  options: {
    getAccessToken: () => string | undefined;
    refreshSession: () => Promise<AuthUser | null>;
  },
): Promise<Response> {
  const send = (token: string | undefined) => {
    const headers = new Headers(init?.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers, credentials: "include" });
  };

  let token = options.getAccessToken();
  let res = await send(token);
  if (res.status !== 401 && res.status !== 403) return res;

  if (!refreshInFlight) {
    refreshInFlight = options.refreshSession().finally(() => {
      refreshInFlight = null;
    });
  }
  const newUser = await refreshInFlight;
  const next =
    typeof newUser?.accessToken === "string" ? newUser.accessToken : undefined;
  return send(next);
}
