import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PortableText } from 'next-sanity';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/sections/PageHeader';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { FadeUp } from '@/components/ui/FadeUp';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { ButtonLink } from '@/components/ui/Button';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { GuideCard } from '@/components/ui/GuideCard';
import {
  getGuidesForLocation,
  getLocationBySlug,
  getLocations,
  getProperties,
} from '@sanity-config/lib/queries';
import { imageUrl, VILLAGE_IMAGE } from '@sanity-config/lib/image';
import { pickLocale, pickLocaleBlocks } from '@/lib/utils';
import { buildMetadata, breadcrumbJsonLd, JsonLd } from '@/lib/seo';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';
import { IMAGES } from '@/lib/images';

export const revalidate = 3600;

export async function generateStaticParams() {
  const locations = await getLocations();
  return routing.locales.flatMap((locale) =>
    locations.map((location) => ({ locale, slug: location.slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const location = await getLocationBySlug(slug);
  if (!location) return {};
  const t = await getTranslations({ locale, namespace: 'locations' });
  const name = pickLocale(location.name, locale);
  const photo = location.photos?.[0];
  return buildMetadata({
    locale,
    title: t('metaTitle', { name }),
    description: t('metaDescription', { name }),
    path: `/locations/${slug}`,
    image: photo ? imageUrl(photo, { width: 1200, height: 630 }) : undefined,
  });
}

/**
 * Static village landing page — the real SEO surface for "nekretnine {village}"
 * queries. Content comes from the keystone `location` schema; the filtered
 * properties grid stays one click away for browsing.
 */
export default async function LocationPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(locale);

  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const t = await getTranslations('locations');
  const tProps = await getTranslations('properties');

  const name = pickLocale(location.name, locale);
  const tagline = pickLocale(location.tagline, locale);
  const description = pickLocaleBlocks(location.description, locale);
  const photos = location.photos ?? [];
  const [{ items }, guides] = await Promise.all([
    getProperties({ location: [slug] }),
    getGuidesForLocation(location._id),
  ]);

  // Split the village story down the middle so it reads as two blocks side by
  // side. A single-paragraph description stays in one column rather than
  // leaving an empty second one.
  const descriptionColumns = (() => {
    const blocks = description ?? [];
    if (blocks.length < 2) return blocks.length ? [blocks] : [];
    const mid = Math.ceil(blocks.length / 2);
    return [blocks.slice(0, mid), blocks.slice(mid)];
  })();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tProps('breadcrumbHome'), path: '' },
            { name, path: `/locations/${slug}` },
          ],
          locale
        )}
      />

      <PageHeader
        image={
          photos[0]
            ? imageUrl(photos[0], VILLAGE_IMAGE.banner)
            : IMAGES.bannerProperties
        }
        imageAlt={photos[0]?.alt || t('photoAlt', { name })}
        title={name}
        subtitle={tagline || undefined}
      />

      {/* Village character — the content mass portals can't fake. The old
          60/40 split reserved a photo column that collapsed to dead space on
          villages with no photos, which made the whole block read as an
          afterthought. Text now owns the full width in two editorial columns
          and photos get their own row underneath. */}
      {description && (
        <section className="section-pad bg-white">
          <div className="container-site">
            <FadeUp>
              <SectionHeader title={t('aboutTitle')} />
              <HairlineDivider width="w-[60px]" className="mt-8" />
            </FadeUp>

            <FadeUp delay={100}>
              <div className="mt-12 grid gap-x-16 gap-y-10 md:mt-16 lg:grid-cols-2 lg:gap-x-20">
                {descriptionColumns.map((column, i) => (
                  <div
                    key={i}
                    className="space-y-6 text-base leading-relaxed text-muted md:text-lg"
                  >
                    <PortableText value={column} />
                  </div>
                ))}
              </div>
            </FadeUp>

            {photos.length > 1 && (
              <FadeUp delay={200}>
                <div className="mt-16 grid gap-6 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
                  {photos.slice(1, 4).map((photo, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] overflow-hidden bg-navy/5"
                    >
                      <Image
                        src={imageUrl(photo, { width: 900, height: 675 })}
                        alt={photo.alt || t('photoAlt', { name })}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* Listings in this village */}
      <section className="section-pad bg-white">
        <div className="container-site">
          {items.length > 0 ? (
            <>
              <FadeUp>
                <div className="flex items-end justify-between gap-6">
                  <h2 className="font-display text-3xl text-navy md:text-[40px]">
                    {t('propertiesTitle')}
                  </h2>
                  <Link
                    href={{ pathname: '/properties', query: { location: slug } }}
                    className="whitespace-nowrap pb-1 text-sm font-medium text-gold transition-colors hover:text-navy"
                  >
                    {t('viewFiltered')} →
                  </Link>
                </div>
              </FadeUp>
              <div className="mt-12">
                <PropertyGrid properties={items} />
              </div>
            </>
          ) : (
            <FadeUp>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-display text-3xl leading-tight text-navy md:text-[40px]">
                  {t('emptyTitle', { name })}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
                  {t('emptyBody', { name })}
                </p>
                <ButtonLink href="/contact" variant="ghost-navy" className="mt-8">
                  {t('emptyCta')}
                </ButtonLink>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* Village -> guides. A village page answers "what is for sale here";
          the guides answer "how does buying here actually work". Linking them
          keeps a visitor moving through the site instead of leaving to search
          the process elsewhere, and it passes authority down to the guides. */}
      {guides.length > 0 && (
        <section className="section-pad bg-white pt-0">
          <div className="container-site">
            <FadeUp>
              <div className="max-w-2xl">
                <HairlineDivider width="w-[60px]" />
                <h2 className="mt-8 font-display text-2xl leading-tight text-navy md:text-3xl">
                  {t('guidesTitle', { name })}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                  {t('guidesIntro')}
                </p>
              </div>
            </FadeUp>
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              {guides.map((guide, i) => (
                <FadeUp key={guide._id} as="li" delay={i * 80} className="h-full">
                  <GuideCard guide={guide} locale={locale} />
                </FadeUp>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
