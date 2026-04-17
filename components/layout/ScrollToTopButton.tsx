'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Iconify from '@/components/shared/Iconify';
import { Trans } from '@/types';

const ScrollToTopButton = ({ t }: { t: Trans }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        if (window.scrollY > 400) {
          setShowTopBtn(true);
        } else {
          setShowTopBtn(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="relative">
      <Link href="#home" title={t.common.nav.top}>
        {showTopBtn && (
          <Iconify
            width={50}
            height={50}
            icon="mingcute:up-fill"
            style={{ insetInlineEnd: 'max(40px, 4vw)' }}
            className="fixed bottom-10 z-20 cursor-pointer rounded-full border border-accent/40 bg-background/90 text-accent shadow-sm shadow-accent/40 backdrop-blur-sm transition-all duration-300 animate-[movebtn_2.2s_ease-in-out_infinite] hover:animate-none hover:scale-110 hover:border-accent hover:bg-accent hover:text-white! hover:shadow-accent"
          />
        )}
      </Link>
    </div>
  );
};

export default ScrollToTopButton;
