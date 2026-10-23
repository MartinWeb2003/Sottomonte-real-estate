import type { LocalizedString, Property } from '@/types';

/**
 * Asking-price statistics computed from the agency's own live inventory.
 *
 * What this is and is not matters more here than anywhere else on the site.
 * These are ASKING prices from Sottomonte listings, not transaction prices and
 * not a market index. Croatia has no public sold-price register a boutique
 * agency can query, so anyone publishing a "Pelješac price index" is either
 * citing the tax authority's aggregate or making it up. Saying plainly what
 * the numbers are is the difference between a figure a journalist can quote
 * and one they have to caveat away.
 *
 * The page renders every one of these caveats. Do not remove them to make the
 * table look more authoritative: the honesty IS the reason a local outlet
 * would cite it, and it is the same promise the rest of the site makes about
 * paperwork and village character.
 */

/**
 * Below this, a median is one or two opinions rather than a statistic. Villages
 * under the threshold still get a row with a listing count, because "we have
 * two listings in Trpanj" is true and useful; they just get no price figure.
 */
export const MIN_SAMPLE = 3;

/** Distance that counts as "by the sea" in the summary column. */
export const NEAR_SEA_METERS = 500;

export interface VillageMarketRow {
  slug: string;
  name: LocalizedString;
  /** Every live listing in the village, whatever its type. */
  listings: number;
  /** Buildings with both a price and a floor area, i.e. the €/m² sample. */
  buildingSample: number;
  medianPricePerM2: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  /** Land parcels with both a price and a plot area. */
  landSample: number;
  medianLandPricePerM2: number | null;
  nearSea: number;
}

export interface MarketSnapshot {
  villages: VillageMarketRow[];
  /** Peninsula-wide totals, computed over the same listings. */
  totals: {
    listings: number;
    villages: number;
    buildingSample: number;
    medianPricePerM2: number | null;
    landSample: number;
    medianLandPricePerM2: number | null;
    nearSea: number;
    minPrice: number | null;
    maxPrice: number | null;
  };
}

/** Land is priced per plot m²; everything else per built m². */
const isLand = (property: Property) => property.type === 'land';

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/**
 * Median, not mean, and deliberately.
 *
 * One €4m waterfront villa in a village with four listings drags a mean far
 * above anything a reader could actually buy there. The median answers the
 * question a reader is really asking — what does a normal property here cost —
 * and it is what makes the number safe to quote.
 */
function medianPerM2(properties: Property[], area: (p: Property) => number | undefined) {
  const values = properties
    .map((property) => {
      const size = area(property);
      if (!property.price || property.priceOnRequest || !size || size <= 0) {
        return null;
      }
      return property.price / size;
    })
    .filter((value): value is number => value !== null);

  const result = median(values);
  return { sample: values.length, median: result === null ? null : Math.round(result) };
}

function priceRange(properties: Property[]) {
  const prices = properties
    .filter((property) => property.price && !property.priceOnRequest)
    .map((property) => property.price as number);
  return {
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
  };
}

/** Suppresses a median that rests on too small a sample to mean anything. */
const gated = (stat: { sample: number; median: number | null }) =>
  stat.sample >= MIN_SAMPLE ? stat.median : null;

interface VillageGroup {
  slug: string;
  name: LocalizedString;
  items: Property[];
}

export function buildMarketSnapshot(properties: Property[]): MarketSnapshot {
  // A plain array of groups rather than a Map: the build targets ES5, where
  // spreading a Map's iterator needs downlevelIteration, and the village count
  // here is single digits.
  const groups: VillageGroup[] = [];

  for (const property of properties) {
    const slug = property.location?.slug;
    if (!slug) continue;
    const existing = groups.find((group) => group.slug === slug);
    if (existing) existing.items.push(property);
    else groups.push({ slug, name: property.location!.name, items: [property] });
  }

  const villages: VillageMarketRow[] = groups
    .map(({ slug, name, items }): VillageMarketRow => {
      const buildings = medianPerM2(
        items.filter((property) => !isLand(property)),
        (property) => property.area
      );
      const land = medianPerM2(items.filter(isLand), (property) => property.landArea);

      return {
        slug,
        name,
        listings: items.length,
        buildingSample: buildings.sample,
        medianPricePerM2: gated(buildings),
        landSample: land.sample,
        medianLandPricePerM2: gated(land),
        nearSea: items.filter(
          (property) =>
            property.seaDistance != null && property.seaDistance <= NEAR_SEA_METERS
        ).length,
        ...priceRange(items),
      };
    })
    // Most inventory first: the villages the agency actually covers deeply
    // lead the table, and a village with one listing does not sit at the top
    // because its name starts with A.
    .sort((a, b) => b.listings - a.listings || a.slug.localeCompare(b.slug));

  const allBuildings = medianPerM2(
    properties.filter((property) => !isLand(property)),
    (property) => property.area
  );
  const allLand = medianPerM2(properties.filter(isLand), (property) => property.landArea);

  return {
    villages,
    totals: {
      listings: properties.length,
      villages: villages.length,
      buildingSample: allBuildings.sample,
      medianPricePerM2: gated(allBuildings),
      landSample: allLand.sample,
      medianLandPricePerM2: gated(allLand),
      nearSea: properties.filter(
        (property) =>
          property.seaDistance != null && property.seaDistance <= NEAR_SEA_METERS
      ).length,
      ...priceRange(properties),
    },
  };
}
