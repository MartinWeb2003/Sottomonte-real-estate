import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { FadeUp } from '@/components/ui/FadeUp';
import { ButtonLink } from '@/components/ui/Button';
import { getGuides } from '@sanity-config/lib/queries';
import { imageUrl } from '@sanity-config/lib/image';
import { pickLocale } from '@/lib/utils';
import { buildMetadata, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import { formatGuideDate } from '@/lib/formatters';
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
    path: '/guides',
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
            { name: tProps('breadcrumbHome'), path: '' },
            { name: t('breadcrumb'), path: '/guides' },
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
              {guides.map((guide, i) => {
                const title = pickLocale(guide.title, locale);
                const excerpt = pickLocale(guide.excerpt, locale);
                const cover = guide.coverImage;
                const date = guide.updatedAt || guide.publishedAt;

                return (
                  <FadeUp key={guide._id} delay={(i % 3) * 80} className="h-full">
                    {/*
                      Bordered card, unlike the property cards elsewhere on the
                      site. A guide card is a block of text with no price and no
                      spec row, so without an edge it reads as an article
                      fragment rather than something you click. The border is a
                      1px hairline that turns gold on hover, which keeps to the
                      gold-as-hairline rule and means only the card under the
                      cursor is ever gold.

                      `h-full` plus the column layout keeps every card in a row
                      the same height however long the excerpt runs, so the
                      bottom edges line up.
                    */}
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="img-hover-zoom card-lift group flex h-full flex-col border border-navy/10 bg-white hover:border-gold focus-visible:border-gold focus-visible:outline-none"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
                        <Image
                          src={
                            cover
                              ? imageUrl(cover, { width: 720, height: 540 })
                              : IMAGES.placeholderProperty
                          }
                          alt={cover?.alt || title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        {date && (
                          <p className="text-xs font-medium uppercase tracking-eyebrow text-gold">
                            {formatGuideDate(date, locale)}
                          </p>
                        )}
                        <h2 className="mt-2 font-display text-xl leading-snug text-navy transition-colors duration-300 group-hover:text-navy-soft">
                          {title}
                        </h2>
                        {excerpt && (
                          <p className="mt-3 text-sm leading-relaxed text-muted">
                            {excerpt}
                          </p>
                        )}
                        {/* Pinned to the bottom so the call to action sits on a
                            common baseline across the row. */}
                        <p className="mt-auto pt-5 text-sm font-medium text-gold">
                          <span className="inline-block transition-transform duration-500 ease-yacht group-hover:translate-x-1">
                            {t('readMore')} →
                          </span>
                        </p>
                      </div>
                    </Link>
                  </FadeUp>
                );
              })}
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
