'use client';

import Iconify from '@/components/shared/Iconify';
import { useTheme } from '@/components/layout/ThemeProvider';
import type { Trans } from '@/types';

export function ThemeSwitcher({ t }: { t: Trans }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? t.header.theme_switch_to_light : t.header.theme_switch_to_dark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-foreground/4 text-foreground shadow-sm transition hover:border-foreground/25 hover:bg-foreground/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Iconify
        icon={isDark ? 'tabler:sun' : 'tabler:moon'}
        width={19}
        className="text-muted-foreground"
        aria-hidden
      />
    </button>
  );
}
