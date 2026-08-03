/**
 * Every static (non-CMS) image on the site, in one place.
 *
 * Property, village and team photos are NOT here: those live in Sanity and are
 * uploaded through /studio.
 *
 * To swap in a real photo: drop the file into `public/images/` using the name
 * on the right, then change the extension here if it differs (.jpg vs .svg).
 * Nothing else in the codebase references these paths directly.
 */
export const IMAGES = {
  /** Home hero, full screen. Landscape. */
  hero: '/images/hero.jpg',

  /** Home hero poster: shown until the first drone clip fades in, and the only
      thing seen under prefers-reduced-motion. This is the LCP element (the
      video never is). Generated as frame 0 of HERO_VIDEOS[0] at 2560x1440, so
      the video fades in over an identical picture. Regenerate it if you
      reorder the playlist or replace the first clip. */
  heroPoster: '/images/hero-poster.jpg',

  /** Interior page banners, ~40-50vh. Wide landscape. */
  bannerProperties: '/images/banner-properties.jpg',
  bannerSelling: '/images/banner-selling.jpg',
  bannerContact: '/images/banner-contact.jpg',
  /** Reuses the hero shot until a dedicated banner-buying.jpg is provided. */
  bannerBuying: '/images/hero.jpg',

  /** Buying page, image beside the reassurance statement. Rendered into a 4:5
      portrait slot, so a landscape source gets cropped hard on the sides.
      Wants at least 1200x1500 to stay sharp on a retina screen. */
  buyingIntro: '/images/document-image.jpg',

  /** Off-market teaser detail shot (stone wall, old door). Portrait 4:5. */
  offMarketDetail: '/images/off-market.jpeg',

  /** Default social sharing preview, used when a page has no own image. */
  ogImage: '/images/og-image.jpg',

  /** Shown when a property or village has no photo in the CMS yet. */
  placeholderProperty: '/images/placeholder-property.svg',
} as const;

/**
 * Static video, same idea as IMAGES. Source clips are re-encoded before they
 * land here: seamless-looped in ffmpeg (tail crossfaded into the head), audio
 * stripped, faststart enabled. Keep raw camera exports OUT of `public/` —
 * everything under it ships to the CDN.
 */
/**
 * Home hero playlist, played in order and then repeated. Each entry has a
 * 960x540 mobile cut so phones never pull the desktop file. Only the first
 * clip loads with the page; the rest are fetched once it starts playing.
 */
export const HERO_VIDEOS = [
  {
    /** Drone shot over Lovište. 1920x1080, 5s, ~2.0 MB. */
    desktop: '/videos/hero-loviste.mp4',
    mobile: '/videos/hero-loviste-mobile.mp4',
  },
  {
    /** Drone pass along the coast at Perna. 1920x1080, 5s, ~1.8 MB. */
    desktop: '/videos/hero-perna.mp4',
    mobile: '/videos/hero-perna-mobile.mp4',
  },
] as const;

/**
 * Logos, with their real pixel dimensions so next/image gets the aspect ratio
 * right. These are the `-trim` variants: the supplied 500x500 files carry a
 * lot of transparent padding (the navbar mark filled only 32% of its canvas),
 * which made the logo render far smaller than its box. The untrimmed originals
 * are still in public/images/ if you ever need them.
 */
export const LOGOS = {
  /** Dark mark on transparency. Navbar, inverted to white over the hero. */
  navbar: { src: '/images/logo-navbar-trim.png', width: 348, height: 166 },
  /** All white. Footer, on navy. */
  white: { src: '/images/logo-white-trim.png', width: 340, height: 375 },
  /** White with gold frame. Mobile menu, favicon, on navy. */
  full: { src: '/images/logo-trim.png', width: 335, height: 404 },
} as const;
