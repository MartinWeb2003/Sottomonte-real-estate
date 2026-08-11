import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { FaqSection, type FaqItem } from '@/components/sections/FaqSection';
import { Prose } from '@/components/ui/Prose';
import { GuideCard } from '@/components/ui/GuideCard';
import { ButtonLink } from '@/components/ui/Button';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import {
  getGuideBySlug,
  getGuideSlugs,
  getRelatedGuides,
} from '@sanity-config/lib/queries';
import { imageUrl } from '@sanity-config/lib/image';
import { pickLocale, pickLocaleBlocks } from '@/lib/utils';
import { formatGuideDate } from '@/lib/formatters';
import {
  buildMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  guideJsonLd,
  JsonLd,
} from '@/lib/seo';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';
import { IMAGES } from '@/lib/images';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  const t = await getTranslations({ locale, namespace: 'meta.guide' });
  // The SERP title, not the headline. A headline that reads well above the
  // article usually runs past what Google shows, and truncating it costs the
  // closing hook, so `metaTitle` carries a short version where one is needed.
  //
  // Read for this locale exactly, rather than through pickLocale: the fallback
  // chain would answer a missing German metaTitle with the Croatian one, which
  // is a worse result than simply using the German headline.
  const title =
    guide.metaTitle?.[locale]?.trim() || pickLocale(guide.title, locale);
  const cover = guide.coverImage;
  return buildMetadata({
    locale,
    title: t('title', { title }),
    // The excerpt is written to meta-description length in Studio; the
    // fallback only covers a guide published before anyone filled it in.
    description: pickLocale(guide.excerpt, locale) || t('descriptionFallback'),
    route: '/guides/[slug]',
    params: { slug },
    image: cover ? imageUrl(cover, { width: 1200, height: 630 }) : undefined,
  });
}

/**
 * A single guide.
 *
 * Everything on this page that is not the body copy is there to make the
 * content attributable and connected: a named author with a role, both dates
 * shown on screen and in the markup, the villages the guide covers linked
 * back to their own pages, and a closing pair of links into the two things a
 * reader might actually want next (the listings, or a valuation).
 */
export default async function GuidePage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(locale);

  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const t = await getTranslations('guides');
  const tProps = await getTranslations('properties');
  const tLoc = await getTranslations('locations');

  const related = await getRelatedGuides(
    slug,
    (guide.relatedLocations ?? []).map((location) => location._id)
  );

  const title = pickLocale(guide.title, locale);
  const excerpt = pickLocale(guide.excerpt, locale);
  const body = pickLocaleBlocks(guide.body, locale);
  const cover = guide.coverImage;

  const authorName = guide.author?.name;
  const authorRole = pickLocale(guide.author?.role, locale);
  const authorBio = pickLocale(guide.author?.bio, locale);

  // Structured data and visible text are built from the same array, so the
  // FAQPage markup can never drift from what a reader sees.
  const faqItems: FaqItem[] = (guide.faq ?? [])
    .map((item) => ({
      question: pickLocale(item.question, locale),
      answer: pickLocale(item.answer, locale),
    }))
    .filter((item) => item.question && item.answer);

  const coverUrl = cover
    ? imageUrl(cover, { width: 1200, height: 630 })
    : undefined;

  return (
    <>
      <JsonLd
        data={guideJsonLd({
          guide,
          locale,
          title,
          description: excerpt,
          image: coverUrl?.startsWith('http') ? coverUrl : undefined,
          authorName,
          authorRole: authorRole || undefined,
        })}
      />
      {faqItems.length > 0 && <JsonLd data={faqJsonLd(faqItems)} />}
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tProps('breadcrumbHome'), route: '/' },
            { name: t('breadcrumb'), route: '/guides' },
            { name: title, route: '/guides/[slug]', params: { slug } },
          ],
          locale
        )}
      />

      <PageHeader
        image={
          cover ? imageUrl(cover, { width: 2400, height: 1200 }) : IMAGES.bannerBuying
        }
        imageAlt={cover?.alt || undefined}
        title={title}
        subtitle={excerpt || undefined}
      />

      <article className="section-pad bg-white">
        <div className="container-site">
          {/* Byline. Anonymous, undated advice is worth less than signed,
              dated advice, both to a reader deciding whether to trust it and
              to the systems ranking it. */}
          <div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
              {authorName && (
                <span>
                  <span className="text-muted/70">{t('authorLabel')}: </span>
                  <span className="font-medium text-navy">{authorName}</span>
                  {authorRole && <span className="text-muted/70">, {authorRole}</span>}
                </span>
              )}
              {guide.publishedAt && (
                <time dateTime={guide.publishedAt}>
                  {t('published', {
                    date: formatGuideDate(guide.publishedAt, locale),
                  })}
                </time>
              )}
              {guide.updatedAt && guide.updatedAt !== guide.publishedAt && (
                <time dateTime={guide.updatedAt}>
                  {t('updated', { date: formatGuideDate(guide.updatedAt, locale) })}
                </time>
              )}
            </div>
            <HairlineDivider className="mt-8" />
          </div>

          {body && (
            <div>
              <div className="mt-12">
                <Prose value={body} />
              </div>
            </div>
          )}

          {/* Guide -> villages. These are the pages the guide gives context
              to, and the links run both ways: the village pages surface the
              guides tagged to them. */}
          {(guide.relatedLocations?.length ?? 0) > 0 && (
            <div>
              <div className="mt-16 max-w-2xl">
                <HairlineDivider width="w-[60px]" />
                <h2 className="mt-8 font-display text-xl text-navy">
                  {t('relatedLocationsTitle')}
                </h2>
                <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  {guide.relatedLocations!.map((location) => {
                    const name = pickLocale(location.name, locale);
                    return (
                      <li key={location._id}>
                        <Link
                          href={{
                            pathname: '/locations/[slug]',
                            params: { slug: location.slug },
                          }}
                          className="font-medium text-gold transition-colors hover:text-navy"
                        >
                          {tLoc('linkLabel', { name })} →
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Author box: the Person behind the advice, with a face and a role. */}
          {authorName && authorBio && (
            <div>
              <div className="mt-16 max-w-2xl border-l-2 border-gold p-8 md:p-10">
                <h2 className="font-display text-xl text-navy">
                  {t('aboutAuthor')}
                </h2>
                <div className="mt-6 flex gap-6">
                  {guide.author?.photo && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-navy/5">
                      <Image
                        src={imageUrl(guide.author.photo, { width: 160, height: 160 })}
                        alt={authorName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-navy">{authorName}</p>
                    {authorRole && (
                      <p className="text-sm text-muted">{authorRole}</p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {authorBio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {faqItems.length > 0 && (
        <FaqSection title={t('faqTitle')} items={faqItems} animate={false} />
      )}

      {/* Guide -> offer. A guide that does not point anywhere converts nothing
          and passes no authority to the pages that need it. */}
      <section className="section-pad bg-white pt-0">
        <div className="container-site">
          <div>
            <div className="max-w-2xl">
              <HairlineDivider width="w-[60px]" />
              <h2 className="mt-8 font-display text-2xl leading-tight text-navy md:text-3xl">
                {t('ctaTitle')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                {t('ctaBody')}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/properties" variant="navy">
                  {t('ctaProperties')}
                </ButtonLink>
                <ButtonLink href="/selling" variant="ghost-navy">
                  {t('ctaSelling')}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad bg-white pt-0">
          <div className="container-site">
            <div>
              <h2 className="font-display text-2xl text-navy md:text-3xl">
                {t('relatedTitle')}
              </h2>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <GuideCard key={item._id} guide={item} locale={locale} />
              ))}
            </div>
            <Link
              href="/guides"
              className="mt-10 inline-block text-sm font-medium text-navy underline decoration-gold underline-offset-8 transition-colors hover:text-navy-soft"
            >
              {t('viewAll')} →
            </Link>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
