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
  async redirects() {
    const gone = ['about', 'o-nama'];
    return gone.flatMap((slug) => [
      // Locale-prefixed, e.g. /hr/about -> /hr
      {
        source: `/:locale(hr|en|de)/${slug}`,
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
  },
};

export default withNextIntl(nextConfig);
