'use client';

import { useEffect } from 'react';
import { IMAGES } from '@/lib/images';

/**
 * Warms the two things Next's own prefetch does not cover, on hover/focus of
 * a nav link: the destination page's banner image, and the MapTiler SDK chunk.
 *
 * Why on intent rather than eagerly. Measured on the live site, each page
 * pulls 180-360 KB of images, so preloading all four banners up front would
 * cost every visitor roughly 300 KB and compete with the current page's own
 * LCP image, to save ~150ms for the minority who navigate there. Hover to
 * click is typically 200-400ms, which is enough to cover most of the fetch at
 * no cost to anyone who does not hover.
 *
 * The map is the bigger prize. On a real home -> contact navigation the first
 * MapTiler request did not fire until 1170ms, because `import('@maptiler/sdk')`
 * inside the map component has to download and parse before it can even ask
 * for a style. Touching the same dynamic import here warms the exact chunk the
 * map will use, so by the time the page mounts it is already in memory.
 *
 * Desktop only: speculative downloads are the wrong trade on a phone.
 */

const BANNER_BY_ROUTE: Record<string, string> = {
  '/properties': IMAGES.bannerProperties,
  '/buying': IMAGES.bannerBuying,
  '/selling': IMAGES.bannerSelling,
  '/contact': IMAGES.bannerContact,
};

/** Routes whose pages mount a MapTiler map. */
const MAP_ROUTES = ['/contact', '/properties'];

const warmed = new Set<string>();

function prefetchImage(src: string) {
  // Matches what next/image requests at desktop widths; a mismatched width
  // would download a derivative the page then never uses.
  const href = `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=75`;
  if (warmed.has(href)) return;
  warmed.add(href);
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = href;
  document.head.appendChild(link);
}

function warmMapSdk() {
  if (warmed.has('maptiler')) return;
  warmed.add('maptiler');
  void import('@maptiler/sdk').catch(() => {});
}

export function PrefetchOnIntent() {
  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) return;
    // Respect an explicit request to conserve data.
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    const onIntent = (event: Event) => {
      const link = (event.target as HTMLElement | null)?.closest?.('a[href]');
      if (!(link instanceof HTMLAnchorElement)) return;

      let path: string;
      try {
        const url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        // Strip the /hr | /en | /de prefix to get the bare route.
        path = url.pathname.replace(/^\/(hr|en|de|pl)(?=\/|$)/, '') || '/';
      } catch {
        return;
      }

      const banner = BANNER_BY_ROUTE[path];
      if (banner) prefetchImage(banner);
      if (MAP_ROUTES.includes(path)) warmMapSdk();
    };

    document.addEventListener('pointerenter', onIntent, { capture: true });
    document.addEventListener('focusin', onIntent);
    return () => {
      document.removeEventListener('pointerenter', onIntent, { capture: true });
      document.removeEventListener('focusin', onIntent);
    };
  }, []);

  return null;
}
