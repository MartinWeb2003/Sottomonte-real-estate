'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { FaqItem } from './FaqSection';

/**
 * Accordion with three behaviours the native <details> version could not give:
 * only one answer open at a time, an animated open/close, and a section whose
 * total height never changes.
 *
 * Height stability: the container reserves `closed height + tallest answer`
 * once on mount. Since only one answer can be open, the list can never exceed
 * that, so opening a short answer simply leaves empty space below instead of
 * the page reflowing. Everything below the FAQ therefore stays put.
 *
 * The open/close itself animates via grid-template-rows 0fr -> 1fr, which
 * transitions smoothly without anyone having to know the answer's pixel
 * height. `overflow: hidden` on the inner element is what makes that work.
 *
 * Trade-off vs the old markup: <details> worked with JS disabled. Buttons with
 * aria-expanded do not, but they are the standard accessible accordion and are
 * the only way to get exclusivity plus animation reliably across browsers.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [minHeight, setMinHeight] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Measure against the closed layout, so a reserve set on a previous pass
    // is never counted twice.
    const previous = container.style.minHeight;
    container.style.minHeight = '';
    const closedHeight = container.getBoundingClientRect().height;
    container.style.minHeight = previous;

    const tallestAnswer = answerRefs.current.reduce(
      (max, el) => Math.max(max, el?.scrollHeight ?? 0),
      0
    );
    setMinHeight(Math.ceil(closedHeight + tallestAnswer));
  }, []);

  useEffect(() => {
    measure();
    // Answer heights change with the column width, so re-measure on resize.
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [measure]);

  return (
    <div
      ref={containerRef}
      // Measured on mount; before that the list simply sizes to its content.
      style={minHeight ? { minHeight } : undefined}
      className="mt-12 border-b border-navy/10 md:mt-16"
    >
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="border-t border-navy/10">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-baseline justify-between gap-6 py-5 text-left text-base font-medium text-navy transition-colors hover:text-navy-soft md:text-lg"
              >
                {item.question}
                <span
                  aria-hidden
                  className={cn(
                    'shrink-0 text-xl font-normal text-gold transition-transform duration-300 ease-yacht',
                    isOpen && 'rotate-45'
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              className={cn(
                // duration-300, not 400: Tailwind's default scale has no 400
                // and the class would silently emit nothing.
                'grid transition-[grid-template-rows] duration-300 ease-yacht motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div
                ref={(el) => {
                  answerRefs.current[i] = el;
                }}
                className="overflow-hidden"
              >
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted md:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
