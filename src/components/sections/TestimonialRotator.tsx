'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  quote: string;
  author: string;
  origin: string;
}

const ROTATE_MS = 8000;

/** Slow auto-fade between quotes. Single quote renders statically. */
export function TestimonialRotator({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [items.length]);

  const current = items[index];

  return (
    <figure aria-live="polite">
      <span aria-hidden className="font-display text-6xl leading-none text-gold">
        &ldquo;
      </span>
      <div className="relative">
        {items.map((item, i) => (
          <blockquote
            key={item.id}
            className={cn(
              'transition-opacity duration-1000 ease-yacht',
              i === index
                ? 'opacity-100'
                : 'pointer-events-none absolute inset-0 opacity-0'
            )}
            aria-hidden={i !== index}
          >
            <p className="font-display text-xl leading-relaxed text-white md:text-[28px] md:leading-[1.5]">
              {item.quote}
            </p>
          </blockquote>
        ))}
      </div>
      <figcaption className="mt-8 text-sm text-white/60">
        <span className="font-medium text-white">{current.author}</span>
        {current.origin && <span> · {current.origin}</span>}
      </figcaption>
    </figure>
  );
}
