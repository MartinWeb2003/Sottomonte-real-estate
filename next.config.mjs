import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  /**
   * The previous version of this site had an About page that Google has
   * indexed. This build deleted that route, so those URLs started returning
   * 404 while still appearing in search results. A 301 to the homepage passes
   * the accumulated link equity on instead of throwing it away, and gives
   * anyone arriving from a stale result somewhere useful to land.
   *
   * Both the English and Croatian slugs are covered because the old URL shape
   * is not fully known from the search snippet. Redirecting a path that never
   * existed is harmless.
   */
  /**
   * Keep every host that is not the real domain out of the index.
   *
   * Vercel serves each deployment on a *.vercel.app hostname as well as on the
   * custom domain, so sottomonte-real-estate.vercel.app currently answers 200
   * for the entire site. That is a complete second copy of every page. The
   * canonical tags on it already point back at www.sottomonte.hr, because
   * lib/seo.tsx builds them from NEXT_PUBLIC_SITE_URL rather than from the
   * request host, but a canonical is a hint and Google is free to ignore it.
   * The header is a directive, so it settles the question.
   *
   * Scoped by host rather than by "not the canonical host": the apex
   * sottomonte.hr 308s to www before serving HTML, and tagging a redirect
   * response as noindex is a needless risk.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '.*\\.vercel\\.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      /**
       * The Studio is disallowed in robots.txt, which stops crawling but not
       * indexing: a disallowed URL can still be listed from links alone. A
       * meta tag would never be read, since the crawl is what is blocked, so
       * the directive has to travel in the response header.
       */
      {
        source: '/studio/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/studio',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },

  async redirects() {
    const gone = ['about', 'o-nama'];
    const removed = gone.flatMap((slug) => [
      // Locale-prefixed, e.g. /hr/about -> /hr
      {
        source: `/:locale(hr|en|de|pl)/${slug}`,
        destination: '/:locale',
        permanent: true,
      },
      // Unprefixed, e.g. /about -> /hr (the default locale)
      {
        source: `/${slug}`,
        destination: '/hr',
        permanent: true,
      },
    ]);

    /**
     * Croatian and German URL segments were localised (/hr/properties became
     * /hr/nekretnine, /de/properties became /de/immobilien). Those old URLs are
     * already indexed and linked, so every one of them gets a 301 rather than a
     * 404. Changing URLs without redirects is the fastest way to lose positions
     * built over months.
     *
     * English is absent on purpose: its segments did not change, so there is
     * nothing to redirect and adding rules would only create loops.
     */
    const localised = [
      ['hr', 'properties', 'nekretnine'],
      ['hr', 'locations', 'lokacije'],
      ['hr', 'guides', 'vodici'],
      ['hr', 'buying', 'kupnja-nekretnine'],
      ['hr', 'selling', 'prodaja-nekretnine'],
      ['hr', 'contact', 'kontakt'],
      ['de', 'contact', 'kontakt'],
      ['hr', 'privacy', 'privatnost'],
      ['de', 'properties', 'immobilien'],
      ['de', 'locations', 'orte'],
      ['de', 'guides', 'ratgeber'],
      ['de', 'buying', 'immobilie-kaufen'],
      ['de', 'selling', 'immobilie-verkaufen'],
      ['de', 'privacy', 'datenschutz'],
      // Polish is new and has no indexed URLs, so these are not strictly
      // redirects of anything. They are here so a hand-typed English-shaped
      // Polish URL still resolves instead of 404ing.
      ['pl', 'properties', 'nieruchomosci'],
      ['pl', 'locations', 'miejscowosci'],
      ['pl', 'contact', 'kontakt'],
      ['pl', 'guides', 'poradniki'],
      ['pl', 'buying', 'kupno-nieruchomosci'],
      ['pl', 'selling', 'sprzedaz-nieruchomosci'],
      ['pl', 'privacy', 'prywatnosc'],
    ].flatMap(([locale, from, to]) => [
      // The section index, e.g. /hr/properties -> /hr/nekretnine
      {
        source: `/${locale}/${from}`,
        destination: `/${locale}/${to}`,
        permanent: true,
      },
      // Anything beneath it, e.g. /de/guides/x -> /de/ratgeber/x. Harmless for
      // sections that have no child routes.
      {
        source: `/${locale}/${from}/:path*`,
        destination: `/${locale}/${to}/:path*`,
        permanent: true,
      },
    ]);

    return [...removed, ...localised];
  },
};

export default withNextIntl(nextConfig);
