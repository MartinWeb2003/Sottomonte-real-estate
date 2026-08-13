import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { HairlineDivider } from '@/components/ui/HairlineDivider';

/**
 * The 404 inside a locale: a sold listing whose slug is still linked, a guide
 * that never existed, or anything under a locale prefix matching no route at
 * all (the sibling `[...rest]` catch-all routes those here).
 *
 * It offers four routes rather than only the homepage, so a visitor one
 * character away from a real listing is not sent back to the start.
 *
 * Known limitation, verified against a production build and not just dev:
 * Next 14 streams this boundary as flight data, so the initial HTML body is
 * empty and the page appears on hydration. That is true of any not-found here,
 * with or without next-intl, and is not something this file can fix. It costs
 * little in practice, since the response still carries a correct 404 status
 * and a 404 is never indexed, but do not read the empty server HTML as a bug
 * introduced by the content below.
 */
const ROUTES = ['/properties', '/guides', '/buying', '/contact'] as const;

export default async function NotFound() {
  const t = await getTranslations('nav');
  const tNotFound = await getTranslations('notFound');

  return (
    <section className="flex min-h-[70vh] items-center bg-white pt-20">
      <div className="container-site py-20">
        <div className="mx-auto max-w-xl">
          <p className="font-display text-7xl text-gold">404</p>
          <HairlineDivider width="w-[60px]" className="mt-8" />

          <h1 className="mt-8 font-display text-3xl text-navy">
            {tNotFound('title')}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {tNotFound('body')}
          </p>

          <ul className="mt-10 border-t border-navy/10">
            {ROUTES.map((route) => (
              <li key={route} className="border-b border-navy/10">
                <Link
                  href={route}
                  className="block py-4 text-base font-medium text-navy transition-colors hover:text-navy-soft"
                >
                  {t(route.slice(1) as 'properties' | 'guides' | 'buying' | 'contact')}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="mt-10 inline-block text-sm font-medium text-navy underline decoration-gold underline-offset-8 transition-colors hover:text-navy-soft"
          >
            {t('home')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
