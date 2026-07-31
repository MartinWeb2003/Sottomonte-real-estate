'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const STORAGE_KEY = 'sottomonte-consent';

function loadGA(gaId: string) {
  if (document.getElementById('ga4-script')) return;
  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  }
  gtag('js', new Date());
  gtag('config', gaId, { anonymize_ip: true });
}

/**
 * GDPR consent banner. GA4 loads ONLY after explicit consent —
 * required for the EU/German audience.
 */
export function ConsentBanner() {
  const t = useTranslations('consent');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (stored === 'accepted' && gaId) {
      loadGA(gaId);
    } else if (!stored) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const decide = (accepted: boolean) => {
    localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'declined');
    setVisible(false);
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (accepted && gaId) loadGA(gaId);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-[90] border-t border-gold bg-navy px-5 py-5 md:bottom-6 md:left-auto md:right-6 md:max-w-md md:border md:border-white/10"
    >
      <p className="text-sm leading-relaxed text-white/85">
        {t('text')}{' '}
        <a
          href={`/${locale}/privacy`}
          className="underline underline-offset-2 hover:text-white"
        >
          {t('privacy')}
        </a>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => decide(true)}
          className="bg-white px-5 py-2 text-sm font-medium text-navy transition-colors hover:bg-white/90"
        >
          {t('accept')}
        </button>
        <button
          type="button"
          onClick={() => decide(false)}
          className="border border-white/40 px-5 py-2 text-sm text-white transition-colors hover:border-white"
        >
          {t('decline')}
        </button>
      </div>
    </div>
  );
}
