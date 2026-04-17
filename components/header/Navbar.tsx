"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Iconify from "@/components/shared/Iconify";
import { DirectionalIcon } from "@/components/shared/DirectionalIcon";
import { Locale } from "@/app/[lang]/dictionaries";
import { Trans } from "@/types";
import NavMenu from "./NavMenu";
import { LocaleSwitcher } from "@/components/header/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/header/ThemeSwitcher";
import { rtlLanguages } from "@/data/variables";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthProvider";
import { useCart } from "@/components/layout/CartProvider";
import {
  NavbarAccountMenu,
  NavbarAccountMobileSignedIn,
  NavbarAccountMobileSignedOut,
  NavbarSignInButton,
} from "@/components/header/NavbarAccount";

const PANEL_MS = 300;

const Navbar = ({ lang, t }: { lang: Locale; t: Trans }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isRtl = rtlLanguages.includes(lang);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { totalCount, hydrated: cartHydrated } = useCart();
  const accessToken =
    typeof user?.accessToken === "string" ? user.accessToken : undefined;
  const signedIn = Boolean(accessToken || user?.username);

  const closeMenu = useCallback(() => {
    if (!menuVisible) return;
    setMenuEntered(false);
    window.setTimeout(() => setMenuVisible(false), PANEL_MS);
  }, [menuVisible]);

  useEffect(() => {
    if (!menuVisible) {
      setMenuEntered(false);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMenuEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [menuVisible]);

  const toggleSidePanel = () => {
    if (menuVisible) {
      closeMenu();
    } else {
      setMenuVisible(true);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchValue.trim();
    const basePath = `/${lang}/products`;
    const target = query
      ? `${basePath}?q=${encodeURIComponent(query)}`
      : basePath;

    if (pathname?.startsWith(basePath)) {
      router.replace(target);
      return;
    }
    router.push(target);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/60 bg-background/85 shadow-sm shadow-slate-200/20 backdrop-blur-lg dark:border-slate-800/80 dark:bg-background/80 dark:shadow-none">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/35 to-transparent"
          aria-hidden
        />
        <div className="mx-auto flex h-17 max-w-7xl min-w-0 items-center gap-2 px-4 md:gap-3 md:px-6">
          <Link
            href={`/${lang}`}
            className="group flex shrink-0 items-center gap-2.5 rounded-xl outline-none ring-offset-2 ring-offset-background transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-accent via-accent to-accent/80 text-white shadow-md shadow-accent/20 ring-1 ring-white/25 dark:ring-white/10">
              <Iconify
                icon="tabler:shopping-bag-heart"
                className="text-xl"
                aria-hidden
              />
            </span>
            <span className="hidden text-lg font-bold leading-tight header-t min-[400px]:inline sm:text-xl">
              {t.common.brand}
            </span>
          </Link>

          <nav className="mx-1 hidden min-w-0 shrink lg:block">
            <NavMenu lang={lang} t={t} setHidden={() => {}} layout="desktop" />
          </nav>

          <form
            dir={isRtl ? "rtl" : "ltr"}
            onSubmit={handleSearch}
            className="relative mx-auto hidden min-w-0 max-w-xl flex-1 md:block"
          >
            <div className="pointer-events-none absolute inset-y-0 inset-s-3 flex items-center text-muted">
              <Iconify icon="tabler:search" width={18} aria-hidden />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t.common.search_placeholder}
              className="h-10 w-full rounded-xl border border-slate-200/90 bg-slate-50/80 py-2 ps-10 pe-11 text-sm text-foreground shadow-inner shadow-slate-200/30 outline-none ring-accent/20 transition placeholder:text-muted/80 focus:border-accent/50 focus:bg-background focus:ring-2 dark:border-slate-600/80 dark:bg-slate-900/50 dark:shadow-slate-950/40 dark:focus:border-accent/40"
              aria-label={t.common.search_placeholder}
            />
            <button
              type="submit"
              aria-label={t.common.search_placeholder}
              className="absolute inset-e-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-accent/10 hover:text-accent"
            >
              <DirectionalIcon
                icon="tabler:arrow-right"
                className="text-lg"
                aria-hidden
              />
            </button>
          </form>

          <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-2.5">
            <div className="hidden items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-100/40 px-1 py-1 dark:border-slate-600/60 dark:bg-slate-800/40 lg:flex">
              <LocaleSwitcher />
              <ThemeSwitcher t={t} />
            </div>
            <Link
              href={`/${lang}/cart`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-background text-foreground shadow-sm transition hover:border-accent/35 hover:bg-accent/5 dark:border-slate-600/80"
              aria-label={t.common.cart}
              title={t.common.cart}
            >
              <Iconify icon="tabler:shopping-cart" width={20} aria-hidden />
              {cartHydrated && totalCount > 0 ? (
                <span
                  className={`absolute -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold leading-none text-white shadow-sm ${isRtl ? "-inset-s-1" : "-inset-e-1"}`}
                  aria-label={t.common.cart_items_count}
                >
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              ) : null}
            </Link>
            {!authLoading && signedIn ? (
              <NavbarAccountMenu
                lang={lang}
                t={t}
                user={user}
                isRtl={isRtl}
                onLogout={() => logout()}
              />
            ) : null}
            {!authLoading && !signedIn ? (
              <NavbarSignInButton lang={lang} t={t} />
            ) : null}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-100/40 px-1 py-1 lg:hidden dark:border-slate-600/60 dark:bg-slate-800/40">
              <LocaleSwitcher />
              <ThemeSwitcher t={t} />
            </div>
            <button
              type="button"
              title={menuVisible ? t.header.close_panel : t.header.open_panel}
              aria-label={
                menuVisible ? t.header.close_panel : t.header.open_panel
              }
              aria-expanded={menuVisible}
              onClick={toggleSidePanel}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-background text-foreground shadow-sm transition hover:border-accent/35 hover:bg-accent/5 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden dark:border-slate-600/80"
            >
              {menuVisible ? (
                <Iconify icon="tabler:x" width={22} aria-hidden />
              ) : (
                <Iconify icon="tabler:menu-2" width={22} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      {menuVisible && (
        <div
          className={`fixed inset-x-0 top-17 bottom-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden dark:bg-black/65 ${menuEntered ? "opacity-100" : "opacity-0"}`}
          onClick={closeMenu}
        >
          <div
            className={`ms-auto flex h-full w-[min(20rem,88vw)] max-w-[min(20rem,88vw)] flex-col border-s border-slate-200/60 bg-background/95 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-transform duration-300 ease-out will-change-transform dark:border-slate-700/80 dark:shadow-black/40 ${menuEntered ? "translate-x-0" : isRtl ? "-translate-x-full" : "translate-x-full"}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t.header.open_panel}
          >
            <div className="mb-5 flex items-center justify-between gap-2 border-b border-slate-200/70 pb-4 dark:border-slate-700/80">
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                {t.common.brand}
              </span>
            </div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <LocaleSwitcher />
              <ThemeSwitcher t={t} />
            </div>
            {!authLoading && signedIn ? (
              <NavbarAccountMobileSignedIn
                lang={lang}
                t={t}
                user={user}
                isRtl={isRtl}
                onLogout={() => logout()}
                onClose={closeMenu}
              />
            ) : null}
            {!authLoading && !signedIn ? (
              <NavbarAccountMobileSignedOut
                lang={lang}
                t={t}
                onClose={closeMenu}
              />
            ) : null}
            <NavMenu
              lang={lang}
              t={t}
              setHidden={(v) => v && closeMenu()}
              layout="mobile"
              className="mt-2 text-base"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
