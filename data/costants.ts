export const DEFAULT_LOCALE = 'en';
export const FALLBACK_SITE_URL = "https://u-shopia.vercel.app/";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;
export const SITE_ORIGIN = SITE_URL.replace(/\/$/, "");

export const LOCALES_List = [
    { code: 'en', name: 'English', flag: 'twemoji:flag-united-kingdom' },
    { code: 'ar', name: 'العربية', flag: 'twemoji:flag-syria' },
] as const;

export const LOCALES = LOCALES_List.map((locale) => locale.code);