import { getLocale, getTranslations } from 'next-intl/server';
import { pickLocale } from '@/lib/utils';
import type { Locale, Property } from '@/types';

/**
 * Explicit legal transparency block — what's clean, what's pending.
 */
export async function PapersStatus({ property }: { property: Property }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('property');
  const text = pickLocale(property.papersStatus, locale);
  if (!text) return null;

  return (
    <div className="border-t border-navy/10 pt-8">
      <h2 className="font-display text-2xl text-navy">{t('papersTitle')}</h2>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">
        {text}
      </p>
    </div>
  );
}
