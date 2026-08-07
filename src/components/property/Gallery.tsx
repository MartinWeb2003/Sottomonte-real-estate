'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { imageUrl } from '@sanity-config/lib/image';
import { cn } from '@/lib/utils';
import { galleryImageAlt } from '@/lib/propertyText';
import {
  nextImageUrl,
  onIdle,
  shouldPreload,
  viewportImageWidth,
  warmImages,
} from '@/lib/imagePreload';
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

  /*
   * The lightbox requests these photos at full-screen width, a size the card
   * thumbnails never fetch, so without this the first "view all photos" click
   * waits on a cold download. Warming them here means the lightbox opens from
   * cache instead.
   */
  const warmedRef = useRef(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const lightboxUrls = useCallback(
    (count: number) => {
      const width = viewportImageWidth();
      return images
        .slice(0, count)
        .map((image) => nextImageUrl(imageUrl(image, { width: 1920 }), width));
    },
    [images]
  );

  /** Everything, triggered the moment the visitor shows intent to open it. */
  const warmAll = useCallback(() => {
    if (warmedRef.current || !shouldPreload()) return;
    warmedRef.current = true;
    cancelRef.current?.();
    cancelRef.current = warmImages(lightboxUrls(images.length), 3);
  }, [images.length, lightboxUrls]);

  useEffect(() => {
    if (images.length === 0 || !shouldPreload()) return;

    /*
     * Only the first few on load. A gallery can run to dozens of photos and
     * pulling all of them unprompted would cost the visitor bandwidth they
     * may never use; the rest are fetched on hover or on open.
     */
    const cancelIdle = onIdle(() => {
      cancelRef.current = warmImages(lightboxUrls(Math.min(images.length, 4)));
    });

    return () => {
      cancelIdle();
      cancelRef.current?.();
    };
  }, [images.length, lightboxUrls]);

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
            onPointerEnter={warmAll}
            onFocus={warmAll}
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
                onPointerEnter={warmAll}
                onFocus={warmAll}
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
            onPointerEnter={warmAll}
            onFocus={warmAll}
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
