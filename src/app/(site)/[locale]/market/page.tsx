import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { FadeUp } from '@/components/ui/FadeUp';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { ButtonLink } from '@/components/ui/Button';
import { getMarketProperties, getMarketUpdatedAt } from '@sanity-config/lib/queries';
import { buildMarketSnapshot, MIN_SAMPLE, NEAR_SEA_METERS } from '@/lib/market';
import { formatPrice, formatGuideDate } from '@/lib/formatters';
import { pickLocale, AGENCY } from '@/lib/utils';
import {
  buildMetadata,
  breadcrumbJsonLd,
  marketDatasetJsonLd,
  JsonLd,
} from '@/lib/seo';
import { IMAGES } from '@/lib/images';
import type { Locale } from '@/types';

export const revalidate = 3600;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.market' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/market',
  });
}

/**
 * Asking prices across the peninsula, village by village.
 *
 * This page exists to be cited, not to convert. A regional outlet will not
 * link to a listings grid, and neither will an assistant answering "what do
 * houses cost in Orebić" — both need a number with a source and a date on it.
 * That is the entire design brief here: publish the agency's own inventory as
 * data, state exactly what it measures, and license it for reuse.
 *
 * Everything is computed from live listings at build time, so the table cannot
 * go stale against the portfolio it describes. The caveats are rendered as
 * prominently as the figures on purpose; see lib/market.ts.
 */
export default async function MarketPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  const t = await getTranslations('market');
  const tProps = await getTranslations('properties');

  const [properties, updatedAt] = await Promise.all([
    getMarketProperties(),
    getMarketUpdatedAt(),
  ]);

  const { villages, totals } = buildMarketSnapshot(properties);
  const villageNames = villages.map((village) => pickLocale(village.name, locale));

  const perM2 = (value: number | null) =>
    value === null ? null : `${formatPrice(value)} / m²`;

  const range = (min: number | null, max: number | null) => {
    if (min === null || max === null) return null;
    return min === max
      ? formatPrice(min)
      : t('rangeValue', { min: formatPrice(min), max: formatPrice(max) });
  };

  const stats = [
    { value: String(totals.listings), label: t('statListings') },
    { value: String(totals.villages), label: t('statVillages') },
    {
      value: perM2(totals.medianPricePerM2) ?? t('naLabel'),
      label: t('statMedian'),
    },
    { value: String(totals.nearSea), label: t('statNearSea') },
  ];

  const columns = [
    t('colVillage'),
    t('colListings'),
    t('colMedian'),
    t('colLand'),
    t('colRange'),
    t('colNearSea'),
  ];

  return (
    <>
      <JsonLd
        data={marketDatasetJsonLd({
          locale,
          name: t('datasetName'),
          description: t('datasetDescription'),
          updatedAt: updatedAt || undefined,
          villageNames,
          measurement: t('measurement'),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tProps('breadcrumbHome'), route: '/' },
            { name: t('breadcrumb'), route: '/market' },
          ],
          locale
        )}
      />

      <PageHeader
        image={IMAGES.bannerProperties}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* What the numbers are, before any number is shown. A reader who meets
          the table first will read it as a market index, which it is not. */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <FadeUp>
            <div className="max-w-3xl">
              <HairlineDivider width="w-[60px]" />
              <p className="mt-8 font-display text-2xl leading-snug text-navy md:text-[32px] md:leading-[1.25]">
                {t('leadStatement')}
              </p>
              <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
                {t('leadBody')}
              </p>
              {updatedAt && (
                <p className="mt-6 text-sm text-muted">
                  {t('asOf', { date: formatGuideDate(updatedAt, locale) })}
                </p>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {villages.length === 0 ? (
        <section className="section-pad bg-navy">
          <div className="container-site">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl leading-tight text-white md:text-[40px]">
                {t('emptyTitle')}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
                {t('emptyBody')}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Headline figures, on navy. These are the four numbers a journalist
              lifts without reading the table. */}
          <section className="section-pad bg-navy">
            <div className="container-site">
              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                  <FadeUp key={stat.label} delay={i * 80}>
                    <div className="border-t border-white/20 pt-6">
                      <p className="font-display text-3xl leading-none text-white md:text-[40px]">
                        {stat.value}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-white/70">
                        {stat.label}
                      </p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* The table. Scrolls inside its own container on narrow screens so
              the page body never scrolls sideways. */}
          <section className="section-pad bg-white">
            <div className="container-site">
              <FadeUp>
                <SectionHeader title={t('tableTitle')} subtitle={t('tableIntro')} />
              </FadeUp>

              <FadeUp delay={100}>
                <div className="mt-12 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <caption className="sr-only">{t('tableCaption')}</caption>
                    <thead>
                      <tr className="border-b border-gold">
                        {columns.map((column, i) => (
                          <th
                            key={column}
                            scope="col"
                            className={
                              i === 0
                                ? 'pb-4 text-xs font-medium tracking-eyebrow text-muted'
                                : 'pb-4 pl-6 text-xs font-medium tracking-eyebrow text-muted'
                            }
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {villages.map((village) => {
                        const name = pickLocale(village.name, locale);
                        const cells = [
                          String(village.listings),
                          perM2(village.medianPricePerM2) ?? t('naLabel'),
                          perM2(village.medianLandPricePerM2) ?? t('naLabel'),
                          range(village.minPrice, village.maxPrice) ?? t('naLabel'),
                          String(village.nearSea),
                        ];
                        return (
                          <tr key={village.slug} className="border-b border-navy/10">
                            <th scope="row" className="py-5 pr-6 font-normal">
                              <Link
                                href={{
                                  pathname: '/locations/[slug]',
                                  params: { slug: village.slug },
                                }}
                                className="text-sm font-medium tracking-eyebrow text-navy transition-colors hover:text-gold"
                              >
                                {name}
                              </Link>
                            </th>
                            {cells.map((cell, i) => (
                              <td
                                key={i}
                                className="whitespace-nowrap py-5 pl-6 font-display text-base text-navy"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </FadeUp>

              <FadeUp delay={200}>
                <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
                  {t('tableFootnote', { min: MIN_SAMPLE, meters: NEAR_SEA_METERS })}
                </p>
              </FadeUp>
            </div>
          </section>
        </>
      )}

      {/* Method. The part that decides whether the numbers above are quotable. */}
      <section className="section-pad bg-white pt-0">
        <div className="container-site">
          <FadeUp>
            <div className="max-w-3xl border-l-2 border-gold p-8 md:p-10">
              <h2 className="font-display text-2xl text-navy md:text-3xl">
                {t('methodTitle')}
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
                <p>{t('methodSource')}</p>
                <p>{t('methodMedian')}</p>
                <p>{t('methodLimits')}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Reuse terms, stated in plain language. A figure a reporter has to ask
          permission for is a figure that goes uncited. */}
      <section className="section-pad bg-navy">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <FadeUp>
              <SectionHeader dark title={t('citeTitle')} subtitle={t('citeBody')} />
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`mailto:${AGENCY.email}?subject=${encodeURIComponent(
                    t('citeMailSubject')
                  )}`}
                  className="ease-yacht inline-flex items-center justify-center gap-2 border border-white/60 px-7 py-3.5 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
                >
                  {t('citeCta')}
                </a>
                <ButtonLink href="/press" variant="white">
                  {t('citePress')}
                </ButtonLink>
              </div>
            </FadeUp>
            <FadeUp delay={120}>
              <div className="border-t border-white/20 pt-6 text-sm leading-relaxed text-white/70">
                <p>{t('citeLicense')}</p>
                <p className="mt-4">{t('citeAttribution')}</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
