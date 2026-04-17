'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CART_STORAGE_KEY } from '@/lib/auth/constants';
import type { CartLine } from '@/lib/cart/types';

type CartContextValue = {
  lines: CartLine[];
  /** True after reading localStorage (avoid SSR/client count mismatch). */
  hydrated: boolean;
  addItem: (item: Omit<CartLine, 'quantity'> & { quantity?: number }) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeLine: (slug: string) => void;
  clear: () => void;
  totalCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(x: unknown): x is CartLine {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === 'number' &&
    typeof o.slug === 'string' &&
    typeof o.title === 'string' &&
    typeof o.price === 'number' &&
    typeof o.image === 'string' &&
    typeof o.quantity === 'number'
  );
}

function loadFromStorage(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* quota / private mode */
    }
  }, [lines, hydrated]);

  const addItem = useCallback((item: Omit<CartLine, 'quantity'> & { quantity?: number }) => {
    const q = Math.max(1, Math.floor(item.quantity ?? 1));
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === item.slug);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + q };
        return next;
      }
      return [...prev, { ...item, quantity: q }];
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const q = Math.max(0, Math.floor(quantity));
    setLines((prev) => {
      if (q <= 0) return prev.filter((l) => l.slug !== slug);
      return prev.map((l) => (l.slug === slug ? { ...l, quantity: q } : l));
    });
  }, []);

  const removeLine = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totalCount = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((n, l) => n + l.price * l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      hydrated,
      addItem,
      setQuantity,
      removeLine,
      clear,
      totalCount,
      subtotal,
    }),
    [lines, hydrated, addItem, setQuantity, removeLine, clear, totalCount, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
