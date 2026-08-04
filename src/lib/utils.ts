import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale, LocalizedString, LocalizedPortableText } from '@/types';

/**
 * Locale fallback chain: requested → en → hr. Never returns an empty string
 * for a field that has at least one translation.
 */
const FALLBACK_CHAIN: Record<Locale, Locale[]> = {
  hr: ['hr', 'en', 'de'],
  en: ['en', 'hr', 'de'],
  de: ['de', 'en', 'hr'],
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
   * Still blank: no public phone number has been supplied for the agency.
   *
   * This is not cosmetic. Name-address-phone has to be byte-identical across
   * the site, the Google Business Profile and every directory listing, and
   * `telephone` is a recommended property on the RealEstateAgent markup. Fill
   * this in (E.164, e.g. "+385201234567") and it flows into the JSON-LD on its
   * own. Until then every emission that would use it is skipped rather than
   * shipping a placeholder, because a wrong number in structured data is worse
   * than a missing one.
   */
  phone: '',
  /** Office pin on the contact-page map. Exact, taken from the map listing,
      not geocoded from the street name. */
  coordinates: { lat: 42.976336, lng: 17.187399 },
  instagram: 'https://instagram.com/sottomonte.hr',
  facebook: 'https://facebook.com/sottomonte.hr',
  /** Schema.org priceRange. Deliberately coarse: this is a bracket signal for
      the profile, not a claim about any individual listing. */
  priceRange: '€€€',
};
