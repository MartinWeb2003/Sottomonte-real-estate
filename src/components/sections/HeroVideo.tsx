'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_VIDEOS } from '@/lib/images';

/** Crossfade length. The next clip starts this far before the current one
    ends, so both are playing through the dissolve and neither freezes. */
const FADE_MS = 900;

/**
 * The drone playlist layered over the hero poster image.
 *
 * Every clip gets its own <video> element stacked in the same box, and only
 * the active one is opaque. Swapping the `src` of a single element instead
 * would blank the hero for as long as the next file took to buffer; holding
 * separate elements lets both clips run at once through the crossfade.
 *
 * The handover is driven by timeupdate rather than `ended` on purpose: waiting
 * for `ended` means the outgoing clip is a frozen last frame for the whole
 * dissolve, which reads as a stutter. Starting the next one FADE_MS early
 * keeps motion on both layers the entire time.
 *
 * Deliberately client-side and deliberately NOT server-rendered: the poster
 * underneath is the LCP element, and this decides at runtime whether the
 * videos are worth downloading at all. Under prefers-reduced-motion nothing
 * is requested, so the hero stays the still photo the CSS falls back to.
 */
export function HeroVideo() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  /** Index we have already handed over from, so timeupdate fires once. */
  const handedOverFrom = useRef<number | null>(null);
  const [useMobile, setUseMobile] = useState<boolean | null>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setUseMobile(window.matchMedia('(max-width: 900px)').matches);
  }, []);

  // Safari can reach readyState before React attaches onCanPlay, which would
  // leave the hero mounted but permanently transparent.
  useEffect(() => {
    if (useMobile !== null && (videoRefs.current[0]?.readyState ?? 0) >= 3) {
      setVisible(true);
    }
  }, [useMobile]);

  /** Pull the rest of the playlist only once the first clip is actually
      playing, so the initial page load still costs exactly one video. */
  const preloadRest = useCallback(() => {
    videoRefs.current.forEach((el, i) => {
      if (i > 0 && el && el.preload !== 'auto') {
        el.preload = 'auto';
        el.load();
      }
    });
  }, []);

  const handleTimeUpdate = useCallback(
    (index: number) => {
      if (index !== active || handedOverFrom.current === index) return;
      const el = videoRefs.current[index];
      if (!el?.duration) return;
      if (el.duration - el.currentTime > FADE_MS / 1000) return;

      handedOverFrom.current = index;
      const next = (index + 1) % HERO_VIDEOS.length;
      const nextEl = videoRefs.current[next];
      if (nextEl) {
        nextEl.currentTime = 0;
        void nextEl.play().catch(() => {});
      }
      setActive(next);
    },
    [active]
  );

  /** The outgoing clip finishes mid-dissolve; park it back at frame 0 so the
      next time round it starts clean rather than on its own last frame. */
  const handleEnded = useCallback((index: number) => {
    const el = videoRefs.current[index];
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    if (handedOverFrom.current === index) handedOverFrom.current = null;
  }, []);

  if (useMobile === null) return null;

  return (
    <>
      {HERO_VIDEOS.map((clip, i) => (
        <video
          key={clip.desktop}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          aria-hidden
          autoPlay={i === 0}
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'none'}
          onCanPlay={i === 0 ? () => setVisible(true) : undefined}
          onPlaying={i === 0 ? preloadRest : undefined}
          onTimeUpdate={() => handleTimeUpdate(i)}
          onEnded={() => handleEnded(i)}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          className={`absolute inset-0 h-full w-full object-cover brightness-[0.85] transition-opacity ease-yacht ${
            visible && active === i ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={useMobile ? clip.mobile : clip.desktop} type="video/mp4" />
        </video>
      ))}
    </>
  );
}
