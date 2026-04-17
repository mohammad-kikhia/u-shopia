'use client';

import * as React from 'react';
import type { FieldError as RHFFieldError } from 'react-hook-form';

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'vertical' | 'horizontal';
};

export function Field({
  className,
  orientation = 'vertical',
  ...props
}: FieldProps) {
  return (
    <div
      className={cn(
        'flex gap-2',
        orientation === 'horizontal' ? 'items-center justify-between' : 'flex-col',
        className,
      )}
      {...props}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-4', className)} {...props} />
  );
}

export function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-sm font-medium text-primary', className)}
      {...props}
    />
  );
}

type FieldErrorProps = {
  errors?: Array<RHFFieldError | null | undefined>;
};

export function FieldError({ errors }: FieldErrorProps) {
  const first = errors?.find(Boolean);
  if (!first?.message) return null;

  return (
    <p className="mt-1 text-xs text-red-400">
      {first.message}
    </p>
  );
}

export function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('mt-1 text-xs text-muted', className)}
      {...props}
    />
  );
}

