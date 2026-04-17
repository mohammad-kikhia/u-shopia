"use client";

import AOS from "aos";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Iconify from "@/components/shared/Iconify";
import ProductsFiltersMobileDialog from "@/components/products/ProductsFiltersMobileDialog";
import ProductsFiltersForm from "@/sections/products/products-filters-form";
import { ImagesSrc } from "@/data/files";
import {
  getProductsListUrl,
  normalizeProductListItem,
} from "@/lib/api/escuelajs";
import type { EscuelaProductRaw, ProductListItem } from "@/lib/api/escuelajs";

type Category = {
  id?: number;
  name?: string;
  slug?: string;
};

type ProductsViewProps = {
  lang: string;
  t: any;
  products: ProductListItem[];
  categories: Category[];
  filters: {
    title: string;
    categorySlug: string;
    price_min: string;
    price_max: string;
    offset: string;
    limit: string;
    sorted: string;
  };
};

export default function ProductsView({
  lang,
  t,
  products,
  categories,
  filters,
}: ProductsViewProps) {
  const safeProducts = products ?? [];
  const [allProducts, setAllProducts] =
    useState<ProductListItem[]>(safeProducts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(
    safeProducts.length >= Math.max(1, Number(filters?.limit || 12)),
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const offset = Number(filters?.offset || 0);
  const limit = Math.max(1, Number(filters?.limit || 12));

  const sortProducts = (items: ProductListItem[]) => {
    const copied = [...items];
    if (filters?.sorted === "nameAsc") {
      copied.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
    } else if (filters?.sorted === "nameDesc") {
      copied.sort((a, b) => (b?.title || "").localeCompare(a?.title || ""));
    } else if (filters?.sorted === "priceAsc") {
      copied.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    } else if (filters?.sorted === "priceDesc") {
      copied.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    }
    return copied;
  };

  const currentFiltersKey = useMemo(
    () =>
      JSON.stringify({
        title: filters?.title || "",
        categorySlug: filters?.categorySlug || "all",
        price_min: filters?.price_min || "",
        price_max: filters?.price_max || "",
        sorted: filters?.sorted || "",
        limit,
      }),
    [
      filters?.title,
      filters?.categorySlug,
      filters?.price_min,
      filters?.price_max,
      filters?.sorted,
      limit,
    ],
  );

  useEffect(() => {
    setAllProducts(sortProducts(safeProducts));
    setHasMore(safeProducts.length >= limit);
  }, [currentFiltersKey, safeProducts, limit]);

  useEffect(() => {
    queueMicrotask(() => AOS.refresh());
  }, [allProducts.length]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextOffset = offset + allProducts.length;
      const url = getProductsListUrl({
        offset: Math.max(0, nextOffset),
        limit,
        title: filters?.title,
        categorySlug: filters?.categorySlug,
        price_min: filters?.price_min,
        price_max: filters?.price_max,
      });

      const response = await fetch(url);
      if (!response.ok) {
        setHasMore(false);
        return;
      }

      const nextItems = ((await response.json()) as EscuelaProductRaw[]) ?? [];
      const normalizedNextItems = nextItems.map(normalizeProductListItem);

      if (normalizedNextItems.length < limit) {
        setHasMore(false);
      }

      setAllProducts((prev) => {
        const merged = [...prev, ...normalizedNextItems];
        const deduped = merged.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (candidate) => (candidate?.id || 0) === (item?.id || 0),
            ),
        );
        return sortProducts(deduped);
      });
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries?.[0];
        if (firstEntry?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [allProducts.length, hasMore, isLoadingMore, currentFiltersKey]);

  return (
    <section
      id="products"
      className="mx-auto w-full max-w-7xl px-6 pb-0 pt-8 md:pt-12 lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden lg:pt-6 lg:h-[calc(100dvh-4.25rem-2.5rem)]"
    >
      <div
        className="mb-6 shrink-0 flex flex-wrap items-end justify-between gap-3"
        data-aos="fade-up"
        data-aos-duration="550"
        data-aos-easing="ease-out-cubic"
      >
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            {t.products.products_sup1}
          </h1>
          <p className="mt-1 text-sm text-muted">{t.products.products_sup2}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ProductsFiltersMobileDialog
          lang={lang}
          t={t}
          categories={categories}
          filters={filters}
          limit={limit}
        />
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 overflow-hidden lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]">
          <aside className="scrollbar-theme hidden min-h-0 h-full lg:block lg:overflow-y-auto lg:overscroll-contain">
            <div
              className="min-h-full rounded-2xl border border-slate-200/70 bg-background/95 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800"
              data-aos="fade-up"
              data-aos-duration="500"
              data-aos-delay="80"
              data-aos-easing="ease-out-cubic"
            >
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-foreground/90">
                {t.products.filters_heading}
              </h2>
              <ProductsFiltersForm
                lang={lang}
                t={t}
                categories={categories}
                filters={filters}
                limit={limit}
              />
            </div>
          </aside>

          <div className="scrollbar-theme min-h-0 min-w-0 lg:overflow-y-auto lg:overscroll-contain">
            {allProducts.length < 1 ? (
              <h2
                className="rounded-2xl border border-dashed border-slate-300/70 p-8 text-center text-xl font-semibold dark:border-slate-700"
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-easing="ease-out-cubic"
              >
                {t.products.no_products_found}
              </h2>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {allProducts.map((item, index) => {
                    const productId = item?.id ?? index;
                    const productSlug = item?.slug || `${productId}`;
                    const productTitle =
                      item?.title || t.products.untitled_product;
                    const productImage =
                      item?.image || item?.images?.[0] || ImagesSrc.error;
                    const productPrice = Number(item?.price || 0);
                    const categoryName =
                      (typeof item?.category === "string"
                        ? item?.category
                        : item?.category?.name) ||
                      t?.products?.unknown_category;

                    return (
                      <Link
                        key={productId}
                        href={`/${lang}/products/${productSlug}`}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-linear-to-b from-white/60 to-white/30 p-0 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-accent/40 dark:from-slate-900/60 dark:to-slate-900/30 dark:border-slate-800"
                        data-aos="fade-up"
                        data-aos-duration="480"
                        data-aos-delay={Math.min(index * 40, 320)}
                        data-aos-easing="ease-out-cubic"
                      >
                        <div className="relative flex aspect-square items-center justify-center rounded-t-2xl bg-slate-100/70 p-4 dark:bg-slate-900">
                          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_50%)] opacity-90" />
                          <img
                            loading="lazy"
                            src={productImage}
                            alt={productTitle}
                            className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="space-y-3 p-4">
                          <h3 className="line-clamp-2 min-h-12 text-sm font-semibold tracking-tight text-foreground/90 group-hover:text-foreground">
                            {productTitle}
                          </h3>
                          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-accent shadow-sm backdrop-blur-md ring-1 ring-accent/30">
                            {categoryName}
                          </span>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-extrabold tracking-wide text-accent drop-shadow-sm">
                              ${productPrice?.toFixed(2)}
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold transition-colors duration-300 group-hover:bg-accent">
                              <Iconify
                                icon="fa:shopping-cart"
                                className="size-[1em] shrink-0 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:text-on-accent!"
                              />
                              <span className="text-accent group-hover:text-on-accent!">
                                {t?.products?.view_product}
                              </span>
                            </span>
                          </div>
                        </div>
                        <span className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/10 blur-xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col items-center justify-center gap-2">
                  <div ref={sentinelRef} className="h-4 w-full" />
                  {isLoadingMore && (
                    <p className="text-sm text-muted">
                      {t.products.loading_more}
                    </p>
                  )}
                  {!hasMore && (
                    <p className="text-sm text-muted">
                      {t.products.all_products_loaded}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
