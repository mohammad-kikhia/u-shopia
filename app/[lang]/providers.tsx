'use client';

// this file provides the whole website with needed data
// it is mainly used for client components
// it helps to keep the layout.tsx cleaner and keep it as a server component
import { ReactNode, useEffect } from 'react';
import AOS from 'aos';
import CheckoutReturnToast from '@/components/layout/CheckoutReturnToast';
import NotificationsProvider from '@/components/layout/NotificationsProvider';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/components/layout/AuthProvider';
import { CartProvider } from '@/components/layout/CartProvider';
import { Dictionary } from '@/lib/i18n';
import { DictionaryProvider } from '@/components/layout/DictionaryProvider';

function Providers({
  children,
  dictionary,
}: {
  children: ReactNode;
  dictionary: Dictionary;
}) {
  useEffect(() => {
    //  initialize AOS "animate on scroll" when the app loads
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    AOS.init({
      duration: reduceMotion ? 0 : 650,
      once: true,
      offset: 48,
      easing: 'ease-out-cubic',
      disable: reduceMotion,
    });
  }, []);
  return (
    <>
      <DictionaryProvider dictionary={dictionary}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <NotificationsProvider>
                <CheckoutReturnToast />
                {children}
              </NotificationsProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </DictionaryProvider>
    </>
  );
}

export default Providers;
