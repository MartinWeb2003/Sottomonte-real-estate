import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { imageUrl } from '@sanity-config/lib/image';
import { pickLocale } from '@/lib/utils';
import { formatGuideDate } from '@/lib/formatters';
import type { Guide, Locale } from '@/types';
import { IMAGES } from '@/lib/images';

/**
 * The one guide card, used by the guides index, the village pages, the buying
 * page and the related list at the foot of a guide. Same reasoning as
 * VillageTile: four hand-rolled variants of the same thing is how they drift
 * apart, which is exactly what had happened here.
 *
 * Bordered, unlike the property cards elsewhere on the site. A guide card is a
 * block of text with no price and no spec row, so without an edge there is
 * nothing to signal it can be clicked. The border is a 1px hairline that turns
 * gold on hover, which keeps gold to hairlines and hover states.
 *
 * One gold element at rest per card (the date), matching the property card's
 * single gold location label. The call to action stays navy and turns gold
 * only under the cursor.
 */
export function GuideCard({
  guide,
  locale,
  withImage = false,
  headingLevel = 'h3',
}: {
  guide: Guide;
  locale: Locale;
  /** Index grid only. The inline lists are compact and text-only. */
  withImage?: boolean;
  /**
   * Must follow the surrounding outline: h2 where the card sits directly under
   * the page h1, h3 where a section heading already sits above it. Heading
   * order is structural, so this is not a styling choice.
   */
  headingLevel?: 'h2' | 'h3';
}) {
  const t = useTranslations('guides');

  const title = pickLocale(guide.title, locale);
  const excerpt = pickLocale(guide.excerpt, locale);
  const date = guide.updatedAt || guide.publishedAt;
  const cover = guide.coverImage;
  const Heading = headingLevel;

  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="img-hover-zoom card-lift group flex h-full flex-col border border-navy/10 bg-white hover:border-gold focus-visible:border-gold focus-visible:outline-none"
    >
      {withImage && (
        <div className="relative aspect-[4/3] overflow-hidden bg-navy/5">
          <Image
            src={
              cover
                ? imageUrl(cover, { width: 720, height: 540 })
                : IMAGES.placeholderProperty
            }
            alt={cover?.alt || title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* flex-1 + mt-auto below keeps every card in a row the same height and
          puts the call to action on a common baseline. */}
      <div className="flex flex-1 flex-col p-6">
        {date && (
          <p className="text-xs font-medium uppercase tracking-eyebrow text-gold">
            {formatGuideDate(date, locale)}
          </p>
        )}
        <Heading className="mt-2 font-display text-xl leading-snug text-navy transition-colors duration-300 group-hover:text-navy-soft">
          {title}
        </Heading>
        {excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-muted">{excerpt}</p>
        )}
        <p className="mt-auto pt-5 text-sm font-medium text-navy transition-colors duration-300 group-hover:text-gold">
          <span className="inline-block transition-transform duration-500 ease-yacht group-hover:translate-x-1">
            {t('readMore')} →
          </span>
        </p>
      </div>
    </Link>
  );
}
