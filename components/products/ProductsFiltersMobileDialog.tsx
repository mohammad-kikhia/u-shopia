"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Iconify from "@/components/shared/Iconify";
import ProductsFiltersForm from "@/sections/products/products-filters-form";

const LG_MIN_WIDTH = "(min-width: 1024px)";

type Category = {
  id?: number;
  name?: string;
  slug?: string;
};

type ProductsFiltersMobileDialogProps = {
  lang: string;
  t: {
    common?: { search_placeholder?: string };
    products?: Record<string, string>;
  };
  categories: Category[];
  filters: {
    title: string;
    categorySlug: string;
    price_min: string;
    price_max: string;
    sorted: string;
  };
  limit: number;
};

function normalizePath(path: string) {
  return path.split("?")[0].replace(/\/$/, "") || "/";
}

function isProductsListingPath(pathname: string, lang: string) {
  return normalizePath(pathname) === `/${lang}/products`;
}

export default function ProductsFiltersMobileDialog({
  lang,
  t,
  categories,
  filters,
  limit,
}: ProductsFiltersMobileDialogProps) {
  const scrollYRef = useRef(0);
  const scrollLockActiveRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const pathname = usePathname();
  const p = t.products ?? {};

  const unlockModal = useCallback(() => {
    if (!scrollLockActiveRef.current) return;
    scrollLockActiveRef.current = false;
    document.documentElement.removeAttribute("data-filters-dialog-open");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollYRef.current);
  }, []);

  const lockModal = useCallback(() => {
    scrollYRef.current = window.scrollY;
    scrollLockActiveRef.current = true;
    document.documentElement.setAttribute("data-filters-dialog-open", "");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    unlockModal();
  }, [unlockModal]);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    return () => {
      unlockModal();
    };
  }, [unlockModal]);

  const openDialog = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia(LG_MIN_WIDTH).matches
    )
      return;
    setIsOpen(true);
    lockModal();
  };

  useEffect(() => {
    const mq = window.matchMedia(LG_MIN_WIDTH);
    const onViewportChange = () => {
      if (mq.matches) closeDialog();
    };
    mq.addEventListener("change", onViewportChange);
    return () => mq.removeEventListener("change", onViewportChange);
  }, [closeDialog]);

  useEffect(() => {
    if (!isOpen) return;
    if (!isProductsListingPath(pathname, lang)) {
      closeDialog();
    }
  }, [pathname, lang, isOpen, closeDialog]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeDialog]);

  const dialogEl = isOpen ? (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 px-4 lg:hidden"
      role="presentation"
      onClick={closeDialog}
    >
      <div
        id="products-filters-dialog"
        role="dialog"
        aria-modal="true"
        className="flex max-h-[min(85dvh,90svh)] w-[min(100vw-2rem,28rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-background p-0 text-foreground shadow-xl dark:border-slate-800"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="scrollbar-theme flex max-h-[min(85dvh,90svh)] min-h-0 flex-col overflow-y-auto overscroll-contain p-5">
          <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
            <h2 className="text-lg font-bold tracking-tight">
              {p.filters_dialog_title}
            </h2>
            <button
              type="button"
              onClick={closeDialog}
              className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/80 text-sm font-semibold transition hover:border-accent hover:text-accent dark:border-slate-600"
              aria-label={p.filters_close_dialog}
            >
              <Iconify width={20} height={20} icon="mingcute:close-line" />
            </button>
          </div>
          <ProductsFiltersForm
            lang={lang}
            t={t}
            categories={categories}
            filters={filters}
            limit={limit}
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="fixed bottom-10 z-20 flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-accent/40 bg-background/90 text-accent shadow-sm shadow-accent/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent hover:text-white hover:shadow-accent lg:hidden"
        style={{ insetInlineStart: "max(40px, 4vw)" }}
        aria-haspopup="dialog"
        aria-controls="products-filters-dialog"
        title={p.filters_open_aria}
      >
        <Iconify width={26} height={26} icon="mingcute:filter-fill" />
      </button>

      {portalTarget ? createPortal(dialogEl, portalTarget) : null}
    </>
  );
}
