'use client';

import type { ComponentProps } from 'react';
import Iconify from '@/components/shared/Iconify';

type Props = ComponentProps<typeof Iconify> & {
  /** Add `rtl:rotate-180` so LTR-oriented glyphs (e.g. →, ›) read correctly in RTL without swapping icon names. */
  flipInRtl?: boolean;
};

/**
 * Directional Iconify glyph: use one “LTR” icon (arrow-right, chevron-right, …) and flip in RTL
 * instead of switching to the mirrored icon name.
 */
export function DirectionalIcon({ className = '', flipInRtl = true, ...props }: Props) {
  const rtl = flipInRtl ? 'rtl:rotate-180' : '';
  return <Iconify {...props} className={[rtl, className].filter(Boolean).join(' ')} />;
}
