/**
 * Warming the browser cache for images the visitor is about to ask for.
 *
 * The gallery shows three photos at card sizes; opening the lightbox then
 * requests the same photos at full-screen width, which have never been
 * fetched. That first open is therefore a cold download of a large image, and
 * it is the delay this module removes.
 *
 * The subtlety is which URL to warm. These images are remote (cdn.sanity.io)
 * and go through Next's own optimizer, so the browser never requests the
 * Sanity URL: it requests `/_next/image?url=<encoded>&w=<width>&q=<quality>`.
 * Preloading the CDN URL would warm a cache entry nothing ever reads. So the
 * loader URL is reconstructed here instead.
 */

/**
 * Next's default `deviceSizes`. Left at the framework default in
 * next.config.mjs, so this list has to match it. If `images.deviceSizes` is
 * ever configured there, change it here too or every preload silently misses.
 */
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/** Next's default quality, and what the rendered markup currently requests. */
const DEFAULT_QUALITY = 75;

/**
 * The URL `next/image` will request for a full-width image at this viewport.
 *
 * With `fill` + `sizes="100vw"` the browser picks from a srcset built over
 * DEVICE_SIZES, choosing the first candidate at least as wide as the CSS
 * viewport times the device pixel ratio. Mirroring that choice is what makes
 * the preload an actual cache hit rather than a second download.
 */
export function nextImageUrl(src: string, targetWidth: number, quality = DEFAULT_QUALITY) {
  const width =
    DEVICE_SIZES.find((size) => size >= targetWidth) ?? DEVICE_SIZES[DEVICE_SIZES.length - 1];
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/** Full-screen target width in device pixels, capped so we never ask for 4K. */
export function viewportImageWidth() {
  if (typeof window === 'undefined') return 1920;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return Math.min(Math.round(window.innerWidth * dpr), 2048);
}

type Connection = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * Whether speculative downloading is appropriate at all.
 *
 * Preloading a full gallery is several megabytes. Doing that unasked on a
 * metered phone plan or a 2G connection costs the visitor real money and
 * slows down the content they actually asked for, so both are opted out.
 */
export function shouldPreload() {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  return !['slow-2g', '2g'].includes(connection.effectiveType ?? '');
}

/**
 * Fetches images in the background, a couple at a time.
 *
 * Concurrency is deliberately low: the point is to use spare capacity, not to
 * compete with the page's own requests. Returns a cancel function so a
 * component unmounting mid-flight stops queueing further work.
 */
export function warmImages(urls: string[], concurrency = 2) {
  let cancelled = false;
  const queue = [...urls];

  const next = (): void => {
    if (cancelled) return;
    const url = queue.shift();
    if (!url) return;
    const img = new window.Image();
    // Both handlers advance the queue: a failed image should not stall the
    // rest, and there is nothing to report since this is all speculative.
    img.onload = next;
    img.onerror = next;
    img.src = url;
  };

  for (let i = 0; i < Math.min(concurrency, queue.length); i++) next();

  return () => {
    cancelled = true;
    queue.length = 0;
  };
}

/** Runs a callback when the browser is idle, with a timeout fallback. */
export function onIdle(callback: () => void, timeout = 2000) {
  if (typeof window === 'undefined') return () => {};
  const ric = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
    .requestIdleCallback;
  if (ric) {
    const handle = ric(callback, { timeout });
    return () => {
      const cic = (window as Window & { cancelIdleCallback?: typeof cancelIdleCallback })
        .cancelIdleCallback;
      cic?.(handle);
    };
  }
  const handle = window.setTimeout(callback, 300);
  return () => window.clearTimeout(handle);
}
