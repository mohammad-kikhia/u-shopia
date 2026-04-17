"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/lib/auth/types";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (u: AuthUser | null) => void;
  refreshSession: () => Promise<AuthUser | null>;
  signIn: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Browser console hints; enable in prod with NEXT_PUBLIC_AUTH_DEBUG_COOKIES=1 */
const authDebugClient =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_AUTH_DEBUG_COOKIES === "1";

async function parseJsonSafe(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function messageFromBody(data: Record<string, unknown>, fallback: string) {
  const m = data.message;
  return typeof m === "string" ? m : fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<AuthUser | null> => {
    try {
      // Same-origin BFF: cookies are for this Next host, not Railway. CORS on the API does not apply here.
      // Legacy uShopia: axiosApi.get("/auth/refresh", { withCredentials: true })
      const res = await fetch("/api/auth/refresh", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        if (authDebugClient) {
          const snippet = await res
            .clone()
            .text()
            .then((t) => t.slice(0, 400))
            .catch(() => "");
          console.warn(
            "[auth-cookie-debug client] GET /api/auth/refresh failed",
            res.status,
            snippet,
          );
        }
        setUser(null);
        return null;
      }
      const data = (await res.json()) as AuthUser;
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const signIn = useCallback(async (username: string, password: string) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ user: username.trim(), pwd: password }),
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(messageFromBody(data, "Sign in failed"));
    }
    if (authDebugClient && typeof window !== "undefined") {
      console.info(
        "[auth-cookie-debug client] sign-in OK — check DevTools → Application → Cookies →",
        window.location.host,
        "(httpOnly jwt is not visible in document.cookie)",
      );
    }
    setUser(data as AuthUser);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ user: username.trim(), pwd: password }),
    });
    const data = await parseJsonSafe(res);
    if (!res.ok) {
      const err = new Error(
        messageFromBody(data, "Registration failed"),
      ) as Error & { status?: number };
      err.status = res.status;
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      refreshSession,
      signIn,
      register,
      logout,
    }),
    [user, loading, refreshSession, signIn, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
