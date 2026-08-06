import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Localised URL segments.
 *
 * The keys are the internal route names used everywhere in the code; the values
 * are what a visitor actually sees per locale. `/hr/nekretnine` and
 * `/de/immobilien` carry the keyword in the language the searcher typed, which
 * an English path in a German URL cannot.
 *
 * English deliberately keeps its existing segments, so no English URL changes
 * and no English redirect is needed.
 *
 * IMPORTANT: every path here is a published URL. Changing one after launch
 * requires a 301 in next.config.mjs, exactly like the Croatian and German
 * segments introduced alongside this map. Do not edit casually.
 */
export const pathnames = {
  '/': '/',
  '/properties': {
    hr: '/nekretnine',
    en: '/properties',
    de: '/immobilien',
    pl: '/nieruchomosci',
  },
  '/properties/[slug]': {
    hr: '/nekretnine/[slug]',
    en: '/properties/[slug]',
    de: '/immobilien/[slug]',
    pl: '/nieruchomosci/[slug]',
  },
  '/locations/[slug]': {
    hr: '/lokacije/[slug]',
    en: '/locations/[slug]',
    de: '/orte/[slug]',
    pl: '/miejscowosci/[slug]',
  },
  '/guides': {
    hr: '/vodici',
    en: '/guides',
    de: '/ratgeber',
    pl: '/poradniki',
  },
  '/guides/[slug]': {
    hr: '/vodici/[slug]',
    en: '/guides/[slug]',
    de: '/ratgeber/[slug]',
    pl: '/poradniki/[slug]',
  },
  // The buying and selling pages carry the money keywords, so these segments
  // are the phrase rather than the single word: "kupnja nekretnine", not
  // "kupnja".
  '/buying': {
    hr: '/kupnja-nekretnine',
    en: '/buying',
    de: '/immobilie-kaufen',
    pl: '/kupno-nieruchomosci',
  },
  '/selling': {
    hr: '/prodaja-nekretnine',
    en: '/selling',
    de: '/immobilie-verkaufen',
    pl: '/sprzedaz-nieruchomosci',
  },
  '/contact': {
    hr: '/kontakt',
    en: '/contact',
    de: '/kontakt',
    pl: '/kontakt',
  },
  '/privacy': {
    hr: '/privatnost',
    en: '/privacy',
    de: '/datenschutz',
    pl: '/prywatnosc',
  },
} as const;

export const routing = defineRouting({
  locales: ['hr', 'en', 'de', 'pl'],
  defaultLocale: 'hr',
  localePrefix: 'always',
  /**
   * Off on purpose. next-intl detects the browser's Accept-Language by
   * default, which sent every German visitor to /de and every English one to
   * /en, so `defaultLocale` only ever applied to languages we do not publish.
   * Everyone now lands on Croatian and switches via the HR/EN/DE control.
   *
   * Trade-off worth remembering: the DE/AT/CH audience no longer gets German
   * automatically. Set this back to true to restore that.
   */
  localeDetection: false,
  pathnames,
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/**
 * Absolute, locale-correct URL for a route. Used by metadata, JSON-LD, the
 * sitemap and llms.txt so every emitted URL agrees with what the Link
 * components render. Building these by hand is how canonical tags and hreflang
 * drift apart from the pages they point at.
 */
export function localeUrl(
  siteUrl: string,
  locale: Locale,
  pathname: AppPathname,
  params?: Record<string, string>
): string {
  const path = getPathname({
    locale,
    // next-intl types the dynamic variants as an object with params; the cast
    // keeps callers from having to branch on whether a route takes params.
    href: (params ? { pathname, params } : pathname) as never,
  });
  return `${siteUrl}${path}`;
}
