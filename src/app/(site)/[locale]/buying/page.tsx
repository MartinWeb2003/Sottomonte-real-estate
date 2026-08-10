import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeUp } from '@/components/ui/FadeUp';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { FaqSection, type FaqItem } from '@/components/sections/FaqSection';
import { GuideCard } from '@/components/ui/GuideCard';
import { apartmentLink } from '@/components/ui/apartmentLink';
import { buildMetadata, faqJsonLd, JsonLd } from '@/lib/seo';
import { getGuides } from '@sanity-config/lib/queries';
import { pickLocale } from '@/lib/utils';
import type { Locale } from '@/types';
import { IMAGES } from '@/lib/images';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.buying' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/buying',
  });
}

/**
 * The page for audience #1: anxious foreign buyers. Answers the process,
 * the costs and the legal questions before they have to ask.
 */
export default async function BuyingPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('buying');
  const tGuides = await getTranslations('guides');
  const guides = await getGuides();

  const faqItems = t.raw('faq') as FaqItem[];
  const costs = t.raw('costs') as Array<{
    label: string;
    value: string;
    note: string;
  }>;
  const processSteps = [0, 1, 2, 3, 4] as const;

  return (
    <>
      <JsonLd data={faqJsonLd(faqItems)} />

      <PageHeader
        image={IMAGES.bannerBuying}
        tall
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Reassurance: the one thing every foreign buyer needs answered.
          60/40 editorial split, text left, photo right, per the layout rule
          preferring asymmetry over centered blocks. */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <div className="grid items-center gap-12 lg:grid-cols-[60fr_40fr] lg:gap-20">
            <FadeUp>
              <HairlineDivider width="w-[60px]" className="mb-10" />
              <p className="font-display text-2xl leading-snug text-navy md:text-[40px] md:leading-[1.25]">
                {t('introStatement')}
              </p>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                {t('introBody')}
              </p>
            </FadeUp>
            <FadeUp delay={150}>
              <div className="relative aspect-[4/5] overflow-hidden bg-navy/5">
                <Image
                  src={IMAGES.buyingIntro}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Process — numbered steps on a gold line, same pattern as selling */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <FadeUp>
            <SectionHeader title={t('processTitle')} />
          </FadeUp>
          <div className="relative mt-14 max-w-2xl md:mt-20">
            <div
              aria-hidden
              className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-gold"
            />
            <ol className="space-y-12">
              {processSteps.map((i) => (
                <FadeUp key={i} as="li" delay={i * 80} className="relative pl-10">
                  <span
                    aria-hidden
                    className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border border-gold bg-white"
                  />
                  <h3 className="font-display text-xl text-navy">
                    <span className="mr-3 text-gold">0{i + 1}</span>
                    {t(`processSteps.${i}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                    {t(`processSteps.${i}.body`)}
                  </p>
                </FadeUp>
              ))}
            </ol>

            {/* Placed here on purpose: the reader has just gone through the
                viewings step, so accommodation is the next practical question
                rather than an advert. Ownership is stated in the copy. */}
            <FadeUp delay={200}>
              <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
                {t.rich('stayNote', { link: apartmentLink })}
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Costs — the honest breakdown, navy block */}
      <section className="section-pad bg-navy">
        <div className="container-site">
          <FadeUp>
            <SectionHeader dark title={t('costsTitle')} subtitle={t('costsIntro')} />
          </FadeUp>
          <FadeUp delay={120}>
            <div className="mt-12 max-w-3xl border-b border-white/15 md:mt-16">
              {costs.map((cost) => (
                <div
                  key={cost.label}
                  className="grid gap-2 border-t border-white/15 py-6 md:grid-cols-[1fr_auto] md:gap-10"
                >
                  <div>
                    <p className="text-base font-medium text-white">{cost.label}</p>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/60">
                      {cost.note}
                    </p>
                  </div>
                  <p className="font-display text-xl font-semibold text-white md:text-right">
                    {cost.value}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Buying page -> guides. This page is the summary; the guides are the
          detail behind each step. Without this link the deepest content on the
          site would sit one footer link from the homepage and nowhere else. */}
      {guides.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-site">
            <FadeUp>
              <SectionHeader title={t('guidesTitle')} />
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
                {tGuides('viewAll')} →
              </Link>
            </FadeUp>
          </div>
        </section>
      )}

      <FaqSection title={t('faqTitle')} items={faqItems} centered />
      <FinalCTA />
    </>
  );
}
