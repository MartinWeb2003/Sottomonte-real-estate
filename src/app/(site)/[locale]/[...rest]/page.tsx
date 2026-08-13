import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/types';

/**
 * Catch-all that renders the locale's 404.
 *
 * Without it, a URL like /hr/nekakva-stranica matches no route in this
 * segment, so Next falls back to its own built-in 404: a bare page with no
 * layout, no navigation and no links out. The middleware prefixes every
 * unmatched path with the default locale before it 404s, so that built-in page
 * was where all crawl noise and every stale inbound link ended up.
 *
 * Calling notFound() here keeps the 404 status but renders
 * `(site)/[locale]/not-found.tsx` inside the locale layout, which brings the
 * navbar and footer with it.
 *
 * Catch-alls are the lowest-priority match in the App Router, so this cannot
 * shadow a real route.
 */

// Nothing to prerender: every path this matches is by definition a 404.
export function generateStaticParams() {
  return [];
}

export default function CatchAllNotFound({
  params: { locale },
}: {
  params: { locale: Locale; rest: string[] };
}) {
  setRequestLocale(locale);
  notFound();
}
