/**
 * Your own auth / users API (Node/Express, etc.). Set in env — never commit secrets.
 * Used only from Next.js Route Handlers (server).
 */

export function getBackendBaseUrl(): string | null {
  const raw = process.env.BACKEND_API_BASE_URL ?? process.env.BASE_URL;
  if (!raw || !String(raw).trim()) return null;
  return String(raw).replace(/\/$/, "");
}

export function requireBackendBaseUrl(): string {
  const base = getBackendBaseUrl();
  if (!base) {
    throw new Error("BACKEND_API_BASE_URL (or BASE_URL) is not configured");
  }
  return base;
}

/** Paths on your backend (same contract as the legacy Pages Router API routes). */
export const BackendPaths = {
  auth: "/auth",
  register: "/register",
  refresh: "/refresh",
  logout: "/logout",
  users: "/users",
} as const;
