import type { MetadataRoute } from 'next';
import { routing, localeUrl, type AppPathname, type Locale } from '@/i18n/routing';
import {
  getGuideSitemapEntries,
  getLocationSitemapEntries,
  getPropertySitemapEntries,
} from '@sanity-config/lib/queries';
import { SITE_URL } from '@/lib/seo';
import type { LocaleCoverage } from '@/types';

const STATIC_ROUTES: AppPathname[] = [
  '/',
  '/properties',
  '/buying',
  '/selling',
  '/guides',
  '/faq',
  '/market',
  '/contact',
  '/press',
  '/privacy',
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
    getGuideSitemapEntries(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  /**
   * Which locales a document is submitted in.
   *
   * A sitemap is a set of claims about pages worth indexing, and hreflang
   * inside it is a claim that those pages are translations of each other.
   * Every CMS-backed page is statically generated in all four locales, but a
   * property whose description exists only in Croatian renders that same
   * Croatian text under /de/immobilien/... Submitting it as the German version
   * asks Google to index four near-identical pages per listing, which is how a
   * site ends up competing with itself.
   *
   * Uncovered locales are therefore left out of the sitemap entirely and go
   * `noindex, follow` on the page (see lib/i18nCoverage). The pages stay live
   * and linked; they just stop being offered as search results. Documents with
   * no coverage information fall back to all locales, matching the fail-open
   * behaviour on the page side.
   */
  const coveredLocales = (coverage?: LocaleCoverage): Locale[] => {
    const covered = routing.locales.filter(
      (l) => coverage?.[l as Locale]
    ) as Locale[];
    return covered.length ? covered : (routing.locales as readonly Locale[]).slice();
  };

  const alternatesFor = (
    route: AppPathname,
    params: Record<string, string> | undefined,
    locales: readonly Locale[]
  ) => ({
    languages: Object.fromEntries(
      locales.map((l) => [l, localeUrl(SITE_URL, l, route, params)])
    ),
  });

  const push = (
    route: AppPathname,
    opts: {
      params?: Record<string, string>;
      changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
      priority: number;
      lastModified?: string;
      /** Defaults to all four: static pages are fully translated by definition,
          since their copy lives in the message files. */
      locales?: readonly Locale[];
    }
  ) => {
    const locales = opts.locales ?? (routing.locales as readonly Locale[]);
    for (const locale of locales) {
      entries.push({
        url: localeUrl(SITE_URL, locale, route, opts.params),
        ...(opts.lastModified ? { lastModified: new Date(opts.lastModified) } : {}),
        changeFrequency: opts.changeFrequency,
        priority: opts.priority,
        alternates: alternatesFor(route, opts.params, locales),
      });
    }
  };

  for (const route of STATIC_ROUTES) {
    push(route, {
      // Privacy is a legal page rather than a ranking target: indexed, but
      // at the lowest priority of the static set.
      // The market table recomputes whenever a listing changes, so it is as
      // volatile as the grid itself. Press is near static.
      changeFrequency:
        route === '/properties' || route === '/market'
          ? 'daily'
          : route === '/privacy' || route === '/press'
            ? 'yearly'
            : 'weekly',
      priority:
        route === '/'
          ? 1
          : route === '/privacy'
            ? 0.2
            : route === '/press'
              ? 0.4
              : 0.8,
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
      locales: coveredLocales(property.coverage),
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
      locales: coveredLocales(location.coverage),
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
      lastModified: guide._updatedAt,
      locales: coveredLocales(guide.coverage),
    });
  }

  return entries;
}
