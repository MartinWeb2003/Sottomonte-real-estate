import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { FadeUp } from '@/components/ui/FadeUp';
import { ButtonLink } from '@/components/ui/Button';
import { GuideCard } from '@/components/ui/GuideCard';
import { getGuides } from '@sanity-config/lib/queries';
import { buildMetadata, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import type { Locale } from '@/types';
import { IMAGES } from '@/lib/images';

export const revalidate = 3600;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.guides' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/guides',
  });
}

/**
 * Guides index: the hub of the content side of the site.
 *
 * This page exists to be linked from and to link out. It collects the depth
 * content that the listing pages cannot carry, and it is the destination the
 * village pages and the buying page point at.
 */
export default async function GuidesPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  const t = await getTranslations('guides');
  const tProps = await getTranslations('properties');
  const guides = await getGuides();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tProps('breadcrumbHome'), route: '/' },
            { name: t('breadcrumb'), route: '/guides' },
          ],
          locale
        )}
      />

      <PageHeader
        image={IMAGES.bannerBuying}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="section-pad bg-white">
        <div className="container-site">
          {guides.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide, i) => (
                <FadeUp key={guide._id} delay={(i % 3) * 80} className="h-full">
                  <GuideCard
                    guide={guide}
                    locale={locale}
                    withImage
                    headingLevel="h2"
                  />
                </FadeUp>
              ))}
            </div>
          ) : (
            <FadeUp>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-display text-3xl leading-tight text-navy md:text-[40px]">
                  {t('emptyTitle')}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
                  {t('emptyBody')}
                </p>
                <ButtonLink href="/contact" variant="ghost-navy" className="mt-8">
                  {t('emptyCta')}
                </ButtonLink>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
