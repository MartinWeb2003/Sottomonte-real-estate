'use client';

import { useTranslations } from 'next-intl';

/**
 * Compact trust row rendered directly above every submit button, where the
 * hesitation happens: response promise, license, languages. Client-safe so
 * the (client) form components can import it.
 */
export function TrustStrip() {
  const t = useTranslations('trust');
  const items = [t('reply'), t('licensed'), t('languages')];

  return (
    <p className="border-t border-navy/10 pt-4 text-xs leading-relaxed text-muted">
      {items.join(' · ')}
    </p>
  );
}
