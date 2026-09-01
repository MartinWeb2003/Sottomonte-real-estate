import type { Metadata } from 'next';
import type { Guide, Locale, Location, Property } from '@/types';
import { pickLocale, AGENCY } from './utils';
import { IMAGES, LOGOS } from './images';
import { routing, localeUrl, type AppPathname } from '@/i18n/routing';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Stable @id anchors. Every graph node that talks about the agency or the site
 * points at these instead of repeating the entity, which is what lets Google
 * (and the AI crawlers) reconcile the homepage, a listing page and a guide as
 * statements about one business rather than three unrelated ones.
 */
const AGENCY_ID = `${SITE_URL}/#agency`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const abs = (path: string) => `${SITE_URL}${path}`;

/**
 * Per-page metadata with hreflang alternates for hr/en/de/pl.
 * `path` is the locale-less pathname, e.g. "/properties".
 */
export function buildMetadata({
  locale,
  title,
  description,
  route,
  params,
  image,
}: {
  locale: Locale;
  title: string;
  description: string;
  /** Internal route name, e.g. '/properties/[slug]'. Not a literal URL. */
  route: AppPathname;
  /** Dynamic segment values for routes that take them. */
  params?: Record<string, string>;
  image?: string;
}): Metadata {
  // Each locale gets its own localised URL. Building these from one literal
  // path, as this used to, would have pointed every hreflang at the Croatian
  // URL shape and told Google the German page lives at /de/properties when it
  // actually lives at /de/immobilien.
  const url = (l: Locale) => localeUrl(SITE_URL, l, route, params);

  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, url(l)]),
    // x-default: search-engine fallback for users outside hr/en/de/pl
    ['x-default', url(routing.defaultLocale)],
  ]);

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url(locale),
      languages,
    },
    openGraph: {
      title,
      description,
      url: url(locale),
      siteName: 'Sottomonte',
      locale,
      type: 'website',
      images: [image || `${SITE_URL}${IMAGES.ogImage}`],
    },
  };
}

/* -------------------------------- JSON-LD -------------------------------- */

/**
 * The agency node, and the only place the business entity is described.
 *
 * `RealEstateAgent` already inherits from `LocalBusiness` and `Organization`,
 * so this single node carries the Organization properties the SEO guide asks
 * for (name, url, logo, contactPoint, sameAs) rather than emitting a second
 * Organization node. Two nodes describing one business is a common way to
 * confuse entity resolution, not a way to strengthen it.
 *
 * `areaServed` is built from the real village documents so it stays in step
 * with the villages the site actually has pages for.
 */
function agencyNode(locations: Location[], locale: Locale) {
  const villages = locations
    .map((location) => pickLocale(location.name, locale))
    .filter(Boolean);

  return {
    '@type': 'RealEstateAgent',
    '@id': AGENCY_ID,
    name: AGENCY.name,
    url: SITE_URL,
    logo: abs(LOGOS.full.src),
    image: abs(IMAGES.ogImage),
    email: AGENCY.email,
    // Only emitted once a real number exists — see AGENCY.phone.
    ...(AGENCY.phone ? { telephone: AGENCY.phone } : {}),
    priceRange: AGENCY.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: AGENCY.street,
      addressLocality: AGENCY.city,
      postalCode: AGENCY.postalCode,
      addressCountry: 'HR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: AGENCY.coordinates.lat,
      longitude: AGENCY.coordinates.lng,
    },
    areaServed: [
      { '@type': 'Place', name: 'Pelješac' },
      ...villages.map((name) => ({ '@type': 'Place', name })),
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: AGENCY.email,
      ...(AGENCY.phone ? { telephone: AGENCY.phone } : {}),
      availableLanguage: ['hr', 'en', 'de', 'pl'],
    },
    sameAs: [AGENCY.instagram, AGENCY.facebook],
    knowsLanguage: ['hr', 'en', 'de', 'pl'],
  };
}

/**
 * Sitewide graph, rendered once in the locale layout: the agency plus the
 * WebSite node that names it as publisher.
 *
 * No `potentialAction`/SearchAction here on purpose. It is only valid if the
 * site exposes a URL template that runs a real text search, and the properties
 * page filters on fixed params (location/type/price) with no free-text query.
 * Declaring a search endpoint that ignores its own input is broken markup, so
 * this waits for an actual search feature.
 */
export function siteJsonLd(locations: Location[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      agencyNode(locations, locale),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: AGENCY.name,
        inLanguage: locale,
        publisher: { '@id': AGENCY_ID },
      },
    ],
  };
}

/**
 * Property page graph.
 *
 * `RealEstateListing` describes the page; the `Product` + `Offer` pair carries
 * price and availability, which is the part that can actually earn a rich
 * result. They are linked rather than duplicated: the listing's `mainEntity`
 * points at the product's @id.
 *
 * A property with no price (or `priceOnRequest`) emits no Offer at all. An
 * Offer needs a price to mean anything, and inventing one — 0, or the phrase
 * "on request" in a numeric field — is an invalid-markup penalty waiting to
 * happen.
 */
export function propertyJsonLd({
  property,
  locale,
  title,
  description,
  images,
}: {
  property: Property;
  locale: Locale;
  title: string;
  description: string;
  images: string[];
}) {
  const url = localeUrl(SITE_URL, locale, '/properties/[slug]', { slug: property.slug });
  const productId = `${url}#product`;
  const locationName = pickLocale(property.location?.name, locale);

  const availability =
    property.status === 'sold'
      ? 'https://schema.org/SoldOut'
      : property.status === 'reserved'
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/InStock';

  const hasPrice = Boolean(property.price) && !property.priceOnRequest;

  /** Numeric specs, as machine-readable properties rather than prose. */
  const specs: Array<{ name: string; value: number; unitCode?: string }> = [];
  if (property.area) specs.push({ name: 'floorSize', value: property.area, unitCode: 'MTK' });
  if (property.landArea) specs.push({ name: 'lotSize', value: property.landArea, unitCode: 'MTK' });
  if (property.seaDistance != null)
    specs.push({ name: 'distanceToSea', value: property.seaDistance, unitCode: 'MTR' });

  const graph: object[] = [
    {
      '@type': 'Product',
      '@id': productId,
      name: title,
      description,
      ...(images.length ? { image: images } : {}),
      category: property.type,
      sku: property.slug,
      ...(hasPrice
        ? {
            offers: {
              '@type': 'Offer',
              price: property.price,
              priceCurrency: 'EUR',
              availability,
              url,
              seller: { '@id': AGENCY_ID },
            },
          }
        : {}),
      additionalProperty: specs.map((spec) => ({
        '@type': 'PropertyValue',
        name: spec.name,
        value: spec.value,
        unitCode: spec.unitCode,
      })),
    },
    {
      '@type': 'RealEstateListing',
      '@id': `${url}#listing`,
      url,
      name: title,
      description,
      inLanguage: locale,
      datePosted: property._createdAt,
      mainEntity: { '@id': productId },
      provider: { '@id': AGENCY_ID },
      ...(property.area
        ? { floorSize: { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' } }
        : {}),
      ...(property.bedrooms ? { numberOfRooms: property.bedrooms } : {}),
      ...(locationName
        ? {
            containedInPlace: {
              '@type': 'Place',
              name: locationName,
              address: {
                '@type': 'PostalAddress',
                addressLocality: locationName,
                addressRegion: 'Pelješac',
                addressCountry: 'HR',
              },
            },
          }
        : {}),
    },
  ];

  // Drone footage is a first-party "we were actually there" signal and opens
  // video results, but only if it is declared. `uploadDate` is required.
  if (property.droneVideoUrl) {
    graph.push({
      '@type': 'VideoObject',
      name: title,
      description,
      contentUrl: property.droneVideoUrl,
      ...(images[0] ? { thumbnailUrl: [images[0]] } : {}),
      uploadDate: property._createdAt,
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/**
 * Article markup for a guide, with the author as a linked Person.
 *
 * `dateModified` matters as much as `datePublished` here: freshness is a
 * ranking signal, and updating an existing guide beats publishing a second one
 * on the same topic (which just cannibalises the first).
 */
export function guideJsonLd({
  guide,
  locale,
  title,
  description,
  image,
  authorName,
  authorRole,
}: {
  guide: Guide;
  locale: Locale;
  title: string;
  description: string;
  image?: string;
  authorName?: string;
  authorRole?: string;
}) {
  const url = localeUrl(SITE_URL, locale, '/guides/[slug]', { slug: guide.slug });

  const author = authorName
    ? {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person-${encodeURIComponent(authorName.toLowerCase().replace(/\s+/g, '-'))}`,
        name: authorName,
        ...(authorRole ? { jobTitle: authorRole } : {}),
        worksFor: { '@id': AGENCY_ID },
      }
    : { '@id': AGENCY_ID };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description,
    ...(image ? { image: [image] } : {}),
    inLanguage: locale,
    ...(guide.publishedAt ? { datePublished: guide.publishedAt } : {}),
    dateModified: guide.updatedAt || guide.publishedAt,
    author,
    publisher: { '@id': AGENCY_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; route: AppPathname; params?: Record<string, string> }>,
  locale: Locale
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: localeUrl(SITE_URL, locale, item.route, item.params),
    })),
  };
}

/**
 * ItemList for a collection page: the properties grid, and the village pages
 * that show a subset of it.
 *
 * The grid previously emitted only a BreadcrumbList and the sitewide agency
 * graph, so nothing told a crawler the page was a list or what was on it,
 * while every individual listing underneath it was richly described. Each
 * entry is a `url` rather than an inlined Product: the detail page already
 * carries the full description, and repeating it here would state the same
 * facts twice in two places that can drift apart.
 *
 * Positions are 1-based and follow the rendered order, which is what the
 * property expects. Paginated pages therefore describe the page being viewed,
 * not the whole collection.
 */
export function propertyListJsonLd(
  properties: Property[],
  locale: Locale,
  name: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: properties.length,
    itemListElement: properties.map((property, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: localeUrl(SITE_URL, locale, '/properties/[slug]', { slug: property.slug }),
    })),
  };
}

/**
 * FAQPage rich-result markup. Google requires the structured data to match
 * the visible questions, so always build this from the same translated
 * array the FaqSection renders.
 */
export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
