import { formatArea, formatPrice, formatSeaDistance } from './formatters';
import { pickLocale } from './utils';
import type { Locale, Property } from '@/types';

/**
 * Search-facing text derived from a property document: meta titles, meta
 * descriptions and image alt fallbacks.
 *
 * These all used to be one-liners inlined at the call site, which is how the
 * detail pages ended up shipping `"{title} | Sottomonte"` and a sixteen
 * character description ("Orebić · Pelješac") across what will be the largest
 * page group on the site. Centralising them means the templates are localised
 * once, in the message files, and every listing gets the same shape.
 */

/**
 * Both `useTranslations()` and `getTranslations()` (root, no namespace) satisfy
 * this, so the same builders work in server pages and in components.
 */
export type Translate = (
  key: string,
  values?: Record<string, string | number>
) => string;

/**
 * Google truncates around 60 characters for titles and 155-160 for
 * descriptions. Over-long text is not penalised, it is just cut mid-word in
 * the results, which reads as sloppy on the exact pages we most want clicked.
 */
const DESCRIPTION_MAX = 155;

/**
 * Last-resort trim, to a word boundary and without a dangling separator.
 *
 * Only reachable if the template itself is longer than the budget before any
 * facts are added, because the length is otherwise managed by dropping whole
 * facts (see `fitFacts`). Chopping a sentence produced "300 m zum Unterlagen
 * geprüft" and "Price on Papers verified" in testing: grammatical debris that
 * reads worse than saying less.
 */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const boundary = cut.lastIndexOf(' ');
  return (boundary > max * 0.6 ? cut.slice(0, boundary) : cut).replace(
    /[\s,.;:·]+$/,
    ''
  );
}

/**
 * A fact and how willing we are to lose it.
 *
 * Size and price are what a searcher scans for, so they stay whatever else
 * goes. Plot size is the first to be dropped: it is the least decisive of the
 * five and the longest to write out.
 */
interface Fact {
  text: string;
  keep: number;
}

/**
 * Drops the least important facts, whole, until the assembled sentence fits.
 * Returns the joined list, never a partial fact.
 */
function fitFacts(
  facts: Fact[],
  assemble: (joined: string) => string,
  max: number
): string {
  const remaining = [...facts];
  while (remaining.length > 1 && assemble(joinFacts(remaining)).length > max) {
    let weakest = 0;
    for (let i = 1; i < remaining.length; i++) {
      if (remaining[i].keep < remaining[weakest].keep) weakest = i;
    }
    // Everything left is equally essential; trimming further would only take
    // size or price, so stop and let the clamp handle the overflow.
    if (remaining[weakest].keep >= 3) break;
    remaining.splice(weakest, 1);
  }
  return joinFacts(remaining);
}

const joinFacts = (facts: Fact[]) => facts.map((fact) => fact.text).join(', ');

/**
 * Short, single-word-ish type label ("Kuća", not "Kuća / Vila").
 * The on-site filter labels carry a slash for clarity in a dropdown; a slash
 * inside a title tag reads as noise in a result listing.
 */
export function propertyTypeLabel(t: Translate, property: Property): string {
  return t(`properties.typesShort.${property.type}`);
}

/** The size that best describes this property: floor area, or plot for land. */
function primarySize(property: Property): string | null {
  if (property.type === 'land') {
    return property.landArea ? formatArea(property.landArea) : null;
  }
  return property.area
    ? formatArea(property.area)
    : property.landArea
      ? formatArea(property.landArea)
      : null;
}

/**
 * "Kuća na prodaju, Orebić: 120 m² | Sottomonte"
 *
 * Primary keyword first, brand last, per the title-tag rules. Falls back to
 * the untemplated form when a property has no location or no size, so a
 * half-filled CMS document still gets a sane title.
 */
export function propertyMetaTitle(
  t: Translate,
  property: Property,
  locale: Locale
): string {
  const type = propertyTypeLabel(t, property);
  const location = pickLocale(property.location?.name, locale);
  const size = primarySize(property);

  if (!location) return `${pickLocale(property.title, locale)} | Sottomonte`;
  return size
    ? t('meta.property.titleWithSize', { type, location, size })
    : t('meta.property.title', { type, location });
}

/**
 * A meta description written as a small ad: what it is, where, the concrete
 * numbers, then a reason to click. Numbers matter here — they are what makes
 * the snippet look like a real listing rather than boilerplate.
 */
export function propertyMetaDescription(
  t: Translate,
  property: Property,
  locale: Locale
): string {
  const type = propertyTypeLabel(t, property);
  const location = pickLocale(property.location?.name, locale);

  const facts: Fact[] = [];
  const size = primarySize(property);
  if (size) facts.push({ text: size, keep: 3 });
  if (property.type !== 'land' && property.landArea)
    facts.push({
      text: t('meta.property.factLand', { area: formatArea(property.landArea) }),
      keep: 0,
    });
  if (property.bedrooms)
    facts.push({
      text: t('meta.property.factBedrooms', { count: property.bedrooms }),
      keep: 1,
    });
  if (property.seaDistance != null)
    facts.push({
      text: t('meta.property.factSea', {
        distance: formatSeaDistance(property.seaDistance),
      }),
      keep: 2,
    });
  facts.push({
    text:
      property.priceOnRequest || !property.price
        ? t('property.priceOnRequest')
        : formatPrice(property.price),
    keep: 3,
  });

  const cta = t('meta.property.descriptionCta');
  const assemble = (joined: string) =>
    location
      ? t('meta.property.descriptionLead', { type, location, facts: joined })
      : t('meta.property.descriptionLeadNoLocation', { type, facts: joined });

  // The call to action always survives: it is the whole point of the
  // description. Only the facts list gives way, and it gives way a fact at a
  // time rather than mid-phrase.
  const budget = DESCRIPTION_MAX - cta.length - 1;
  return `${clamp(assemble(fitFacts(facts, assemble, budget)), budget)} ${cta}`;
}

/**
 * Alt-text fallback, used only when the CMS `alt` field is empty.
 *
 * It names the subject of the photo in natural language rather than listing
 * keywords, and numbers the frames past the first so a ten-image gallery does
 * not ship ten identical alt attributes. A real caption typed in Studio always
 * wins over this.
 */
export function propertyImageAlt(
  t: Translate,
  property: Property,
  locale: Locale
): string {
  const type = propertyTypeLabel(t, property);
  const location = pickLocale(property.location?.name, locale);
  return location
    ? t('property.imageAlt', { type, location })
    : pickLocale(property.title, locale);
}

/**
 * Alt for one frame of a gallery. A caption typed in Studio always wins; the
 * generated fallback is numbered past the first frame so a ten-photo gallery
 * does not ship ten identical alt attributes.
 *
 * `altBase` is passed down as a plain string rather than a callback because
 * galleries are client components and functions do not cross that boundary.
 */
export function galleryImageAlt(
  t: Translate,
  image: { alt?: string },
  index: number,
  altBase: string
): string {
  if (image.alt) return image.alt;
  return index > 0
    ? t('property.imageAltNumbered', { base: altBase, n: index + 1 })
    : altBase;
}
