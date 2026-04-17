'use client'

import { DEFAULT_LOCALE, LOCALES, LOCALES_List } from '@/data/costants'
import { usePathname, useRouter } from 'next/navigation'
import Iconify from '../shared/Iconify'

export function LocaleSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const segments = pathname.split('/')
  const currentLocale =
    segments[1] && LOCALES.includes(segments[1] as any)
      ? segments[1]
      : DEFAULT_LOCALE

  function switchLocale(locale: string) {
    if (!pathname || locale === currentLocale) return

    const newSegments = [...segments]

    if (newSegments[1] && LOCALES.includes(newSegments[1] as any)) {
      // Path already has a locale as the first segment → replace it
      newSegments[1] = locale
      const newPath = newSegments.join('/') || '/'
      router.replace(newPath)
    } else {
      // No locale segment present → prefix the current path with the new locale
      const suffix =
        pathname === '/'
          ? ''
          : pathname.startsWith('/')
            ? pathname
            : `/${pathname}`
      const newPath = `/${locale}${suffix}`
      router.replace(newPath)
    }
  }

  const nextLocale =
    LOCALES_List.find((locale) => locale.code !== currentLocale) ?? LOCALES_List[0]

  if (!nextLocale || nextLocale.code === currentLocale) return null

  return (
    <button
      type="button"
      onClick={() => switchLocale(nextLocale.code)}
      aria-label={`Switch language to ${nextLocale.name}`}
      title={`Switch to ${nextLocale.name}`}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-accent/40 bg-accent/10 px-2 text-accent transition-all duration-300 hover:border-accent hover:bg-accent/18 hover:shadow-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
    >
      <Iconify icon={nextLocale.flag} width={20} className="block md:hidden" />
      <span className="hidden text-xs font-semibold uppercase tracking-wide md:block">
        {nextLocale.name}
      </span>
    </button>
  )
}
