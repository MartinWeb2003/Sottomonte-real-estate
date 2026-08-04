'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { imageUrl } from '@sanity-config/lib/image';
import { cn } from '@/lib/utils';
import { galleryImageAlt } from '@/lib/propertyText';
import type { SanityImage } from '@/types';
import { Lightbox } from './Lightbox';
import { IMAGES } from '@/lib/images';

/**
 * Airbnb pattern: 1 large + 2 stacked, "View all photos (N)" opens the
 * fullscreen lightbox. A tab switches to the drone video when present.
 */
export function Gallery({
  images,
  title,
  altBase,
  droneVideoUrl,
}: {
  images: SanityImage[];
  title: string;
  /** Generated alt fallback, used for any image with no caption in the CMS. */
  altBase: string;
  droneVideoUrl?: string;
}) {
  const t = useTranslations('property');
  const tRoot = useTranslations();
  const altFor = (image: SanityImage, index: number) =>
    galleryImageAlt(tRoot, image, index, altBase);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [tab, setTab] = useState<'photos' | 'video'>('photos');

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full bg-navy/5">
        <Image
          src={IMAGES.placeholderProperty}
          alt={altBase}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
    );
  }

  return (
    <section>
      {droneVideoUrl && (
        <div className="container-site flex gap-6 pb-4 pt-24 text-sm font-medium">
          <button
            type="button"
            onClick={() => setTab('photos')}
            className={cn(
              'border-b pb-1 transition-colors',
              tab === 'photos' ? 'border-gold text-navy' : 'border-transparent text-muted hover:text-navy'
            )}
          >
            {t('photos')}
          </button>
          <button
            type="button"
            onClick={() => setTab('video')}
            className={cn(
              'border-b pb-1 transition-colors',
              tab === 'video' ? 'border-gold text-navy' : 'border-transparent text-muted hover:text-navy'
            )}
          >
            {t('droneVideo')}
          </button>
        </div>
      )}

      {tab === 'video' && droneVideoUrl ? (
        <div className="container-site">
          <div className="relative aspect-video w-full bg-navy">
            <iframe
              src={droneVideoUrl}
              title={`${title} drone video`}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'relative grid gap-2 md:grid-cols-3',
            !droneVideoUrl && 'pt-20'
          )}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="img-hover-zoom relative col-span-2 aspect-[4/3] overflow-hidden bg-navy/5 md:aspect-auto md:h-[520px]"
          >
            <Image
              src={imageUrl(images[0], { width: 1400, height: 1000 })}
              alt={altFor(images[0], 0)}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </button>
          <div className="hidden flex-col gap-2 md:flex md:h-[520px]">
            {images.slice(1, 3).map((image, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i + 1)}
                className="img-hover-zoom relative flex-1 overflow-hidden bg-navy/5"
              >
                <Image
                  src={imageUrl(image, { width: 700, height: 500 })}
                  alt={altFor(image, i + 1)}
                  fill
                  className="object-cover"
                  sizes="34vw"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-4 right-4 bg-white/95 px-4 py-2 text-xs font-medium tracking-wide text-navy transition-colors hover:bg-white"
          >
            {t('viewAllPhotos', { count: images.length })}
          </button>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          title={title}
          altBase={altBase}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
