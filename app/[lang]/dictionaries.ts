import 'server-only'
import { DEFAULT_LOCALE } from '@/data/costants'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ar: () => import('@/dictionaries/ar.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: string | Locale) => {
  const safeLocale = hasLocale(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const loader = dictionaries[safeLocale]
  return loader()
}