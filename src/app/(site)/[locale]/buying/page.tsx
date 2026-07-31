import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { FadeUp } from '@/components/ui/FadeUp';
import { FaqSection, type FaqItem } from '@/components/sections/FaqSection';
import { buildMetadata, faqJsonLd, JsonLd } from '@/lib/seo';
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
    path: '/buying',
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

      {/* Reassurance first: the one sentence every foreign buyer needs */}
      <section className="section-pad bg-white">
        <FadeUp className="container-site">
          <div className="mx-auto max-w-[720px] text-center">
            <HairlineDivider width="w-[60px]" className="mx-auto mb-10" />
            <p className="font-display text-2xl leading-snug text-navy md:text-[40px] md:leading-[1.25]">
              {t('introStatement')}
            </p>
            <p className="mt-8 text-base leading-relaxed text-muted md:text-lg">
              {t('introBody')}
            </p>
          </div>
        </FadeUp>
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

      <FaqSection title={t('faqTitle')} items={faqItems} centered />
      <FinalCTA />
    </>
  );
}
