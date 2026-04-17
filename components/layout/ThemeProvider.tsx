'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const COOKIE_KEY = 'theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  function syncDomTheme(value: Theme) {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', value === 'dark');
    document.documentElement.dataset.theme = value;
  }

  function getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;

    // Avoid RegExp quirks: parse `document.cookie` manually.
    const cookies = document.cookie.split(';');
    for (const part of cookies) {
      const [key, ...rest] = part.trim().split('=');
      if (key === name) return decodeURIComponent(rest.join('='));
    }
    return null;
  }

  function setThemeCookie(value: Theme) {
    if (typeof document === 'undefined') return;
    const maxAgeSeconds = 60 * 60 * 24 * 365; // 1 year
    const secure = window.location.protocol === 'https:';
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(
      value,
    )}; path=/; max-age=${maxAgeSeconds}; samesite=lax${secure ? '; secure' : ''
      }`;
  }

  const [theme, setTheme] = useState<Theme>(() => {
    // Use cookie when available to prevent dark->light flicker.
    const fromCookie = getCookieValue(COOKIE_KEY);
    const initialFromCookie: Theme | null =
      fromCookie === 'dark' || fromCookie === 'light' ? fromCookie : null;

    const systemPrefersDark = typeof window !== 'undefined' && window?.matchMedia?.(
      '(prefers-color-scheme: dark)',
    )?.matches;
    const initial: Theme = initialFromCookie ?? (systemPrefersDark ? 'dark' : 'light');

    // Keep DOM in sync as early as possible (before useEffect runs).
    syncDomTheme(initial);
    setThemeCookie(initial);

    return initial;
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      syncDomTheme(next);
      setThemeCookie(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

