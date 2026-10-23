import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  /**
   * Skip internals, static files, the embedded Sanity Studio and the RSS feeds.
   *
   * `feed` has to be named explicitly: those paths carry no file extension, so
   * the `.*\..*` clause does not catch them, and next-intl would otherwise read
   * /feed/de as a locale-less page and redirect it to /hr/feed/de.
   */
  matcher: ['/((?!api|studio|feed|_next|_vercel|.*\\..*).*)'],
};
