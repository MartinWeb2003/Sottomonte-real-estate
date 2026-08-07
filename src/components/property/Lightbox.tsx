'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { imageUrl } from '@sanity-config/lib/image';
import { galleryImageAlt } from '@/lib/propertyText';
import {
  nextImageUrl,
  shouldPreload,
  viewportImageWidth,
  warmImages,
} from '@/lib/imagePreload';
import type { SanityImage } from '@/types';

/** Fullscreen lightbox with keyboard (←/→/Esc) and swipe navigation. */
export function Lightbox({
  images,
  title,
  altBase,
  initialIndex,
  onClose,
}: {
  images: SanityImage[];
  title: string;
  /** Generated alt fallback, used for any image with no caption in the CMS. */
  altBase: string;
  initialIndex: number;
  onClose: () => void;
}) {
  const tRoot = useTranslations();
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  /*
   * Fetch the photos either side of the current one. The gallery has already
   * warmed the opening images, but stepping deep into a long set would
   * otherwise hit a cold image on every arrow press.
   */
  useEffect(() => {
    if (images.length < 2 || !shouldPreload()) return;
    const width = viewportImageWidth();
    const neighbours = [
      (index + 1) % images.length,
      (index - 1 + images.length) % images.length,
    ]
      .filter((i) => i !== index)
      .map((i) => nextImageUrl(imageUrl(images[i], { width: 1920 }), width));

    return warmImages(neighbours);
  }, [index, images]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [next, prev, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex flex-col bg-navy/95"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta > 48) prev();
        if (delta < -48) next();
        touchStartX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm text-white/70">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-2 text-2xl leading-none transition-colors hover:text-gold"
        >
          ×
        </button>
      </div>

      <div className="relative flex-1">
        <Image
          key={index}
          src={imageUrl(images[index], { width: 1920 })}
          alt={galleryImageAlt(tRoot, images[index], index, altBase)}
          fill
          className="object-contain"
          sizes="100vw"
        />
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="absolute left-0 top-0 h-full w-1/4 cursor-w-resize"
        />
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="absolute right-0 top-0 h-full w-1/4 cursor-e-resize"
        />
      </div>

      <div className="flex items-center justify-center gap-8 px-5 py-4 text-white md:hidden">
        <button type="button" onClick={prev} aria-label="Previous photo" className="p-2 text-xl">
          ←
        </button>
        <button type="button" onClick={next} aria-label="Next photo" className="p-2 text-xl">
          →
        </button>
      </div>
    </div>
  );
}
