 'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Iconify from "@/components/shared/Iconify";
import { DirectionalIcon } from "@/components/shared/DirectionalIcon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { rtlLanguages } from "@/data/variables";
import { useAuth } from "@/components/layout/AuthProvider";
import { useCart } from "@/components/layout/CartProvider";

type ProductDetailsViewProps = {
  lang: string;
  t: any;
  product: {
    id: number;
    slug?: string;
    title: string;
    description: string;
    category: string;
    image: string;
    images?: string[];
    price: number;
  };
};

export default function ProductDetailsView({ lang, t, product }: ProductDetailsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const accessToken = typeof user?.accessToken === "string" ? user.accessToken : undefined;
  const signedIn = Boolean(accessToken || user?.username);
  const { addItem } = useCart();
  const [addedFlash, setAddedFlash] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productPrice = Number(product?.price || 0);
  const gallery = useMemo(
    () => (Array.isArray(product?.images) && product.images.length > 0 ? product.images : [product?.image || "/icon"]),
    [product?.images, product?.image],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const isRtl = rtlLanguages.includes(lang);
  // Embla main carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    align: 'center',
    direction: isRtl ? 'rtl' : 'ltr',
  });
  // Embla thumbs
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    align: 'start',
    direction: isRtl ? 'rtl' : 'ltr',
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selected = emblaApi.selectedScrollSnap();
    setActiveIndex(selected);
    thumbsApi?.scrollTo(selected);
  }, [emblaApi, thumbsApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  return (
    <section id="product-details" className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200/70 bg-background p-5 shadow-sm dark:border-slate-800 md:grid-cols-2 md:p-8">
        <div
          className="rounded-2xl bg-slate-100/70 p-6 dark:bg-slate-900"
          data-aos="fade-up"
          data-aos-duration="550"
          data-aos-easing="ease-out-cubic"
        >
          <div className="relative aspect-square overflow-hidden rounded-lg" role="region" aria-roledescription="carousel" aria-label={product?.title || t.products.untitled_product}>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container flex h-full">
                {gallery.map((src, i) => (
                  <div key={src + i} className="embla__slide h-full w-full shrink-0 grow-0 basis-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomOpen(true);
                      }}
                      className="block h-full w-full"
                      aria-label="Zoom image"
                    >
                      <img
                        src={src || "/icon"}
                        alt={product?.title || t.products.untitled_product}
                        className="h-full w-full max-h-[500px] object-contain"
                        draggable={false}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Prev/Next Controls */}
            <button
              type="button"
              aria-label="Previous image"
              onClick={scrollPrev}
              className="absolute inset-s-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white shadow backdrop-blur hover:bg-black/55"
            >
              <DirectionalIcon icon="fa6-solid:chevron-left" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={scrollNext}
              className="absolute inset-e-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white shadow backdrop-blur hover:bg-black/55"
            >
              <DirectionalIcon icon="fa6-solid:chevron-right" aria-hidden />
            </button>

            {/* Dots */}
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${i === activeIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 hidden md:block">
            <div className="flex gap-2 justify-center" ref={thumbsRef}>
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => scrollTo(i)}
                  className={`h-16 w-16 overflow-hidden rounded-md border ${i === activeIndex ? 'border-accent' : 'border-transparent'} bg-background shadow-sm`}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-20 md:hidden">
            <div className="flex gap-2 justify-center">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`h-14 w-14 overflow-hidden rounded-md border ${i === activeIndex ? 'border-accent' : 'border-transparent'} bg-background shadow-sm`}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col"
          data-aos="fade-up"
          data-aos-duration="550"
          data-aos-delay="90"
          data-aos-easing="ease-out-cubic"
        >
          <h1 className="text-2xl font-bold md:text-3xl">{product?.title || t.products.untitled_product}</h1>
          <p className="mt-2 inline-flex w-fit rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            {product?.category || t.products.unknown_category}
          </p>
          <p className="mt-4 text-sm leading-7 text-muted">
            {product?.description || t.products.no_description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <p className="text-3xl font-bold text-accent">${productPrice.toFixed(2)}</p>
            <button
              type="button"
              disabled={authLoading}
              onClick={() => {
                if (authLoading) return;
                if (!signedIn) {
                  const returnTo = pathname ? encodeURIComponent(pathname) : "";
                  router.push(
                    `/${lang}/auth/signin${returnTo ? `?returnTo=${returnTo}` : ""}`,
                  );
                  return;
                }
                addItem({
                  id: product.id,
                  slug: product.slug || String(product.id),
                  title: product.title,
                  price: productPrice,
                  image: product.image || "/icon",
                  quantity: 1,
                });
                setAddedFlash(true);
                if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
                addedTimerRef.current = setTimeout(() => setAddedFlash(false), 2000);
              }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                signedIn
                  ? "bg-accent text-on-accent hover:brightness-110 disabled:opacity-60"
                  : "border border-accent/50 bg-accent/10 text-accent hover:bg-accent/15 disabled:opacity-60"
              }`}
            >
              <Iconify icon={signedIn ? "fa:shopping-cart" : "tabler:lock"} />
              {authLoading
                ? t.auth.loading
                : signedIn
                  ? addedFlash
                    ? t.cart_page.added_to_cart
                    : t.products.add_to_cart
                  : t.common.sign_in_to_add_to_cart}
            </button>
            {!signedIn && !authLoading ? (
              <p className="text-xs text-muted sm:max-w-xs">
                {t.common.sign_in_to_add_hint}
              </p>
            ) : null}
          </div>

          <div className="mt-8">
            <Link
              href={`/${lang}/products`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent dark:border-slate-700"
            >
              <DirectionalIcon icon="fa6-solid:arrow-left-long" aria-hidden />
              {t.products.back_to_shop}
            </Link>
          </div>
        </div>
      </div>

      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setZoomOpen(false)}
              className="absolute -right-3 -top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow"
            >
              <Iconify icon="fa6-solid:xmark" />
            </button>
            <img
              src={gallery[activeIndex] || "/icon"}
              alt={product?.title || t.products.untitled_product}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
