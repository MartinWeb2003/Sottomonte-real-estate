import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeUp } from '@/components/ui/FadeUp';
import { SellerLeadForm } from '@/components/forms/SellerLeadForm';
import { SellingTimeline } from '@/components/sections/SellingTimeline';
import { FaqSection, type FaqItem } from '@/components/sections/FaqSection';
import { buildMetadata, faqJsonLd, JsonLd } from '@/lib/seo';
import { AGENCY } from '@/lib/utils';
import type { Locale } from '@/types';
import { IMAGES } from '@/lib/images';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.selling' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/selling',
  });
}

export default async function SellingPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('selling');

  const pitchItems = [0, 1, 2] as const;
  const faqItems = t.raw('faq') as FaqItem[];

  return (
    <>
      <JsonLd data={faqJsonLd(faqItems)} />
      <PageHeader
        image={IMAGES.bannerSelling}
        tall
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Pitch — 3 columns, same pattern as home "The difference" */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <FadeUp>
            <SectionHeader title={t('pitchTitle')} />
          </FadeUp>
          {/* Subgrid so the title and body of all three columns sit on shared
              rows. Without it a title that wraps to two lines pushes its own
              body down and the paragraphs stop lining up. Row heights come from
              the tallest title, whatever the locale does to it.
              Two rows now, not three: the 01/02/03 numbers were removed. */}
          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:grid-rows-[auto_1fr] md:gap-x-10 md:gap-y-0">
            {pitchItems.map((i) => (
              <FadeUp
                key={i}
                delay={i * 120}
                className="border-t border-gold pt-8 md:row-span-2 md:grid md:grid-rows-subgrid"
              >
                <h3 className="font-display text-2xl text-navy">
                  {t(`pitchItems.${i}.title`)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  {t(`pitchItems.${i}.body`)}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Process — alternating timeline on a scroll-drawn gold line */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <FadeUp>
            <SectionHeader title={t('processTitle')} />
          </FadeUp>
          <SellingTimeline />
        </div>
      </section>

      <FaqSection title={t('faqTitle')} items={faqItems} centered />

      {/* Seller form */}
      <section className="section-pad bg-white">
        <FadeUp className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl text-navy md:text-[40px]">
              {t('formTitle')}
            </h2>
            <div className="mt-10">
              <SellerLeadForm />
            </div>
          </div>
        </FadeUp>
      </section>

      <FinalCTA />
    </>
  );
}
