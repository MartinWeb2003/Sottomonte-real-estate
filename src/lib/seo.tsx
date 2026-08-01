import type { Metadata } from 'next';
import type { Locale, Property } from '@/types';
import { pickLocale, AGENCY } from './utils';
import { IMAGES } from './images';
import { routing } from '@/i18n/routing';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Per-page metadata with hreflang alternates for hr/en/de.
 * `path` is the locale-less pathname, e.g. "/properties".
 */
export function buildMetadata({
  locale,
  title,
  description,
  path,
  image,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    // x-default: search-engine fallback for users outside hr/en/de
    ['x-default', `${SITE_URL}/${routing.defaultLocale}${path}`],
  ]);

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      siteName: 'Sottomonte',
      locale,
      type: 'website',
      images: [image || `${SITE_URL}${IMAGES.ogImage}`],
    },
  };
}

/* -------------------------------- JSON-LD -------------------------------- */

export function realEstateAgentJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: AGENCY.name,
    url: SITE_URL,
    telephone: AGENCY.phone,
    email: AGENCY.email,
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
    areaServed: 'Pelješac peninsula, Croatia',
    knowsLanguage: ['hr', 'en', 'de'],
  };
}

export function realEstateListingJsonLd(property: Property, locale: Locale) {
  const title = pickLocale(property.title, locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    url: `${SITE_URL}/${locale}/properties/${property.slug}`,
    ...(property.price && !property.priceOnRequest
      ? {
          offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'EUR',
          },
        }
      : {}),
    ...(property.area ? { floorSize: { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' } } : {}),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  locale: Locale
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
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
