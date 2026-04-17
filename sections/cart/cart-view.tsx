'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Iconify from '@/components/shared/Iconify';
import { DirectionalIcon } from '@/components/shared/DirectionalIcon';
import { useAuth } from '@/components/layout/AuthProvider';
import { useCart } from '@/components/layout/CartProvider';
import { useNotification } from '@/components/layout/NotificationsProvider';
import type { Trans } from '@/types';

export default function CartView({ lang, t }: { lang: string; t: Trans }) {
  const c = t.cart_page;
  const a = t.auth;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const accessToken = typeof user?.accessToken === 'string' ? user.accessToken : undefined;
  const signedIn = Boolean(accessToken || user?.username);
  const { lines, hydrated, setQuantity, removeLine, subtotal } = useCart();
  const addNotification = useNotification();
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!signedIn) {
      const returnTo = encodeURIComponent(`/${lang}/cart`);
      router.replace(`/${lang}/auth/signin?returnTo=${returnTo}`);
    }
  }, [authLoading, signedIn, lang, router]);

  async function checkout() {
    setCheckoutBusy(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const value = lines.map((l) => ({
        title: l.title,
        image: l.image.startsWith('http') ? l.image : `${origin}${l.image.startsWith('/') ? '' : '/'}${l.image}`,
        price: l.price,
        count: l.quantity,
      }));
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: { value }, locale: lang }),
      });
      const data = (await res.json().catch(() => ({}))) as { stripeSession?: { url?: string }; message?: string };
      if (!res.ok) {
        throw new Error(typeof data.message === 'string' ? data.message : c.checkout_error);
      }
      const url = data.stripeSession?.url;
      if (url) window.location.href = url;
      else throw new Error(c.checkout_error);
    } catch (e) {
      addNotification({
        message: e instanceof Error ? e.message : c.checkout_error,
        status: 'error',
      });
    } finally {
      setCheckoutBusy(false);
    }
  }

  if (authLoading) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="text-sm text-muted">{a.loading}</p>
      </section>
    );
  }

  if (!signedIn) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="text-sm text-muted">{a.loading}</p>
      </section>
    );
  }

  if (!hydrated) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <p
          className="text-sm text-muted"
          data-aos="fade-up"
          data-aos-duration="450"
          data-aos-easing="ease-out-cubic"
        >
          {c.loading ?? '…'}
        </p>
      </section>
    );
  }

  if (lines.length < 1) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
        <h1
          className="text-3xl font-bold"
          data-aos="fade-up"
          data-aos-duration="550"
          data-aos-easing="ease-out-cubic"
        >
          {c.title}
        </h1>
        <p
          className="mt-4 text-muted"
          data-aos="fade-up"
          data-aos-duration="500"
          data-aos-delay="60"
          data-aos-easing="ease-out-cubic"
        >
          {c.empty}
        </p>
        <Link
          href={`/${lang}/products`}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent dark:border-slate-600"
          data-aos="fade-up"
          data-aos-duration="500"
          data-aos-delay="120"
          data-aos-easing="ease-out-cubic"
        >
          <DirectionalIcon icon="fa6-solid:arrow-left-long" aria-hidden />
          {c.continue_shopping}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
      <h1
        className="text-3xl font-bold"
        data-aos="fade-up"
        data-aos-duration="550"
        data-aos-easing="ease-out-cubic"
      >
        {c.title}
      </h1>

      <ul className="mt-8 space-y-4">
        {lines.map((line, i) => (
          <li
            key={line.slug}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800"
            data-aos="fade-up"
            data-aos-duration="480"
            data-aos-delay={Math.min(i * 55, 330)}
            data-aos-easing="ease-out-cubic"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
              <img src={line.image} alt="" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/${lang}/products/${line.slug}`} className="font-semibold hover:text-accent">
                {line.title}
              </Link>
              <p className="text-sm text-accent">${line.price.toFixed(2)}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">{c.quantity}</span>
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) => setQuantity(line.slug, Number(e.target.value))}
                className="w-16 rounded-lg border border-slate-300/80 bg-background px-2 py-1 text-center dark:border-slate-600"
              />
            </label>
            <button
              type="button"
              onClick={() => removeLine(line.slug)}
              className="text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
            >
              {c.remove}
            </button>
          </li>
        ))}
      </ul>

      <div
        className="mt-8 flex flex-col gap-4 border-t border-slate-200/80 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
        data-aos="fade-up"
        data-aos-duration="500"
        data-aos-delay="80"
        data-aos-easing="ease-out-cubic"
      >
        <p className="text-lg font-semibold">
          {c.subtotal}: <span className="text-accent">${subtotal.toFixed(2)}</span>
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent dark:border-slate-600"
          >
            {c.continue_shopping}
          </Link>
          <button
            type="button"
            disabled={checkoutBusy}
            onClick={() => void checkout()}
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {checkoutBusy ? (t.auth?.loading ?? '…') : c.checkout}
          </button>
        </div>
      </div>
    </section>
  );
}
