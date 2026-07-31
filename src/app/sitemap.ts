import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getLocations, getPropertySlugs } from '@sanity-config/lib/queries';
import { SITE_URL } from '@/lib/seo';

const STATIC_PATHS = ['', '/properties', '/buying', '/selling', '/contact'];

/**
 * All pages × locales + all property slugs + village landing pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, locations] = await Promise.all([
    getPropertySlugs(),
    getLocations(),
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

  return entries;
}
