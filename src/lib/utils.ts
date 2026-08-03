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

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const AGENCY = {
  name: 'Sottomonte',
  email: 'info@sottomonte.hr',
  address: 'Ul. Kralja Zvonimira 8, 20250 Orebić',
  /** Split form, for the PostalAddress JSON-LD. */
  street: 'Ul. Kralja Zvonimira 8',
  city: 'Orebić',
  postalCode: '20250',
  /** Office pin on the contact-page map. Exact, taken from the map listing,
      not geocoded from the street name. */
  coordinates: { lat: 42.976336, lng: 17.187399 },
  instagram: 'https://instagram.com/sottomonte.hr',
  facebook: 'https://facebook.com/sottomonte.hr',
};
