import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeUp } from '@/components/ui/FadeUp';
import { GuideCard } from '@/components/ui/GuideCard';
import { getGuides } from '@sanity-config/lib/queries';
import type { Locale } from '@/types';

/**
 * Three newest guides plus a link to the index.
 *
 * Extracted from the buying page, which was the only page linking to the
 * guides at all. The homepage and the properties grid, the two pages carrying
 * the most weight, linked to none of them, which left the deepest content on
 * the site reachable only through the guides index and the village pages.
 *
 * `title` is optional so a page can phrase the heading for its own context;
 * without it the shared `guides.title` is used.
 */
export async function GuidesTeaser({
  locale,
  title,
}: {
  locale: Locale;
  title?: string;
}) {
  const guides = await getGuides();
  if (guides.length === 0) return null;

  const t = await getTranslations('guides');

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <FadeUp>
          <SectionHeader title={title ?? t('title')} />
        </FadeUp>
        <ul className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {guides.slice(0, 3).map((guide, i) => (
            <FadeUp key={guide._id} as="li" delay={i * 80} className="h-full">
              <GuideCard guide={guide} locale={locale} />
            </FadeUp>
          ))}
        </ul>
        <FadeUp delay={240}>
          <Link
            href="/guides"
            className="mt-12 inline-block text-sm font-medium text-navy underline decoration-gold underline-offset-8 transition-colors hover:text-navy-soft"
          >
            {t('viewAll')} →
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
