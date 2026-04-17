'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '@/components/layout/AuthProvider';
import { fetchWithAuth } from '@/lib/auth/fetch-with-auth';
import type { Trans } from '@/types';

type Row = { username?: string; id?: number };

export default function AdminUsersView({ t }: { t: Trans }) {
  const a = t.admin;
  const { user, loading: authLoading, refreshSession } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const token =
    typeof user?.accessToken === 'string' ? user.accessToken : undefined;

  const loadUsers = useCallback(async () => {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetchWithAuth(
        '/api/users',
        { method: 'GET', headers: { Accept: 'application/json' } },
        {
          getAccessToken: () => token,
          refreshSession,
        },
      );
      const text = await res.text();
      if (res.status === 503) {
        setErr(a.need_backend);
        return;
      }
      if (!res.ok) {
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = JSON.parse(text) as unknown;
      setRows(Array.isArray(data) ? (data as Row[]) : []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }, [a.need_backend, refreshSession, token]);

  if (authLoading) {
    return (
      <p
        className="px-6 py-12 text-sm text-muted"
        data-aos="fade-up"
        data-aos-duration="450"
        data-aos-easing="ease-out-cubic"
      >
        {t.auth.loading}
      </p>
    );
  }

  if (!token) {
    return (
      <p
        className="px-6 py-12 text-muted"
        data-aos="fade-up"
        data-aos-duration="450"
        data-aos-easing="ease-out-cubic"
      >
        {a.not_signed_in}
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-12 md:py-16">
      <h1
        className="text-2xl font-bold"
        data-aos="fade-up"
        data-aos-duration="550"
        data-aos-easing="ease-out-cubic"
      >
        {a.users_title}
      </h1>
      <p
        className="mt-2 text-sm text-muted"
        data-aos="fade-up"
        data-aos-duration="500"
        data-aos-delay="50"
        data-aos-easing="ease-out-cubic"
      >
        {a.users_hint}
      </p>

      <div
        className="mt-6 flex flex-wrap gap-3"
        data-aos="fade-up"
        data-aos-duration="500"
        data-aos-delay="90"
        data-aos-easing="ease-out-cubic"
      >
        <button
          type="button"
          disabled={busy}
          onClick={() => void loadUsers()}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? t.auth.loading : a.fetch_users}
        </button>
        <button
          type="button"
          onClick={() => {
            setRows([]);
            setErr(null);
          }}
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold dark:border-slate-600"
        >
          {a.clear}
        </button>
      </div>

      {err ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {err}
        </p>
      ) : null}

      <ul className="mt-8 space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.id ?? r.username ?? i}
            className="rounded-lg border border-slate-200/80 px-3 py-2 dark:border-slate-800"
            data-aos="fade-up"
            data-aos-duration="420"
            data-aos-delay={Math.min(i * 45, 270)}
            data-aos-easing="ease-out-cubic"
          >
            <span className="font-medium">{r.username ?? `User ${r.id ?? i}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
