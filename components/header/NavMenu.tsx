'use client';

import { footerPages } from '@/data/variables';
import Link from 'next/link';
import Iconify from '@/components/shared/Iconify';
import { DirectionalIcon } from '@/components/shared/DirectionalIcon';
import { Trans } from '@/types';
import { Locale } from '@/app/[lang]/dictionaries';
import { usePathname } from 'next/navigation';

type Props = {
  lang: Locale;
  t: Trans;
  setHidden: (value: boolean) => void;
  className?: string;
  layout?: 'desktop' | 'mobile';
};

export default function NavMenu({ lang, t, setHidden, className = '', layout = 'desktop' }: Props) {
  const pathname = usePathname();
  const isMobile = layout === 'mobile';

  return (
    <ul
      onClick={(e) => e.stopPropagation()}
      className={
        isMobile
          ? `flex w-full flex-col gap-1 ${className}`
          : `flex items-center gap-0.5 rounded-full border border-slate-200/70 bg-slate-100/50 p-1 shadow-inner shadow-slate-200/20 dark:border-slate-600/60 dark:bg-slate-800/50 dark:shadow-slate-950/40 ${className}`
      }
    >
      {footerPages.map((page) => {
        const localizedHref = page.href === '/' ? `/${lang}` : `/${lang}${page.href}`;
        const active =
          pathname === localizedHref ||
          (localizedHref !== `/${lang}` && pathname?.startsWith(`${localizedHref}/`));

        return (
          <li key={page.href} onClick={() => setHidden(true)}>
            <Link
              href={localizedHref}
              className={
                isMobile
                  ? `flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition hover:border-slate-200/80 hover:bg-slate-100/80 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 ${
                      active
                        ? 'border-accent/25 bg-accent/10 text-accent'
                        : 'text-foreground/85'
                    }`
                  : `relative block rounded-full px-3.5 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-accent text-white shadow-sm shadow-accent/25'
                        : 'text-muted hover:bg-background/90 hover:text-foreground dark:hover:bg-slate-700/60'
                    }`
              }
            >
              <span className="flex items-center gap-2">
                {isMobile ? (
                  <Iconify
                    icon={active ? 'tabler:circle-dot' : 'tabler:circle'}
                    width={16}
                    className={active ? 'text-accent' : 'text-muted opacity-60'}
                    aria-hidden
                  />
                ) : null}
                {t.common[page.labelKey as 'home' | 'shop' | 'about_us' | 'customer_service']}
              </span>
              {isMobile ? (
                <DirectionalIcon
                  icon="tabler:chevron-right"
                  width={18}
                  className="text-muted opacity-50"
                  aria-hidden
                />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
