'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Fade-up on scroll: 30px, 700ms, ease-out. Pure IntersectionObserver +
 * CSS — no animation library. Respects prefers-reduced-motion (handled
 * in globals.css).
 */
export function FadeUp({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  spotlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** stagger delay in ms */
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
  /**
   * Soft navy glow that follows the cursor inside this element, clipped to its
   * own box so a cursor near a corner only lights that corner. Pointer coords
   * are written straight to CSS custom properties, never to React state, so
   * mousemove never triggers a re-render.
   */
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref as never}
      className={cn('fade-up', spotlight && 'spotlight', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      onMouseMove={spotlight ? onMouseMove : undefined}
    >
      {spotlight && <span aria-hidden className="spotlight-glow" />}
      {children}
    </Tag>
  );
}
