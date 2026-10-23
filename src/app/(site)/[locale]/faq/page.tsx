import type { ComponentProps } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { FaqList } from '@/components/sections/FaqList';
import type { FaqItem } from '@/components/sections/FaqSection';
import { FadeUp } from '@/components/ui/FadeUp';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { getGuideFaqs } from '@sanity-config/lib/queries';
import { pickLocale } from '@/lib/utils';
import { buildMetadata, breadcrumbJsonLd, JsonLd, SITE_URL } from '@/lib/seo';
import { localeUrl } from '@/i18n/routing';
import { IMAGES } from '@/lib/images';
import type { Locale } from '@/types';

export const revalidate = 3600;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/faq',
  });
}

/**
 * Every question the site answers, on one page.
 *
 * Roughly a fifth of buyers now start their research in an assistant rather
 * than a search box, and what gets retrieved there is a page that answers the
 * question directly in plain language. The answers already existed, split
 * across the buying page, the selling page and the guides. Nothing collected
 * them, so no single URL said "this is where Sottomonte answers questions".
 *
 * Deliberately NOT emitting FAQPage markup, and this is the one place on the
 * site where that is the right call. Each of these answers is already marked
 * up as FAQPage on the page it belongs to. Repeating the claim here would put
 * two competing structured-data assertions about the same question on two
 * URLs, which is the kind of thing that gets a whole site's FAQ markup
 * discounted. The hub declares what it honestly is instead: a collection page
 * whose ItemList points at where each answer lives.
 */
export default async function FaqPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  const t = await getTranslations('faq');
  const tProps = await getTranslations('properties');
  const tBuying = await getTranslations('buying');
  const tSelling = await getTranslations('selling');

  const guideFaqs = await getGuideFaqs();

  // next-intl exposes arrays through `raw`, which is exactly how the buying
  // and selling pages already read these lists. Reading them the same way here
  // means the hub cannot drift out of step with the source pages: there is one
  // copy of each answer, in the message files.
  const fromMessages = (raw: unknown): FaqItem[] =>
    Array.isArray(raw)
      ? (raw as FaqItem[]).filter((item) => item.question && item.answer)
      : [];

  const buying = fromMessages(tBuying.raw('faq'));
  const selling = fromMessages(tSelling.raw('faq'));

  const guideGroups = guideFaqs
    .map((guide) => ({
      slug: guide.slug,
      title: pickLocale(guide.title, locale),
      items: (guide.faq ?? [])
        .map((item) => ({
          question: pickLocale(item.question, locale),
          answer: pickLocale(item.answer, locale),
        }))
        .filter((item) => item.question && item.answer),
    }))
    .filter((group) => group.items.length > 0);

  /**
   * Each group carries both a `href` for the Link and a resolved `url` string
   * for the structured data, built here rather than at the render site. The
   * two must agree, and next-intl's typed pathnames make the dynamic guide
   * route a different shape from the static ones, so resolving both once is
   * what stops that difference leaking into the JSX.
   */
  interface FaqGroup {
    id: string;
    title: string;
    items: FaqItem[];
    href: ComponentProps<typeof Link>['href'];
    url: string;
    linkLabel: string;
  }

  const allGroups: FaqGroup[] = [
    {
      id: 'buying',
      title: t('buyingTitle'),
      items: buying,
      href: '/buying',
      url: localeUrl(SITE_URL, locale, '/buying'),
      linkLabel: t('buyingLink'),
    },
    {
      id: 'selling',
      title: t('sellingTitle'),
      items: selling,
      href: '/selling',
      url: localeUrl(SITE_URL, locale, '/selling'),
      linkLabel: t('sellingLink'),
    },
    ...guideGroups.map((group) => ({
      id: `guide-${group.slug}`,
      title: group.title,
      items: group.items,
      href: {
        pathname: '/guides/[slug]' as const,
        params: { slug: group.slug },
      },
      url: localeUrl(SITE_URL, locale, '/guides/[slug]', { slug: group.slug }),
      linkLabel: t('guideLink'),
    })),
  ];

  // Annotated before filtering, not after: applying the annotation to the
  // result of `.filter` lets TypeScript infer the literal's `href` as a plain
  // string first, which is not assignable to next-intl's typed pathnames.
  const groups = allGroups.filter((group) => group.items.length > 0);

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${localeUrl(SITE_URL, locale, '/faq')}#page`,
          url: localeUrl(SITE_URL, locale, '/faq'),
          name: t('title'),
          description: t('leadBody'),
          inLanguage: locale,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: total,
            itemListElement: groups.flatMap((group, groupIndex) =>
              group.items.map((item, i) => ({
                '@type': 'ListItem',
                // Flat, continuous positions across groups: an ItemList that
                // restarts at 1 three times describes three lists, not one.
                position:
                  groups
                    .slice(0, groupIndex)
                    .reduce((sum, g) => sum + g.items.length, 0) +
                  i +
                  1,
                name: item.question,
                url: group.url,
              }))
            ),
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tProps('breadcrumbHome'), route: '/' },
            { name: t('breadcrumb'), route: '/faq' },
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
          <FadeUp>
            <div className="max-w-3xl">
              <HairlineDivider width="w-[60px]" />
              <p className="mt-8 font-display text-2xl leading-snug text-navy md:text-[32px] md:leading-[1.25]">
                {t('leadStatement')}
              </p>
              <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
                {t('leadBody')}
              </p>
            </div>
          </FadeUp>

          {groups.map((group, i) => (
            <div key={group.id} className={i === 0 ? 'mt-16 md:mt-24' : 'mt-20 md:mt-28'}>
              <FadeUp>
                <div className="max-w-3xl">
                  <SectionHeader title={group.title} />
                </div>
              </FadeUp>
              <FadeUp delay={80}>
                <div className="max-w-3xl">
                  {/* Namespaced ids: three lists on one page would otherwise
                      share element ids and break aria-controls. */}
                  <FaqList items={group.items} idPrefix={group.id} />
                  <Link
                    href={group.href}
                    className="mt-8 inline-block text-sm font-medium text-navy underline decoration-gold underline-offset-8 transition-colors hover:text-navy-soft"
                  >
                    {group.linkLabel} →
                  </Link>
                </div>
              </FadeUp>
            </div>
          ))}

          {groups.length === 0 && (
            <FadeUp>
              <p className="mt-12 max-w-2xl text-base leading-relaxed text-muted">
                {t('emptyBody')}
              </p>
            </FadeUp>
          )}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
