import type { MetadataRoute } from 'next';
import { routing, localeUrl, type AppPathname, type Locale } from '@/i18n/routing';
import {
  getGuides,
  getLocationSitemapEntries,
  getPropertySitemapEntries,
} from '@sanity-config/lib/queries';
import { SITE_URL } from '@/lib/seo';

const STATIC_ROUTES: AppPathname[] = [
  '/',
  '/properties',
  '/buying',
  '/selling',
  '/guides',
  '/contact',
];

/**
 * All pages × locales + all property slugs + village landing pages + guides.
 *
 * Every URL is produced by `localeUrl`, the same helper the canonical tags and
 * the Link components use, so a sitemap entry can never disagree with the page
 * it points at. Emitting `/de/properties` here while the page actually lives at
 * `/de/immobilien` would put a redirect chain in front of every German URL
 * Google crawls.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, locations, guides] = await Promise.all([
    getPropertySitemapEntries(),
    getLocationSitemapEntries(),
    getGuides(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  const alternatesFor = (route: AppPathname, params?: Record<string, string>) => ({
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, localeUrl(SITE_URL, l as Locale, route, params)])
    ),
  });

  const push = (
    route: AppPathname,
    opts: {
      params?: Record<string, string>;
      changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
      priority: number;
      lastModified?: string;
    }
  ) => {
    for (const locale of routing.locales) {
      entries.push({
        url: localeUrl(SITE_URL, locale as Locale, route, opts.params),
        ...(opts.lastModified ? { lastModified: new Date(opts.lastModified) } : {}),
        changeFrequency: opts.changeFrequency,
        priority: opts.priority,
        alternates: alternatesFor(route, opts.params),
      });
    }
  };

  for (const route of STATIC_ROUTES) {
    push(route, {
      changeFrequency: route === '/properties' ? 'daily' : 'weekly',
      priority: route === '/' ? 1 : 0.8,
    });
  }

  // Listings and villages carry a real lastModified for the same reason guides
  // do: it is the only field here Google actually acts on, and without it a
  // price change or a sale went unnoticed until the next scheduled crawl.
  for (const property of properties) {
    push('/properties/[slug]', {
      params: { slug: property.slug },
      changeFrequency: 'weekly',
      priority: 0.9,
      lastModified: property._updatedAt,
    });
  }

  // Village landing pages — the per-village SEO surface. A village page shows
  // its own copy and the listings in it, so the later of the two dates is the
  // truthful one.
  for (const location of locations) {
    const dates = [location._updatedAt, location.propertiesUpdatedAt].filter(
      Boolean
    ) as string[];
    const lastModified = dates.sort().at(-1);
    push('/locations/[slug]', {
      params: { slug: location.slug },
      changeFrequency: 'weekly',
      priority: 0.7,
      lastModified,
    });
  }

  // Guides carry a real lastModified: they are the one content type that is
  // deliberately revised over time, and a truthful date is what makes a
  // recrawl worth triggering.
  for (const guide of guides) {
    push('/guides/[slug]', {
      params: { slug: guide.slug },
      changeFrequency: 'monthly',
      priority: 0.7,
      lastModified: guide.updatedAt || guide.publishedAt,
    });
  }

  return entries;
}
