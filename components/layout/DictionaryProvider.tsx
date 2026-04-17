'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import { Dictionary } from '@/lib/i18n';

const DictionaryContext = createContext<Dictionary | null>(null);

function getNestedValue(source: unknown, path: string): string {
  if (!source || !path) return '';
  const normalizedPath = path.replaceAll(':', '.');
  const value = normalizedPath
    .split('.')
    .reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), source);

  return typeof value === 'string' ? value : '';
}

export function DictionaryProvider({
  children,
  dictionary,
}: {
  children: ReactNode;
  dictionary: Dictionary;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);
  if (!dictionary) {
    throw new Error('useDictionary must be used inside DictionaryProvider');
  }
  return dictionary;
}

export function useTranslation() {
  const dictionary = useDictionary();

  return useMemo(
    () =>
      (path: string, fallback = '') => {
        const translatedValue = getNestedValue(dictionary, path);
        if (translatedValue) return translatedValue;
        return fallback || path;
      },
    [dictionary]
  );
}

