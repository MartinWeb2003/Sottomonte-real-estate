import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/sections/PageHeader';
import { FilterBar } from '@/components/property/FilterBar';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { BuyerWishlistForm } from '@/components/forms/BuyerWishlistForm';
import { FadeUp } from '@/components/ui/FadeUp';
import {
  getLocations,
  getProperties,
  PROPERTIES_PAGE_SIZE,
} from '@sanity-config/lib/queries';
import { buildMetadata, JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { cn } from '@/lib/utils';
import type { Locale, PropertyFilters, PropertyType } from '@/types';
import { IMAGES } from '@/lib/images';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.properties' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/properties',
  });
}

// No `dynamic = 'force-dynamic'` here on purpose. Reading `searchParams` in a
// Server Component already opts this route into per-request rendering, so the
// flag was redundant, and it additionally flipped fetchCache to
// 'force-no-store', which defeats the revalidate:3600 in sanityFetch. It made
// no measurable difference at today's dataset size (~50ms either way) but will
// once the portfolio grows past a handful of listings.
//
// A loading.tsx skeleton was tried here and removed: it painted in 12ms but
// pushed full content from 49ms to 322ms, and 49ms is already imperceptible.

const VALID_TYPES: PropertyType[] = ['house', 'apartment', 'land', 'stone-ruin'];
const VALID_SORTS = ['newest', 'price-asc', 'price-desc'] as const;

/** All filter state lives in URL searchParams — shareable and SEO-friendly. */
function parseFilters(searchParams: Record<string, string | undefined>): PropertyFilters {
  const type = VALID_TYPES.includes(searchParams.type as PropertyType)
    ? (searchParams.type as PropertyType)
    : undefined;
  const sort = VALID_SORTS.includes(searchParams.sort as (typeof VALID_SORTS)[number])
    ? (searchParams.sort as PropertyFilters['sort'])
    : undefined;
  const num = (v?: string) => {
    const n = Number(v);
    return v && Number.isFinite(n) && n > 0 ? n : undefined;
  };

  return {
    location: searchParams.location?.split(',').filter(Boolean),
    type,
    minPrice: num(searchParams.minPrice),
    maxPrice: num(searchParams.maxPrice),
    seaDistance: num(searchParams.sea),
    sort,
    page: num(searchParams.page),
  };
}

export default async function PropertiesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: Record<string, string | undefined>;
}) {
  setRequestLocale(locale);
  const t = await getTranslations('properties');

  const filters = parseFilters(searchParams);
  const [{ items, total }, locations] = await Promise.all([
    getProperties(filters),
    getLocations(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PROPERTIES_PAGE_SIZE));
  const page = Math.min(filters.page ?? 1, totalPages);

  // Returns a query object rather than a string: with localised pathnames the
  // Link needs `{ pathname, query }` so next-intl can map '/properties' to
  // '/nekretnine' or '/immobilien' per locale.
  const pageQuery = (p: number) => {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== 'page') query[key] = value;
    }
    if (p > 1) query.page = String(p);
    return query;
  };

  return (
    <>
      <PageHeader
        image={IMAGES.bannerProperties}
        title={t('title')}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: t('breadcrumbHome'), route: '/' },
            { name: t('breadcrumb'), route: '/properties' },
          ],
          locale
        )}
      />

      <FilterBar locations={locations} resultsCount={total} />

      {/* With no results the grid section is skipped entirely and the page
          drops straight into the off-market CTA below. */}
      {items.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="container-site">
            <PropertyGrid properties={items} />

            {/* Pagination, no infinite scroll (kills footer + SEO) */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-16 flex items-center justify-center gap-3"
              >
                {page > 1 && (
                  <Link
                    href={{ pathname: '/properties', query: pageQuery(page - 1) }}
                    className="border border-navy/20 px-4 py-2 text-sm text-navy transition-colors hover:border-navy"
                  >
                    ← {t('pagination.previous')}
                  </Link>
                )}
                <span className="px-2 text-sm text-muted">
                  {t('pagination.page', { page, total: totalPages })}
                </span>
                {page < totalPages && (
                  <Link
                    href={{ pathname: '/properties', query: pageQuery(page + 1) }}
                    className="border border-navy/20 px-4 py-2 text-sm text-navy transition-colors hover:border-navy"
                  >
                    {t('pagination.next')} →
                  </Link>
                )}
              </nav>
            )}
          </div>
        </section>
      )}

      {/* Bottom CTA — the highest-value lead element on the site.
          id="wishlist" is the anchor the off-market teaser deep-links to;
          scroll-mt clears the sticky navbar. */}
      <section id="wishlist" className={cn('scroll-mt-24 section-pad bg-white')}>
        <FadeUp className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl leading-tight text-navy md:text-[40px]">
              {t('bottomCta.title')}
            </h2>
            <p className="mt-4 text-base text-muted md:text-lg">
              {t('bottomCta.body')}
            </p>
            <div className="mt-10">
              <BuyerWishlistForm />
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
