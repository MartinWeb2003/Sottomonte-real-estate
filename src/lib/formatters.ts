/**
 * Price format is identical in all locales per brand spec:
 * "€ 1.450.000" — dot thousands separator, space after €.
 */
export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 0,
  }).format(price);
  return `€ ${formatted}`;
}

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(area)} m²`;
}

export function formatSeaDistance(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    const formatted = Number.isInteger(km) ? km.toString() : km.toFixed(1).replace('.', ',');
    return `${formatted} km`;
  }
  return `${meters} m`;
}

/**
 * Publish/update dates on guides. Localised, because unlike prices these do
 * differ by market: "3. kolovoza 2026." vs "3 August 2026" vs "3. August 2026".
 * Day precision only — the time of day is noise on an evergreen guide.
 */
export function formatGuideDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatPricePerM2(price: number, area: number): string | null {
  if (!area || area <= 0) return null;
  return formatPrice(Math.round(price / area));
}
