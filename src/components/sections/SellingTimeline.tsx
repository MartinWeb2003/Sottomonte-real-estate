'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const STEPS = [0, 1, 2, 3, 4] as const;

/**
 * The five selling steps on a center gold line (md+), alternating sides:
 * 01/03/05 left, 02/04 right. On mobile the line stays left, steps stacked.
 *
 * Scroll-linked motion, no animation library:
 * - the gold line draws itself downward as the section scrolls through
 *   (scaleY driven by scroll progress, rAF-throttled),
 * - each step slides in from its own side of the line.
 * Both effects collapse to a static, fully-drawn state under
 * prefers-reduced-motion.
 */
export function SellingTimeline() {
  const t = useTranslations('selling');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fill.style.transform = 'scaleY(1)';
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      // The line tip tracks a point 65% down the viewport, so it always
      // stays just ahead of what the visitor is reading.
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.65 - rect.top) / rect.height)
      );
      fill.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative mt-14 md:mt-20">
      {/* Track and its scroll-drawn gold fill */}
      <div
        aria-hidden
        className="absolute bottom-2 left-[7px] top-2 w-px bg-gold/25 md:left-1/2 md:-ml-px"
      />
      <div
        aria-hidden
        ref={fillRef}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top scale-y-0 bg-gold md:left-1/2 md:-ml-px"
      />
      <ol>
        {STEPS.map((i) => (
          <TimelineStep
            key={i}
            index={i}
            title={t(`processSteps.${i}.title`)}
            body={t(`processSteps.${i}.body`)}
          />
        ))}
      </ol>
    </div>
  );
}

function TimelineStep({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  const left = index % 2 === 0;
  const ref = useRef<HTMLLIElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className="relative py-8 pl-10 md:grid md:grid-cols-2 md:gap-x-20 md:py-14 md:pl-0"
    >
      <span
        aria-hidden
        className="absolute left-0 top-9 h-[15px] w-[15px] rounded-full border border-gold bg-white md:left-1/2 md:top-[72px] md:-translate-x-1/2"
      />
      <div
        className={cn(
          'transition-all duration-700 ease-yacht md:max-w-md',
          left
            ? 'md:col-start-1 md:ml-auto md:pr-14 md:text-right'
            : 'md:col-start-2 md:pl-14',
          visible
            ? 'translate-x-0 translate-y-0 opacity-100'
            : cn(
                'translate-y-6 opacity-0',
                left
                  ? 'md:-translate-x-8 md:translate-y-0'
                  : 'md:translate-x-8 md:translate-y-0'
              )
        )}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        <p className="font-display text-3xl font-semibold text-gold md:text-4xl">
          0{index + 1}
        </p>
        <h3 className="mt-3 font-display text-xl text-navy md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
          {body}
        </p>
      </div>
    </li>
  );
}
