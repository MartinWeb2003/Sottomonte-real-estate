import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImage } from '@/types';
import { projectId, dataset } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

const FALLBACK = '/images/placeholder-property.svg';

export function urlFor(source: SanityImage) {
  return builder.image(source as never).auto('format');
}

/**
 * The single entry point components use for image sources. Falls back to the
 * generic placeholder when the image or its asset is missing, so a half-filled
 * CMS document never renders a broken image.
 */
export function imageUrl(
  image: SanityImage | undefined,
  size?: {
    width?: number;
    height?: number;
    quality?: number;
    /**
     * `crop` returns the exact box, honouring the hotspot set in Studio, and
     * will happily upscale a small source. `max` never scales up: it returns
     * the source size when that is smaller than the box and lets object-cover
     * crop in the browser. Use `max` anywhere a photo might be smaller than
     * the slot, or the CDN ships a big blurry upscale.
     */
    fit?: 'crop' | 'max';
  }
): string {
  if (!image?.asset) return FALLBACK;

  let b = urlFor(image);
  if (size?.width) b = b.width(size.width);
  if (size?.height) b = b.height(size.height);
  if (size?.width && size?.height) b = b.fit(size.fit ?? 'crop');
  return b.quality(size?.quality ?? 78).url();
}

/**
 * The two village images are different jobs and are sized separately:
 * a wide 2:1 banner behind the page H1, and a 4:3 card in the grids.
 * Both are derived from the same `photos[0]` asset by the Sanity CDN.
 */
export const VILLAGE_IMAGE = {
  /**
   * PageHeader banner on /locations/[slug], full-bleed under a navy scrim.
   * `max` because the supplied village photos range from 900px to 2560px
   * wide: upscaling the small ones to 2400 cost up to 276 KB per page and
   * still looked soft. Under-size sources now ship at their own resolution.
   */
  banner: { width: 2400, height: 1200, quality: 72, fit: 'max' },
  /** VillageTile in the peninsula grid and About coverage. Every source is
      comfortably wider than 720, so an exact 4:3 crop is safe here. */
  card: { width: 720, height: 540, quality: 78, fit: 'crop' },
} as const;
