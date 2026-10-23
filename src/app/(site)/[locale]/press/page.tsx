import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { FadeUp } from '@/components/ui/FadeUp';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { ButtonLink } from '@/components/ui/Button';
import { getLocations, getMarketProperties } from '@sanity-config/lib/queries';
import { buildMarketSnapshot } from '@/lib/market';
import { pickLocale, AGENCY } from '@/lib/utils';
import { buildMetadata, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import { IMAGES, LOGOS } from '@/lib/images';
import type { Locale } from '@/types';

export const revalidate = 3600;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.press' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/press',
  });
}

/**
 * Press room.
 *
 * The premise of the whole site is that Sottomonte knows this peninsula
 * personally, which is exactly what makes a usable local source for a
 * regional newsroom. This page is what turns that into coverage: the
 * boilerplate paragraph a journalist pastes, the subjects the agency can
 * actually speak to, the numbers it publishes, and the logo files, all in one
 * place and none of it behind an email exchange.
 *
 * A press page nobody pitches is dead weight, so this is the landing page the
 * outreach points at, not a substitute for it.
 */
export default async function PressPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  const t = await getTranslations('press');
  const tProps = await getTranslations('properties');
  const tTrust = await getTranslations('trust');

  const [locations, properties] = await Promise.all([
    getLocations(),
    getMarketProperties(),
  ]);
  const { totals } = buildMarketSnapshot(properties);

  const villageNames = locations
    .map((location) => pickLocale(location.name, locale))
    .filter(Boolean);

  // Every fact here is read off real data or off a constant the site already
  // relies on. Nothing is rounded up for effect: a press page that overstates
  // is a press page a journalist stops trusting after the first check.
  const facts = [
    { label: t('factBase'), value: AGENCY.address },
    {
      label: t('factCoverage'),
      value: villageNames.length
        ? villageNames.join(', ')
        : t('factCoverageFallback'),
    },
    { label: t('factListings'), value: String(totals.listings) },
    { label: t('factLanguages'), value: tTrust('languages') },
    { label: t('factLicence'), value: tTrust('licensed') },
    { label: t('factContact'), value: AGENCY.email },
  ];

  const topics = [
    { title: t('topic1Title'), body: t('topic1Body') },
    { title: t('topic2Title'), body: t('topic2Body') },
    { title: t('topic3Title'), body: t('topic3Body') },
    { title: t('topic4Title'), body: t('topic4Body') },
  ];

  const logos = [
    { label: t('assetLogoDark'), file: LOGOS.navbar.src },
    { label: t('assetLogoWhite'), file: LOGOS.white.src },
    { label: t('assetLogoFull'), file: LOGOS.full.src },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tProps('breadcrumbHome'), route: '/' },
            { name: t('breadcrumb'), route: '/press' },
          ],
          locale
        )}
      />

      <PageHeader
        image={IMAGES.bannerContact}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Boilerplate. Written to be pasted verbatim into an article, which is
          why it is one self-contained paragraph and not a pitch. */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <FadeUp>
            <div className="max-w-3xl">
              <HairlineDivider width="w-[60px]" />
              <h2 className="mt-8 font-display text-2xl text-navy md:text-3xl">
                {t('boilerplateTitle')}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-navy md:text-lg">
                {t('boilerplateBody')}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                {t('boilerplateNote')}
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* The facts a fact-checker asks for. */}
      <section className="section-pad bg-navy">
        <div className="container-site">
          <FadeUp>
            <SectionHeader dark title={t('factsTitle')} />
          </FadeUp>
          <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {facts.map((fact, i) => (
              <FadeUp key={fact.label} delay={i * 60}>
                <div className="border-t border-white/20 pt-6">
                  <dt className="text-xs font-medium tracking-eyebrow text-white/60">
                    {fact.label}
                  </dt>
                  <dd className="mt-3 text-base leading-relaxed text-white">
                    {fact.value}
                  </dd>
                </div>
              </FadeUp>
            ))}
          </dl>
        </div>
      </section>

      {/* What the agency can speak to, phrased as the story angles a desk
          would commission rather than as services it sells. */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <FadeUp>
            <SectionHeader title={t('topicsTitle')} subtitle={t('topicsIntro')} />
          </FadeUp>
          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-x-16">
            {topics.map((topic, i) => (
              <FadeUp key={topic.title} delay={i * 80}>
                <div className="border-t border-navy/15 pt-6">
                  <h3 className="font-display text-xl text-navy">{topic.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {topic.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Data, and the licence that makes it usable without a phone call. */}
      <section className="section-pad bg-white pt-0">
        <div className="container-site">
          <FadeUp>
            <div className="max-w-3xl border-l-2 border-gold p-8 md:p-10">
              <h2 className="font-display text-2xl text-navy md:text-3xl">
                {t('dataTitle')}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                {t('dataBody')}
              </p>
              <ButtonLink href="/market" variant="navy" className="mt-8">
                {t('dataCta')}
              </ButtonLink>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Logos and photography terms. */}
      <section className="section-pad bg-white pt-0">
        <div className="container-site">
          <FadeUp>
            <SectionHeader title={t('assetsTitle')} subtitle={t('assetsBody')} />
          </FadeUp>
          <FadeUp delay={100}>
            <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {logos.map((logo) => (
                <li key={logo.file}>
                  <a
                    href={logo.file}
                    download
                    className="text-sm font-medium text-navy underline decoration-navy/30 underline-offset-8 transition-colors hover:decoration-navy"
                  >
                    {logo.label}
                  </a>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
              {t('assetPhotoNote')}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Direct line for journalists, kept separate from the buyer funnel. */}
      <section className="section-pad bg-navy">
        <div className="container-site">
          <FadeUp>
            <SectionHeader dark title={t('contactTitle')} subtitle={t('contactBody')} />
            <a
              href={`mailto:${AGENCY.email}?subject=${encodeURIComponent(
                t('contactMailSubject')
              )}`}
              className="ease-yacht mt-8 inline-flex items-center justify-center gap-2 bg-white px-7 py-3.5 text-sm font-medium tracking-wide text-navy transition-colors duration-300 hover:bg-white/90"
            >
              {t('contactCta')}
            </a>
          </FadeUp>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
