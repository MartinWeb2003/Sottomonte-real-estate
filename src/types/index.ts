import type { PortableTextBlock } from 'next-sanity';

export type Locale = 'hr' | 'en' | 'de';

/** Localized string field from Sanity: { hr, en, de } */
export type LocalizedString = Partial<Record<Locale, string>>;

/** Localized portable text field from Sanity */
export type LocalizedPortableText = Partial<Record<Locale, PortableTextBlock[]>>;

export interface SanityImage {
  _type: 'image';
  asset?: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
}

export interface Geopoint {
  _type: 'geopoint';
  lat: number;
  lng: number;
}

export type PropertyStatus = 'available' | 'reserved' | 'sold';
export type PropertyType = 'house' | 'apartment' | 'land' | 'stone-ruin';

export interface Location {
  _id: string;
  name: LocalizedString;
  slug: string;
  tagline?: LocalizedString;
  description?: LocalizedPortableText;
  photos?: SanityImage[];
  coordinates?: Geopoint;
}

export interface Property {
  _id: string;
  _createdAt: string;
  title: LocalizedString;
  slug: string;
  status: PropertyStatus;
  featured?: boolean;
  location?: Location;
  type: PropertyType;
  price?: number;
  priceOnRequest?: boolean;
  area?: number;
  landArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  yearOrCondition?: LocalizedString;
  seaDistance?: number;
  parking?: boolean;
  papersStatus?: LocalizedString;
  description?: LocalizedPortableText;
  gallery?: SanityImage[];
  droneVideoUrl?: string;
  coordinates?: Geopoint;
  exactLocationPublic?: boolean;
}

export interface Testimonial {
  _id: string;
  quote: LocalizedString;
  authorName: string;
  authorOrigin?: string;
  property?: { slug: string; title: LocalizedString };
}

export interface TeamMember {
  _id: string;
  name: string;
  role: LocalizedString;
  photo?: SanityImage;
  phone?: string;
  email?: string;
  languages?: string[];
  bio?: LocalizedString;
}

/** URL searchParams-driven filter state for the properties grid */
export interface PropertyFilters {
  location?: string[];
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  seaDistance?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc';
  page?: number;
}
