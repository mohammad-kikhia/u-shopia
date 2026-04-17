"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Iconify from "@/components/shared/Iconify";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Trans } from "@/types";
import type { AuthUser } from "@/lib/auth/types";

function isAdminUser(user: AuthUser | null): boolean {
  const roles = user?.roles;
  if (!Array.isArray(roles)) return false;
  return roles.some((r) => String(r).toLowerCase() === "admin");
}

/** Desktop: single primary sign-in control */
export function NavbarSignInButton({ lang, t }: { lang: Locale; t: Trans }) {
  return (
    <Link
      href={`/${lang}/auth/signin`}
      className="hidden items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex"
    >
      {t.common.login}
    </Link>
  );
}

type SignedInProps = {
  lang: Locale;
  t: Trans;
  user: AuthUser | null;
  isRtl: boolean;
  onLogout: () => void | Promise<void>;
};

/** Desktop: avatar trigger + dropdown with details, optional admin link, logout */
export function NavbarAccountMenu({
  lang,
  t,
  user,
  isRtl,
  onLogout,
}: SignedInProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const username = user?.username?.trim() || t.common.account;
  const initial = (username[0] ?? "?").toUpperCase();
  const admin = isAdminUser(user);

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle({});
      return;
    }
    const updatePosition = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const gap = 8;
      const top = rect.bottom + gap;
      if (isRtl) {
        setMenuStyle({
          position: "fixed",
          top,
          left: rect.left,
          right: "auto",
        });
      } else {
        setMenuStyle({
          position: "fixed",
          top,
          right: window.innerWidth - rect.right,
          left: "auto",
        });
      }
    };
    // Portal attaches to `document.body` so `position:fixed` matches viewport `getBoundingClientRect`
    // (ancestor `backdrop-filter` on the header would otherwise create a wrong fixed containing block).
    updatePosition();
    const id = requestAnimationFrame(() => updatePosition());
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, isRtl]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const node = e.target as Node;
      if (triggerRef.current?.contains(node)) return;
      if (menuRef.current?.contains(node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="hidden sm:block">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t.common.account_menu}: ${username}`}
        title={username}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 shrink-0 items-center gap-0.5 rounded-full border border-foreground/15 bg-foreground/4 ps-1 pe-1.5 shadow-sm transition hover:border-foreground/25 hover:bg-foreground/8"
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-on-accent"
          aria-hidden
        >
          {initial}
        </span>
        <Iconify
          icon="tabler:chevron-down"
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={menuStyle}
              className="z-[200] min-w-56 overflow-hidden rounded-2xl border border-slate-200/90 bg-background py-1 shadow-xl dark:border-slate-700/90"
            >
              <div className="border-b border-slate-200/80 px-4 py-3 dark:border-slate-700/80">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {t.common.signed_in_as}
                </p>
                <p
                  className="mt-0.5 truncate text-sm font-semibold"
                  title={username}
                >
                  {username}
                </p>
              </div>
              <div className="py-1">
                <Link
                  role="menuitem"
                  href={`/${lang}/cart`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-foreground/6"
                >
                  <Iconify
                    icon="fa:shopping-cart"
                    className="text-muted-foreground"
                  />
                  {t.common.cart}
                </Link>
                {admin ? (
                  <Link
                    role="menuitem"
                    href={`/${lang}/admin/users`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-foreground/6"
                  >
                    <Iconify
                      icon="tabler:shield-lock"
                      className="text-muted-foreground"
                    />
                    {t.common.admin_panel}
                  </Link>
                ) : null}
              </div>
              <div className="border-t border-slate-200/80 p-1 dark:border-slate-700/80">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    void onLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                >
                  <Iconify icon="tabler:logout" />
                  {t.common.logout}
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/** Mobile drawer: signed-in card */
export function NavbarAccountMobileSignedIn({
  lang,
  t,
  user,
  onLogout,
  onClose,
}: SignedInProps & { onClose: () => void }) {
  const username = user?.username?.trim() || t.common.account;
  const initial = (username[0] ?? "?").toUpperCase();
  const admin = isAdminUser(user);

  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/4 px-3 py-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t.common.signed_in_as}
          </p>
          <p className="truncate font-semibold">{username}</p>
        </div>
      </div>
      <Link
        href={`/${lang}/cart`}
        onClick={onClose}
        className="flex items-center gap-2 rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-foreground/6"
      >
        <Iconify icon="fa:shopping-cart" />
        {t.common.cart}
      </Link>
      {admin ? (
        <Link
          href={`/${lang}/admin/users`}
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-foreground/6"
        >
          <Iconify icon="tabler:shield-lock" />
          {t.common.admin_panel}
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => {
          void onLogout();
          onClose();
        }}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/35 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400"
      >
        <Iconify icon="tabler:logout" />
        {t.common.logout}
      </button>
    </div>
  );
}

/** Mobile drawer: sign in primary, register secondary */
export function NavbarAccountMobileSignedOut({
  lang,
  t,
  onClose,
}: {
  lang: Locale;
  t: Trans;
  onClose: () => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <Link
        href={`/${lang}/auth/signin`}
        onClick={onClose}
        className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
      >
        {t.common.login}
      </Link>
      <Link
        href={`/${lang}/auth/register`}
        onClick={onClose}
        className="text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-accent hover:underline"
      >
        {t.common.create_account}
      </Link>
    </div>
  );
}
