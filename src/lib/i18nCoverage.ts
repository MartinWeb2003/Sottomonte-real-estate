import { routing } from '@/i18n/routing';
import type {
  Guide,
  Locale,
  LocalizedPortableText,
  LocalizedString,
  Location,
  Property,
} from '@/types';

/**
 * Which locales a CMS document is *actually written in*.
 *
 * The problem this solves: `pickLocale` falls back (de -> en -> hr), which is
 * the right behaviour for a visitor who followed a link, and the wrong thing
 * to advertise to a search engine. Every property, village and guide is
 * statically generated in all four locales, so before this existed the site
 * published four URLs per document, told Google via hreflang that all four
 * were distinct translations, and listed all four in the sitemap, when three
 * of them could be the identical Croatian text under a German URL.
 *
 * That is the textbook way to build thin duplicate pages, and it is what
 * CLAUDE.md warns about for Polish specifically.
 *
 * A locale counts as covered only when the document carries its own headline
 * AND its own body in that locale. A translated title over Croatian prose is
 * not a German page. The pages themselves still render for every locale, with
 * the fallback chain intact: an uncovered locale is marked `noindex, follow`
 * and left out of the sitemap and the hreflang set, so it stays reachable and
 * stops competing.
 */
const ALL_LOCALES = routing.locales as readonly Locale[];

const hasString = (field: LocalizedString | undefined, locale: Locale) =>
  Boolean(field?.[locale]?.trim());

const hasBlocks = (field: LocalizedPortableText | undefined, locale: Locale) =>
  Boolean(field?.[locale]?.length);

/**
 * Fail open when nothing qualifies.
 *
 * A document with no long-form copy in any language is thin in every locale,
 * and noindexing all four URLs would be defensible. It would also mean that a
 * half-populated CMS silently removes the entire listings section from search,
 * which is a far worse failure than a thin page. So an empty result means "we
 * cannot tell", and every locale stays indexable.
 */
function orAll(locales: Locale[]): Locale[] {
  return locales.length > 0 ? locales : [...ALL_LOCALES];
}

/** Locales where this listing has its own title and its own description. */
export function propertyLocales(property: Property): Locale[] {
  return orAll(
    ALL_LOCALES.filter(
      (locale) =>
        hasString(property.title, locale) &&
        hasBlocks(property.description, locale)
    )
  );
}

/** Locales where this guide has its own headline and its own body. */
export function guideLocales(guide: Guide): Locale[] {
  return orAll(
    ALL_LOCALES.filter(
      (locale) => hasString(guide.title, locale) && hasBlocks(guide.body, locale)
    )
  );
}

/**
 * Locales where this village page is genuinely written.
 *
 * The name alone does not count, and cannot: "Orebić" is "Orebić" in all four
 * languages, so a covered-name test would mark every village as translated
 * everywhere. The village description is the entire reason the page ranks, so
 * that is what is measured.
 */
export function locationLocales(location: Location): Locale[] {
  return orAll(
    ALL_LOCALES.filter((locale) => hasBlocks(location.description, locale))
  );
}

/**
 * Metadata fragment for a locale that has no translation of this document.
 *
 * `follow` is deliberate: the page still links to listings, villages and
 * guides that ARE translated, and there is no reason to strand that crawl
 * path. The canonical stays self-referential (handled in `buildMetadata`),
 * because a cross-language canonical tells Google the two pages are the same
 * page, which is a different and wrong claim.
 */
export function robotsFor(available: Locale[], locale: Locale) {
  return available.includes(locale)
    ? undefined
    : { index: false, follow: true };
}
