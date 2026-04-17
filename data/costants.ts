export const DEFAULT_LOCALE = 'en';

export const LOCALES_List = [
    { code: 'en', name: 'English', flag: 'twemoji:flag-united-kingdom' },
    { code: 'ar', name: 'العربية', flag: 'twemoji:flag-syria' },
] as const;

export const LOCALES = LOCALES_List.map((locale) => locale.code);