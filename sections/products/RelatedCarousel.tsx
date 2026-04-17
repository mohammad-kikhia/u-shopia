'use client';

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import Iconify from "@/components/shared/Iconify";
import { DirectionalIcon } from "@/components/shared/DirectionalIcon";
import { rtlLanguages } from "@/data/variables";

type RelatedProduct = {
  id?: number;
  slug?: string;
  title?: string;
  price?: number;
  image?: string;
  images?: string[];
  category?: string | { name?: string };
};

export default function RelatedCarousel({
  lang,
  t,
  products,
}: {
  lang: string;
  t: any;
  products: RelatedProduct[];
}) {
  const isRtl = rtlLanguages.includes(lang);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    direction: isRtl ? 'rtl' : 'ltr',
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!products?.length) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div
        className="mb-4 flex items-center justify-between"
        data-aos="fade-up"
        data-aos-duration="520"
        data-aos-easing="ease-out-cubic"
      >
        <h2 className="text-xl font-bold">{t.products.related_products ?? 'Related products'}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-foreground hover:border-accent hover:text-accent dark:border-slate-700"
          >
            <DirectionalIcon icon="fa6-solid:chevron-left" aria-hidden />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-foreground hover:border-accent hover:text-accent dark:border-slate-700"
          >
            <DirectionalIcon icon="fa6-solid:chevron-right" aria-hidden />
          </button>
        </div>
      </div>

      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {products.map((p, i) => {
            const pid = p?.slug || String(p?.id ?? i);
            const title = p?.title || t.products.untitled_product;
            const img = p?.image || p?.images?.[0] || "/icon";
            const price = Number(p?.price || 0);
            return (
              <div key={pid} className="embla__slide mr-3 w-[220px] shrink-0 grow-0 basis-[220px]">
                <Link
                  href={`/${lang}/products/${pid}`}
                  className="group block overflow-hidden rounded-2xl border border-slate-200/70 bg-background p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800"
                  data-aos="fade-up"
                  data-aos-duration="480"
                  data-aos-delay={Math.min(i * 55, 220)}
                  data-aos-easing="ease-out-cubic"
                >
                  <div className="mb-2 flex aspect-square items-center justify-center rounded-xl bg-slate-100/70 p-3 dark:bg-slate-900">
                    <img src={img} alt={title} className="h-full w-full object-contain" />
                  </div>
                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold">{title}</h3>
                  <p className="mt-2 text-base font-extrabold text-accent">${price.toFixed(2)}</p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

