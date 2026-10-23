import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PortableTextBlock } from 'next-sanity';
import type {
  Locale,
  LocalizedString,
  LocalizedStringList,
  LocalizedPortableText,
} from '@/types';

/**
 * Locale fallback chain: requested → en → hr. Never returns an empty string
 * for a field that has at least one translation.
 */
const FALLBACK_CHAIN: Record<Locale, Locale[]> = {
  hr: ['hr', 'en', 'de', 'pl'],
  en: ['en', 'hr', 'de', 'pl'],
  de: ['de', 'en', 'hr', 'pl'],
  // Polish falls back to English before Croatian: a Polish buyer is far more
  // likely to read English than Croatian.
  pl: ['pl', 'en', 'hr', 'de'],
};

export function pickLocale(
  field: LocalizedString | undefined,
  locale: Locale
): string {
  if (!field) return '';
  for (const l of FALLBACK_CHAIN[locale]) {
    const value = field[l];
    if (value && value.trim().length > 0) return value;
  }
  return '';
}

/** Same fallback chain, for the localized string lists. */
export function pickLocaleList(
  field: LocalizedStringList | undefined,
  locale: Locale
): string[] {
  if (!field) return [];
  for (const l of FALLBACK_CHAIN[locale]) {
    const value = field[l];
    if (value && value.length > 0) return value.filter((item) => item?.trim());
  }
  return [];
}

export function pickLocaleBlocks(
  field: LocalizedPortableText | undefined,
  locale: Locale
) {
  if (!field) return undefined;
  for (const l of FALLBACK_CHAIN[locale]) {
    const value = field[l];
    if (value && value.length > 0) return value;
  }
  return undefined;
}

/**
 * Portable text down to a single plain string, for the places that need prose
 * rather than markup: JSON-LD `description`, meta descriptions, feed summaries.
 *
 * Only spans of top-level blocks are read. Images and any other custom block
 * type contribute nothing, which is correct here — an alt text spliced into
 * the middle of a sentence reads as corruption.
 *
 * Truncation cuts at a word boundary and appends an ellipsis character rather
 * than three dots, and never mid-word. Descriptions are shown to humans in
 * search results, so a clean cut matters.
 */
export function blocksToPlainText(
  blocks: PortableTextBlock[] | undefined,
  maxLength?: number
): string {
  if (!blocks?.length) return '';

  const text = blocks
    .filter((block) => block._type === 'block' && Array.isArray(block.children))
    .map((block) =>
      (block.children as Array<{ text?: string }>)
        .map((child) => child.text ?? '')
        .join('')
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!maxLength || text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, '')}…`;
}

/**
 * Joins class names AND resolves Tailwind conflicts, last one winning.
 *
 * This used to be a plain `.join(' ')`, which meant a conditional override
 * emitted both classes and left CSS source order to decide. That fails
 * silently and in the wrong direction: the navbar's active link shipped
 * `text-navy text-gold` and rendered navy on every page, because `.text-navy`
 * happens to come later in the generated stylesheet. Nothing errors, nothing
 * warns, the style is just quietly ignored.
 *
 * `twMerge` understands Tailwind's groups, so `cn('text-navy', 'text-gold')`
 * now yields `text-gold`, and `cn('px-4', 'px-0')` yields `px-0`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AGENCY = {
  name: 'Sottomonte',
  email: 'info@sottomonte.hr',
  address: 'Ul. Kralja Zvonimira 8, 20250 Orebić',
  /** Split form, for the PostalAddress JSON-LD. */
  street: 'Ul. Kralja Zvonimira 8',
  city: 'Orebić',
  postalCode: '20250',
  /**
   * Intentionally empty. The agency is email-and-form only, by decision, not
   * by oversight.
   *
   * Everything downstream already respects this: the RealEstateAgent JSON-LD
   * omits `telephone` rather than emitting a placeholder, and the copy that
   * used to promise phone and WhatsApp contact (including the contact page's
   * meta description, which advertised it in Google's results) has been
   * rewritten to promise email only.
   *
   * If a number is ever added, three things have to change with it: this
   * field, the contact-channel copy in all three message files, and the
   * Google Business Profile, which needs a phone to be completed properly and
   * which is where NAP consistency starts.
   */
  phone: '',
  /** Office pin on the contact-page map. Exact, taken from the map listing,
      not geocoded from the street name. */
  coordinates: { lat: 42.976336, lng: 17.187399 },
  /**
   * Holiday apartment run by the same people, in Kućište. Linked only from
   * the two places a visitor is actually planning a trip: the viewings step on
   * the buying page and the contact details. Deliberately not in the footer,
   * not on listings and not in the guides, where a rental link next to a
   * seven-figure villa reads as a side business rather than a service.
   *
   * Ownership is always disclosed in the copy. That is what makes it a
   * recommendation rather than something a buyer discovers later.
   */
  apartmentUrl: 'https://www.visit-eva-orebic.com',
  apartmentName: 'Eva Apartman',
  instagram: 'https://instagram.com/sottomonte.hr',
  facebook: 'https://facebook.com/sottomonte.hr',
  /** Schema.org priceRange. Deliberately coarse: this is a bracket signal for
      the profile, not a claim about any individual listing. */
  priceRange: '€€€',
};

/**
 * Developer credit shown in the footer bottom row.
 *
 * Rendered with rel="nofollow" on purpose, and note the contrast with
 * AGENCY.apartmentUrl, which is deliberately followed. This is a sitewide
 * footer link to an unrelated domain on every page of the site, which is the
 * classic footprint of a link scheme. Nobody is being deceived, but a followed
 * sitewide credit gains the linked site very little and puts needless risk on
 * Sottomonte, so the link is marked as not an endorsement.
 */
export const SITE_CREDIT = {
  name: 'bogojemartin.com',
  url: 'https://bogojemartin.com',
};
