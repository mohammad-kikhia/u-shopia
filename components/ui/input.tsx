'use client';

import * as React from 'react';

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-full border border-foreground/15 bg-background/95 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur-sm transition placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-0 dark:border-foreground/20 dark:bg-background/55',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

