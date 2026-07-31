import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip internals, static files and the embedded Sanity Studio
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
};
