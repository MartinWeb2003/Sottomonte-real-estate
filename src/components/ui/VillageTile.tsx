import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { imageUrl, VILLAGE_IMAGE } from '@sanity-config/lib/image';
import { cn, pickLocale } from '@/lib/utils';
import type { Locale, Location } from '@/types';
import { IMAGES } from '@/lib/images';

/**
 * The one village card: 4:3 photo, navy gradient, name + tagline over it,
 * linking to the village landing page. Shared by the homepage peninsula grid
 * and the About coverage section so the two can never drift apart.
 *
 * The navy gradient sits on the photo itself, so the tile reads correctly on
 * both white and navy section backgrounds.
 */
export function VillageTile({
  location,
  locale,
}: {
  location: Location;
  locale: Locale;
}) {
  const t = useTranslations('locations');
  const photo = location.photos?.[0];
  const name = pickLocale(location.name, locale);
  const tagline = pickLocale(location.tagline, locale);

  return (
    <Link
      href={`/locations/${location.slug}`}
      className="img-hover-zoom group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
        <Image
          src={
            photo
              ? imageUrl(photo, VILLAGE_IMAGE.card)
              : IMAGES.placeholderProperty
          }
          alt={photo?.alt || t('photoAlt', { name })}
          fill
          className={cn('object-cover', !photo && 'opacity-60')}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-display text-2xl text-white">{name}</h3>
          {tagline && <p className="mt-1 text-sm text-white/70">{tagline}</p>}
        </div>
      </div>
    </Link>
  );
}
