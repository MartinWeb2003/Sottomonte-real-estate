'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/**
 * Sticky sub-bar that appears once the title row scrolls out of view:
 * price + "Inquire" button. Critical on mobile.
 */
export function StickyInquiryBar({
  title,
  priceLabel,
}: {
  title: string;
  priceLabel: string;
}) {
  const t = useTranslations('property');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-20 z-40 border-b border-navy/10 bg-white transition-transform duration-500 ease-yacht',
        visible ? 'translate-y-0' : '-translate-y-[200%]'
      )}
    >
      <div className="container-site flex items-center justify-between gap-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-navy">{title}</p>
          <p className="font-display text-base font-semibold text-navy">{priceLabel}</p>
        </div>
        <a
          href="#inquiry"
          className="shrink-0 bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-soft"
        >
          {t('inquire')}
        </a>
      </div>
    </div>
  );
}
