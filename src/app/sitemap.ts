import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getGuides, getLocations, getPropertySlugs } from '@sanity-config/lib/queries';
import { SITE_URL } from '@/lib/seo';

const STATIC_PATHS = [
  '',
  '/properties',
  '/buying',
  '/selling',
  '/guides',
  '/contact',
];

/**
 * All pages × locales + all property slugs + village landing pages + guides.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, locations, guides] = await Promise.all([
    getPropertySlugs(),
    getLocations(),
    getGuides(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  const alternatesFor = (path: string) => ({
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
    ),
  });

  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: path === '/properties' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.8,
        alternates: alternatesFor(path),
      });
    }
  }

  for (const slug of slugs) {
    const path = `/properties/${slug}`;
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: alternatesFor(path),
      });
    }
  }

  // Village landing pages — the per-village SEO surface
  for (const location of locations) {
    const path = `/locations/${location.slug}`;
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: alternatesFor(path),
      });
    }
  }

  // Guides carry a real lastModified: they are the one content type that is
  // deliberately revised over time, and a truthful date is what makes a
  // recrawl worth triggering.
  for (const guide of guides) {
    const path = `/guides/${guide.slug}`;
    const lastModified = guide.updatedAt || guide.publishedAt;
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: alternatesFor(path),
      });
    }
  }

  return entries;
}
