'use client';

import { forwardRef, useId, useState } from 'react';
import Iconify from '@/components/shared/Iconify';

type AuthEmailFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Sent as form field name; API may still expect `username`. */
  name?: string;
  disabled?: boolean;
  error?: string;
  /** HTML5 validation; turn off when using schema-only validation (e.g. RHF + Zod). */
  required?: boolean;
};

export const AuthEmailField = forwardRef<HTMLInputElement, AuthEmailFieldProps>(
  function AuthEmailField(
    {
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      name = 'username',
      disabled,
      error,
      required = true,
    },
    ref,
  ) {
    const id = useId();
    const errId = `${id}-error`;

    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-muted">
            <Iconify icon="tabler:mail" width={18} className="opacity-70" aria-hidden />
          </span>
          <input
            ref={ref}
            id={id}
            type="email"
            inputMode="email"
            name={name}
            autoComplete="email"
            required={required}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            className={`h-12 w-full rounded-xl border bg-background ps-10 pe-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/70 focus:ring-2 dark:border-slate-600/90 dark:focus:ring-accent/30 ${
              error
                ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200/90 focus:border-accent focus:ring-accent/25 dark:focus:ring-accent/30'
            }`}
          />
        </div>
        {error ? (
          <p id={errId} className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

type AuthPasswordFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name: string;
  autoComplete: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
};

export const AuthPasswordField = forwardRef<HTMLInputElement, AuthPasswordFieldProps>(
  function AuthPasswordField(
    {
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      name,
      autoComplete,
      showPasswordLabel,
      hidePasswordLabel,
      disabled,
      error,
      required = true,
    },
    ref,
  ) {
    const id = useId();
    const [visible, setVisible] = useState(false);
    const errId = `${id}-error`;

    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-muted">
            <Iconify icon="tabler:lock" width={18} className="opacity-70" aria-hidden />
          </span>
          <input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            name={name}
            autoComplete={autoComplete}
            required={required}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            className={`h-12 w-full rounded-xl border bg-background ps-10 pe-12 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/70 focus:ring-2 dark:border-slate-600/90 dark:focus:ring-accent/30 ${
              error
                ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200/90 focus:border-accent focus:ring-accent/25 dark:focus:ring-accent/30'
            }`}
          />
          <button
            type="button"
            className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            aria-label={visible ? hidePasswordLabel : showPasswordLabel}
          >
            <Iconify icon={visible ? 'tabler:eye-off' : 'tabler:eye'} width={20} className="opacity-80" aria-hidden />
          </button>
        </div>
        {error ? (
          <p id={errId} className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
