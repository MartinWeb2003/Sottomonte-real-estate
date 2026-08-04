import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { imageUrl } from '@sanity-config/lib/image';
import { formatArea, formatPrice, formatSeaDistance } from '@/lib/formatters';
import { pickLocale } from '@/lib/utils';
import { propertyImageAlt } from '@/lib/propertyText';
import type { Locale, Property } from '@/types';
import { IMAGES } from '@/lib/images';

/**
 * The one property card: image (4:3) → gold caps location → serif title →
 * one-line spec row → serif navy price. No badges, no ribbons, no overlay
 * text. "Reserved" is the only allowed status label, as subtle navy text.
 */
export function PropertyCard({ property }: { property: Property }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('property');
  const tRoot = useTranslations();
  const tTypes = useTranslations('properties.types');

  const title = pickLocale(property.title, locale);
  const cover = property.gallery?.[0];

  const specs: string[] = [tTypes(property.type)];
  if (property.area) specs.push(formatArea(property.area));
  else if (property.landArea) specs.push(formatArea(property.landArea));
  if (property.bedrooms)
    specs.push(`${property.bedrooms} ${t('specs.bedrooms').toLowerCase()}`);
  if (property.seaDistance != null)
    specs.push(
      `${t('specs.seaDistance').toLowerCase()} ${formatSeaDistance(property.seaDistance)}`
    );

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="img-hover-zoom group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
        <Image
          src={
            cover
              ? imageUrl(cover, { width: 720, height: 540 })
              : IMAGES.placeholderProperty
          }
          alt={cover?.alt || propertyImageAlt(tRoot, property, locale)}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="pt-5">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-gold">
          {pickLocale(property.location?.name, locale)}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug text-navy transition-colors duration-300 group-hover:text-navy-soft">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted">{specs.join(' · ')}</p>
        <p className="mt-3 font-display text-lg font-semibold text-navy">
          {property.priceOnRequest || !property.price
            ? t('priceOnRequest')
            : formatPrice(property.price)}
          {property.status === 'reserved' && (
            <span className="ml-3 font-sans text-xs font-medium uppercase tracking-wider text-navy-soft">
              {t('status.reserved')}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
