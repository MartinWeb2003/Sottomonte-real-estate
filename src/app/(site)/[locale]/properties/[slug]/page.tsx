import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PortableText } from 'next-sanity';
import { Link } from '@/i18n/routing';
import { Gallery } from '@/components/property/Gallery';
import { StickyInquiryBar } from '@/components/property/StickyInquiryBar';
import { SpecGrid } from '@/components/property/SpecGrid';
import { PapersStatus } from '@/components/property/PapersStatus';
import { InquiryCard } from '@/components/property/InquiryCard';
import { SimilarProperties } from '@/components/property/SimilarProperties';
import { PropertyMap } from '@/components/map/PropertyMap';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import {
  getFirstTeamMember,
  getPropertyBySlug,
  getPropertySlugs,
  getSimilarProperties,
} from '@sanity-config/lib/queries';
import { imageUrl } from '@sanity-config/lib/image';
import { formatArea, formatPrice, formatPricePerM2 } from '@/lib/formatters';
import { pickLocale, pickLocaleBlocks } from '@/lib/utils';
import {
  buildMetadata,
  breadcrumbJsonLd,
  JsonLd,
  propertyJsonLd,
  SITE_URL,
} from '@/lib/seo';
import {
  propertyImageAlt,
  propertyMetaDescription,
  propertyMetaTitle,
} from '@/lib/propertyText';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPropertySlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  const t = await getTranslations({ locale });
  const cover = property.gallery?.[0];
  return buildMetadata({
    locale,
    title: propertyMetaTitle(t, property, locale),
    description: propertyMetaDescription(t, property, locale),
    route: '/properties/[slug]',
    params: { slug },
    image: cover ? imageUrl(cover, { width: 1200, height: 630 }) : undefined,
  });
}

export default async function PropertyDetailPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(locale);

  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const t = await getTranslations('property');
  const tProps = await getTranslations('properties');
  // Root translator: the SEO/alt builders use fully qualified keys so the same
  // helpers work here and inside components.
  const tRoot = await getTranslations({ locale });

  const [agent, similar] = await Promise.all([
    getFirstTeamMember(),
    getSimilarProperties(slug, property.location?.slug ?? null, property.type),
  ]);

  const title = pickLocale(property.title, locale);
  const locationName = pickLocale(property.location?.name, locale);
  const description = pickLocaleBlocks(property.description, locale);
  const locationDescription = pickLocaleBlocks(
    property.location?.description,
    locale
  );

  const priceLabel =
    property.priceOnRequest || !property.price
      ? t('priceOnRequest')
      : formatPrice(property.price);
  const perM2 =
    !property.priceOnRequest && property.price && property.area
      ? formatPricePerM2(property.price, property.area)
      : null;

  const areaLine = [
    property.area ? formatArea(property.area) : null,
    property.landArea
      ? `${t('specs.landArea').toLowerCase()} ${formatArea(property.landArea)}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  // Absolute image URLs for the structured data. `imageUrl` falls back to a
  // site-relative placeholder when a document has no photo yet, and a relative
  // URL is invalid in JSON-LD, so those are dropped rather than emitted.
  const schemaImages = (property.gallery ?? [])
    .slice(0, 6)
    .map((image) => imageUrl(image, { width: 1200, height: 800 }))
    .filter((url) => url.startsWith('http'));

  return (
    <>
      <JsonLd
        data={propertyJsonLd({
          property,
          locale,
          title,
          description: propertyMetaDescription(tRoot, property, locale),
          images: schemaImages,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tProps('breadcrumbHome'), route: '/' },
            { name: tProps('breadcrumb'), route: '/properties' },
            { name: title, route: '/properties/[slug]', params: { slug } },
          ],
          locale
        )}
      />

      <StickyInquiryBar title={title} priceLabel={priceLabel} />

      <Gallery
        images={property.gallery ?? []}
        title={title}
        altBase={propertyImageAlt(tRoot, property, locale)}
        droneVideoUrl={property.droneVideoUrl}
      />

      {/* Title row */}
      <section className="container-site pt-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-eyebrow text-gold">
              {locationName} · PELJEŠAC
            </p>
            <h1 className="mt-3 font-display text-3xl leading-tight text-navy md:text-5xl">
              {title}
            </h1>
            {areaLine && <p className="mt-3 text-sm text-muted">{areaLine}</p>}
          </div>
          <div className="md:text-right">
            <p className="font-display text-3xl font-semibold text-navy md:text-4xl">
              {priceLabel}
            </p>
            {perM2 && (
              <p className="mt-1 text-sm text-muted">
                {t('perM2', { price: perM2 })}
              </p>
            )}
            {property.status === 'reserved' && (
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-navy-soft">
                {t('status.reserved')}
              </p>
            )}
          </div>
        </div>
        <HairlineDivider className="mt-10" />
      </section>

      {/* Content split 65/35 */}
      <section className="container-site grid gap-14 py-14 lg:grid-cols-[65fr_35fr] lg:gap-20">
        <div className="min-w-0 space-y-14">
          <SpecGrid property={property} />

          {description && (
            <div>
              <h2 className="font-display text-2xl text-navy">
                {t('aboutProperty')}
              </h2>
              <div className="prose-sottomonte mt-4 space-y-4 text-sm leading-relaxed text-muted md:text-base">
                <PortableText value={description} />
              </div>
            </div>
          )}

          {/* Signature "About the location" block */}
          {property.location && locationDescription && (
            <div className="border-l-2 border-gold bg-white p-8 md:p-10">
              <p className="text-xs font-medium uppercase tracking-eyebrow text-gold">
                {locationName}
              </p>
              <h2 className="mt-2 font-display text-2xl text-navy">
                {t('aboutLocation')}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted md:text-base">
                <PortableText value={locationDescription} />
              </div>
              {/*
                Listing -> village page. This block described the village and
                then dead-ended, which left the village pages with no inbound
                links from the listings that give them their reason to exist.
                The anchor names the destination ("all properties in Orebić")
                rather than saying "read more", because the anchor text is a
                large part of what the link is worth.
              */}
              <Link
                href={{
                  pathname: '/locations/[slug]',
                  params: { slug: property.location.slug },
                }}
                className="mt-6 inline-block text-sm font-medium text-gold transition-colors hover:text-navy"
              >
                {t('viewAllInLocation', { name: locationName })} →
              </Link>
            </div>
          )}

          <PapersStatus property={property} />
        </div>

        <div id="inquiry" className="lg:sticky lg:top-28 lg:self-start">
          <InquiryCard
            agent={agent}
            propertyTitle={title}
            propertyUrl={`${SITE_URL}/${locale}/properties/${slug}`}
          />
        </div>
      </section>

      {/* Map */}
      {property.coordinates && (
        <PropertyMap
          lat={property.coordinates.lat}
          lng={property.coordinates.lng}
          exact={Boolean(property.exactLocationPublic)}
        />
      )}

      <SimilarProperties properties={similar} />
      <FinalCTA />
    </>
  );
}
