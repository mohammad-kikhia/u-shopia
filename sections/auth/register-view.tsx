"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  AuthEmailField,
  AuthPasswordField,
} from "@/components/auth/auth-form-fields";
import { useAuth } from "@/components/layout/AuthProvider";
import {
  REGISTER_PASSWORD_MIN,
  createRegisterFormSchema,
  type RegisterFormValues,
} from "@/lib/auth/register-form-schema";
import type { Trans } from "@/types";
import Iconify from "@/components/shared/Iconify";

function ChecklistRow({
  done,
  children,
}: {
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-2.5 text-sm leading-snug">
      <span className="mt-0.5 shrink-0" aria-hidden>
        {done ? (
          <Iconify
            icon="tabler:circle-check-filled"
            width={18}
            className="text-emerald-600 dark:text-emerald-400"
          />
        ) : (
          <Iconify
            icon="tabler:circle"
            width={18}
            className="text-muted opacity-55"
          />
        )}
      </span>
      <span className={done ? "text-foreground" : "text-muted"}>
        {children}
      </span>
    </li>
  );
}

export default function RegisterView({ lang, t }: { lang: string; t: Trans }) {
  const { register: registerUser, signIn } = useAuth();
  const router = useRouter();
  const a = t.auth;
  const [serverErr, setServerErr] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createRegisterFormSchema({
        emailInvalid: a.validation_email_invalid,
        passwordMin: a.validation_password_min,
        confirmRequired: a.validation_confirm_required,
        passwordMismatch: a.password_mismatch,
      }),
    [a],
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const usernameVal = watch("username");
  const passwordVal = watch("password");
  const confirmVal = watch("confirmPassword");

  // Same rule as schema `username` field so the checklist matches submit validation.
  const emailLooksValid = useMemo(
    () =>
      z
        .string()
        .trim()
        .min(1)
        .email()
        .safeParse((usernameVal ?? "").trim()).success,
    [usernameVal],
  );

  const passwordLongEnough =
    (passwordVal?.length ?? 0) >= REGISTER_PASSWORD_MIN;
  const passwordsMatch =
    passwordLongEnough &&
    (confirmVal?.length ?? 0) > 0 &&
    passwordVal === confirmVal;

  async function onValidSubmit(data: RegisterFormValues) {
    setServerErr(null);
    try {
      await registerUser(data.username, data.password);
      await signIn(data.username, data.password);
      router.push(`/${lang}`);
      router.refresh();
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 409) {
        setServerErr(a.error_username_taken);
      } else {
        setServerErr(err.message || a.error_generic);
      }
    }
  }

  const busy = isSubmitting;

  return (
    <section className="relative mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <div
        className="pointer-events-none absolute -top-20 inset-s-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl dark:bg-accent/12"
        aria-hidden
      />
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-background/95 p-8 shadow-xl shadow-slate-200/30 backdrop-blur-sm dark:border-slate-700/80 dark:bg-background/85 dark:shadow-none"
        data-aos="fade-up"
        data-aos-duration="560"
        data-aos-easing="ease-out-cubic"
      >
        <div
          className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent/40 via-accent to-accent/40"
          aria-hidden
        />
        <header className="pt-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {a.signup_title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {a.signup_subtitle}
          </p>
        </header>

        <form
          noValidate
          onSubmit={handleSubmit(onValidSubmit)}
          className="mt-6 space-y-5"
        >
          {serverErr ? (
            <p
              className="rounded-xl border border-red-500/35 bg-red-500/8 px-4 py-3 text-sm text-red-800 dark:text-red-200"
              role="alert"
            >
              {serverErr}
            </p>
          ) : null}

          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <AuthEmailField
                label={a.email}
                placeholder={a.email_placeholder}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                error={fieldState.error?.message}
                required={false}
                disabled={busy}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <AuthPasswordField
                label={a.password}
                placeholder={a.password_placeholder}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                autoComplete="new-password"
                showPasswordLabel={a.password_show}
                hidePasswordLabel={a.password_hide}
                ref={field.ref}
                error={fieldState.error?.message}
                required={false}
                disabled={busy}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <AuthPasswordField
                label={a.confirm_password}
                placeholder={a.password_placeholder}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                autoComplete="new-password"
                showPasswordLabel={a.password_show}
                hidePasswordLabel={a.password_hide}
                ref={field.ref}
                error={fieldState.error?.message}
                required={false}
                disabled={busy}
              />
            )}
          />

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-700/80 dark:bg-slate-900/35">
            <p className="text-sm font-semibold text-foreground">
              {a.register_checklist_title}
            </p>
            <ul className="mt-3 list-none space-y-2.5 ps-0" aria-live="polite">
              <ChecklistRow done={emailLooksValid}>
                {a.register_rule_email}
              </ChecklistRow>
              <ChecklistRow done={passwordLongEnough}>
                {a.register_rule_password}
              </ChecklistRow>
              <ChecklistRow done={passwordsMatch}>
                {a.register_rule_confirm}
              </ChecklistRow>
            </ul>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:brightness-110 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
          >
            {busy ? a.loading : a.submit_register}
          </button>
        </form>

        <p className="mt-8 border-t border-slate-200/80 pt-6 text-center text-sm text-muted dark:border-slate-700/80">
          {a.have_account}{" "}
          <Link
            href={`/${lang}/auth/signin`}
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            {t.common.login}
          </Link>
        </p>
      </div>
    </section>
  );
}
