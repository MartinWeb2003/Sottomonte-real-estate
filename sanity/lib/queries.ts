import { groq } from 'next-sanity';
import { sanityFetch } from './client';
import type {
  Guide,
  Location,
  Property,
  LocaleCoverage,
  PropertyFilters,
  SitemapEntry,
  TeamMember,
  Testimonial,
} from '@/types';
/**
 * ALL GROQ queries for the site live here — never inline them in pages.
 */

/**
 * Per-locale "is this document actually written in this language" flags,
 * evaluated on the Sanity side.
 *
 * The sitemap needs this for every property, village and guide at once, and
 * the alternative is downloading four localised bodies per document just to
 * check whether they are empty. The rule matches `lib/i18nCoverage`: a
 * headline AND a body, both in that locale. Keep the two in step.
 */
function coverageProjection(titleField: string, bodyField: string) {
  const locale = (id: string) =>
    `"${id}": defined(${titleField}.${id}) && ${titleField}.${id} != "" && count(${bodyField}.${id}) > 0`;
  return groq`{ ${['hr', 'en', 'de', 'pl'].map(locale).join(', ')} }`;
}

/** Villages are judged on the description alone: the name is the same word in
    every language, so requiring it would mark every village as translated. */
function descriptionCoverageProjection(bodyField: string) {
  const locale = (id: string) => `"${id}": count(${bodyField}.${id}) > 0`;
  return groq`{ ${['hr', 'en', 'de', 'pl'].map(locale).join(', ')} }`;
}

const LOCATION_PROJECTION = groq`{
  _id,
  name,
  "slug": slug.current,
  tagline,
  description,
  photos,
  coordinates,
  showOnHomepage
}`;

const PROPERTY_CARD_PROJECTION = groq`{
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  status,
  featured,
  type,
  price,
  priceOnRequest,
  area,
  landArea,
  bedrooms,
  bathrooms,
  seaDistance,
  "gallery": gallery[0..1],
  "location": location->${LOCATION_PROJECTION}
}`;

const PROPERTY_FULL_PROJECTION = groq`{
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  status,
  featured,
  type,
  price,
  priceOnRequest,
  area,
  landArea,
  bedrooms,
  bathrooms,
  floors,
  yearOrCondition,
  seaDistance,
  parking,
  papersStatus,
  description,
  gallery,
  droneVideoUrl,
  coordinates,
  exactLocationPublic,
  "location": location->${LOCATION_PROJECTION}
}`;

/* ---------------------------------- home --------------------------------- */

const featuredPropertiesQuery = groq`
  *[_type == "property" && featured == true && status != "sold"]
    | order(_createdAt desc)[0...4] ${PROPERTY_CARD_PROJECTION}
`;

export function getFeaturedProperties() {
  return sanityFetch<Property[]>(featuredPropertiesQuery, {}, []);
}

const locationsQuery = groq`
  *[_type == "location"] | order(name.hr asc) ${LOCATION_PROJECTION}
`;

export function getLocations() {
  return sanityFetch<Location[]>(locationsQuery, {}, []);
}

const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc)[0...6] {
    _id,
    quote,
    authorName,
    authorOrigin,
    "property": property->{ "slug": slug.current, title }
  }
`;

export function getTestimonials() {
  return sanityFetch<Testimonial[]>(testimonialsQuery, {}, []);
}

/* ------------------------------- properties ------------------------------ */

export const PROPERTIES_PAGE_SIZE = 12;

const SORT_CLAUSES: Record<NonNullable<PropertyFilters['sort']>, string> = {
  newest: '_createdAt desc',
  'price-asc': 'coalesce(price, 999999999) asc',
  'price-desc': 'coalesce(price, 0) desc',
};

/** Sold properties are hidden from the grid; filters map 1:1 to searchParams. */
function propertiesFilterClause() {
  return groq`_type == "property" && status != "sold"
    && ($locations == null || location->slug.current in $locations)
    && ($type == null || type == $type)
    && ($minPrice == null || price >= $minPrice)
    && ($maxPrice == null || price <= $maxPrice)
    && ($seaDistance == null || seaDistance <= $seaDistance)`;
}

function filterParams(filters: PropertyFilters) {
  return {
    locations: filters.location?.length ? filters.location : null,
    type: filters.type ?? null,
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
    seaDistance: filters.seaDistance ?? null,
  };
}

export async function getProperties(filters: PropertyFilters) {
  const sort = SORT_CLAUSES[filters.sort ?? 'newest'];
  const page = Math.max(1, filters.page ?? 1);
  const start = (page - 1) * PROPERTIES_PAGE_SIZE;
  const end = start + PROPERTIES_PAGE_SIZE;

  const query = groq`{
    "items": *[${propertiesFilterClause()}]
      | order(${sort})[${start}...${end}] ${PROPERTY_CARD_PROJECTION},
    "total": count(*[${propertiesFilterClause()}])
  }`;

  return sanityFetch<{ items: Property[]; total: number }>(
    query,
    filterParams(filters),
    { items: [], total: 0 }
  );
}

const propertyBySlugQuery = groq`
  *[_type == "property" && slug.current == $slug][0] ${PROPERTY_FULL_PROJECTION}
`;

export function getPropertyBySlug(slug: string) {
  return sanityFetch<Property | null>(propertyBySlugQuery, { slug }, null);
}

const propertySlugsQuery = groq`
  *[_type == "property" && status != "sold"].slug.current
`;

export function getPropertySlugs() {
  return sanityFetch<string[]>(propertySlugsQuery, {}, []);
}

/**
 * Slugs plus their last edit, for the sitemap.
 *
 * Separate from `getPropertySlugs`, which feeds `generateStaticParams` and
 * wants nothing but strings. Without a `lastmod` on listings and villages, the
 * sitemap gave Google no recrawl signal when a price changed or a property
 * sold, so those URLs were rechecked on Google's own schedule rather than ours.
 */
const propertySitemapQuery = groq`
  *[_type == "property" && status != "sold"] | order(_updatedAt desc) {
    "slug": slug.current,
    _updatedAt,
    "coverage": ${coverageProjection('title', 'description')}
  }
`;

export function getPropertySitemapEntries() {
  return sanityFetch<SitemapEntry[]>(propertySitemapQuery, {}, []);
}

const locationSitemapQuery = groq`
  *[_type == "location" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt,
    "coverage": ${descriptionCoverageProjection('description')},
    "propertiesUpdatedAt": *[_type == "property" && status != "sold" && references(^._id)]
      | order(_updatedAt desc)[0]._updatedAt
  }
`;

/**
 * A village page shows its own copy and the listings in that village, so it
 * changes when either does. The later of the two dates is the honest answer,
 * and a truthful lastmod is the only kind worth sending.
 */
export function getLocationSitemapEntries() {
  return sanityFetch<Array<SitemapEntry & { propertiesUpdatedAt?: string }>>(
    locationSitemapQuery,
    {},
    []
  );
}

/** Similar: same village first, then same type in a similar price range. */
const similarPropertiesQuery = groq`
  *[_type == "property" && status != "sold" && slug.current != $slug] {
    ...,
    "sameVillage": location->slug.current == $locationSlug,
    "sameType": type == $type
  } | order(sameVillage desc, sameType desc, _createdAt desc)[0...3] ${PROPERTY_CARD_PROJECTION}
`;

export function getSimilarProperties(
  slug: string,
  locationSlug: string | null,
  type: string
) {
  return sanityFetch<Property[]>(
    similarPropertiesQuery,
    { slug, locationSlug, type },
    []
  );
}

/* --------------------------------- market -------------------------------- */

/**
 * Every live listing, reduced to the fields the asking-price table needs.
 *
 * Deliberately not `getProperties({})`: that one paginates and carries
 * galleries. This is an aggregate over the whole portfolio, so it must not be
 * capped at a page size, and it has no use for images.
 *
 * Sold listings are excluded to stay consistent with the rest of the site,
 * which is also the honest choice: a sold property's asking price is history,
 * and mixing it into a "what things cost now" table would misdate the data.
 */
const marketSnapshotQuery = groq`
  *[_type == "property" && status != "sold" && defined(location->slug.current)] {
    _id,
    _createdAt,
    "slug": slug.current,
    status,
    type,
    price,
    priceOnRequest,
    area,
    landArea,
    seaDistance,
    title,
    "location": location->{ _id, name, "slug": slug.current }
  }
`;

export function getMarketProperties() {
  return sanityFetch<Property[]>(marketSnapshotQuery, {}, []);
}

/** When the table last changed, for the "as of" line and the Dataset markup. */
const marketUpdatedQuery = groq`
  *[_type == "property" && status != "sold"] | order(_updatedAt desc)[0]._updatedAt
`;

export function getMarketUpdatedAt() {
  return sanityFetch<string | null>(marketUpdatedQuery, {}, null);
}

/* --------------------------------- guides -------------------------------- */

const GUIDE_AUTHOR_PROJECTION = groq`{
  _id,
  name,
  role,
  photo,
  bio,
  languages
}`;

const GUIDE_CARD_PROJECTION = groq`{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  updatedAt,
  "author": author->${GUIDE_AUTHOR_PROJECTION}
}`;

const GUIDE_FULL_PROJECTION = groq`{
  _id,
  title,
  metaTitle,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  updatedAt,
  keyTakeaways,
  body,
  faq,
  "author": author->${GUIDE_AUTHOR_PROJECTION},
  "relatedLocations": relatedLocations[]->${LOCATION_PROJECTION}
}`;

/**
 * Scheduled-in-the-future guides stay out of every listing and out of the
 * sitemap, so an editor can prepare one without it leaking into search.
 */
const publishedGuideFilter = groq`_type == "guide" && defined(slug.current) && publishedAt <= now()`;

const guidesQuery = groq`
  *[${publishedGuideFilter}] | order(publishedAt desc) ${GUIDE_CARD_PROJECTION}
`;

export function getGuides() {
  return sanityFetch<Guide[]>(guidesQuery, {}, []);
}

const guideBySlugQuery = groq`
  *[${publishedGuideFilter} && slug.current == $slug][0] ${GUIDE_FULL_PROJECTION}
`;

export function getGuideBySlug(slug: string) {
  return sanityFetch<Guide | null>(guideBySlugQuery, { slug }, null);
}

const guideSitemapQuery = groq`
  *[${publishedGuideFilter}] | order(publishedAt desc) {
    "slug": slug.current,
    "_updatedAt": coalesce(updatedAt, publishedAt, _updatedAt),
    "coverage": ${coverageProjection('title', 'body')}
  }
`;

/**
 * Guides for the sitemap: slug, the date an editor actually stands behind,
 * and which languages the guide exists in.
 *
 * Separate from `getGuides`, which powers the index cards and has no reason to
 * fetch four localised bodies. `_updatedAt` here is the editorial date, not
 * Sanity's document timestamp, so a typo fix does not claim the article was
 * revised.
 */
export function getGuideSitemapEntries() {
  return sanityFetch<SitemapEntry[]>(guideSitemapQuery, {}, []);
}

const guideFeedQuery = groq`
  *[${publishedGuideFilter}] | order(publishedAt desc)[0...20] {
    "slug": slug.current,
    title,
    excerpt,
    publishedAt,
    updatedAt,
    "coverage": ${coverageProjection('title', 'body')}
  }
`;

/**
 * The twenty most recent guides, for the RSS feeds.
 *
 * Capped because a feed is a "what is new" surface, not an archive: readers
 * pull it repeatedly and every extra item is bandwidth spent on articles the
 * subscriber already has. Coverage rides along so each locale's feed carries
 * only the guides actually written in that language.
 */
export function getGuideFeedEntries() {
  return sanityFetch<
    Array<Pick<Guide, 'slug' | 'title' | 'excerpt' | 'publishedAt' | 'updatedAt'> & {
      coverage?: LocaleCoverage;
    }>
  >(guideFeedQuery, {}, []);
}

const guideSlugsQuery = groq`
  *[${publishedGuideFilter}].slug.current
`;

export function getGuideSlugs() {
  return sanityFetch<string[]>(guideSlugsQuery, {}, []);
}

/** Related: guides sharing a village with this one first, then the newest. */
const relatedGuidesQuery = groq`
  *[${publishedGuideFilter} && slug.current != $slug] {
    ...,
    "sharesLocation": count(relatedLocations[@._ref in $locationIds]) > 0
  } | order(sharesLocation desc, publishedAt desc)[0...3] ${GUIDE_CARD_PROJECTION}
`;

export function getRelatedGuides(slug: string, locationIds: string[]) {
  return sanityFetch<Guide[]>(
    relatedGuidesQuery,
    { slug, locationIds: locationIds.length ? locationIds : [''] },
    []
  );
}

/**
 * Guides tagged with a village, for the links on that village's page.
 *
 * Ordered by how specific a guide is before how new it is. Only three fit, and
 * sorting by date alone let generic peninsula-wide guides take every slot: the
 * Orebić page was linking the Viganj guide and not the Orebić one, leaving the
 * guide about Orebić with a single inbound link from the guides index.
 *
 * Specificity is read off the tag count, which is the honest signal already in
 * the data: a guide tagged to one village is about that village, one tagged to
 * all six is background reading that happens to apply there.
 */
const guidesForLocationQuery = groq`
  *[${publishedGuideFilter} && $locationId in relatedLocations[]._ref]
    | order(count(relatedLocations) asc, publishedAt desc)[0...3] ${GUIDE_CARD_PROJECTION}
`;

export function getGuidesForLocation(locationId: string) {
  return sanityFetch<Guide[]>(guidesForLocationQuery, { locationId }, []);
}

/**
 * Every question-and-answer pair an editor has attached to a guide, with the
 * guide it came from.
 *
 * Feeds the FAQ hub, which collects the questions scattered across the buying
 * page, the selling page and the guides into one place. Only guides that
 * actually have FAQ entries come back, so the hub does not have to filter.
 */
const guideFaqQuery = groq`
  *[${publishedGuideFilter} && count(faq) > 0] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    faq
  }
`;

export function getGuideFaqs() {
  return sanityFetch<
    Array<Pick<Guide, 'slug' | 'title' | 'faq'>>
  >(guideFaqQuery, {}, []);
}

/* --------------------------------- other --------------------------------- */

const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc, name asc) {
    _id,
    name,
    role,
    photo,
    phone,
    email,
    languages,
    bio
  }
`;

export function getTeamMembers() {
  return sanityFetch<TeamMember[]>(teamMembersQuery, {}, []);
}

const firstTeamMemberQuery = groq`
  *[_type == "teamMember"] | order(order asc, name asc)[0] {
    _id,
    name,
    role,
    photo,
    phone,
    email,
    languages,
    bio
  }
`;

export function getFirstTeamMember() {
  return sanityFetch<TeamMember | null>(firstTeamMemberQuery, {}, null);
}

const locationBySlugQuery = groq`
  *[_type == "location" && slug.current == $slug][0] ${LOCATION_PROJECTION}
`;

export function getLocationBySlug(slug: string) {
  return sanityFetch<Location | null>(locationBySlugQuery, { slug }, null);
}
