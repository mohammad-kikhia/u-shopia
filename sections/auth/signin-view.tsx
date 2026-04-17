'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AuthEmailField, AuthPasswordField } from '@/components/auth/auth-form-fields';
import { useAuth } from '@/components/layout/AuthProvider';
import { safeReturnTo } from '@/lib/auth/safeReturnTo';
import type { Trans } from '@/types';

export default function SignInView({ lang, t }: { lang: string; t: Trans }) {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const a = t.auth;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await signIn(username, password);
      const next = safeReturnTo(searchParams.get('returnTo'), lang);
      if (next) {
        router.push(next);
      } else {
        router.push(`/${lang}`);
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : a.error_generic);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <div
        className="pointer-events-none absolute -top-20 start-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl dark:bg-accent/12"
        aria-hidden
      />
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-background/95 p-8 shadow-xl shadow-slate-200/30 backdrop-blur-sm dark:border-slate-700/80 dark:bg-background/85 dark:shadow-none"
        data-aos="fade-up"
        data-aos-duration="560"
        data-aos-easing="ease-out-cubic"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/40 via-accent to-accent/40" aria-hidden />
        <header className="pt-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{a.signin_title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{a.signin_subtitle}</p>
        </header>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {err ? (
            <p
              className="rounded-xl border border-red-500/35 bg-red-500/[0.08] px-4 py-3 text-sm text-red-800 dark:text-red-200"
              role="alert"
            >
              {err}
            </p>
          ) : null}
          <AuthEmailField
            label={a.email}
            placeholder={a.email_placeholder}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            disabled={busy}
          />
          <AuthPasswordField
            label={a.password}
            placeholder={a.password_placeholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            autoComplete="current-password"
            showPasswordLabel={a.password_show}
            hidePasswordLabel={a.password_hide}
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:brightness-110 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
          >
            {busy ? a.loading : a.submit_login}
          </button>
        </form>

        <p className="mt-8 border-t border-slate-200/80 pt-6 text-center text-sm text-muted dark:border-slate-700/80">
          {a.no_account}{' '}
          <Link href={`/${lang}/auth/register`} className="font-semibold text-accent underline-offset-4 hover:underline">
            {t.common.register}
          </Link>
        </p>
      </div>
    </section>
  );
}
