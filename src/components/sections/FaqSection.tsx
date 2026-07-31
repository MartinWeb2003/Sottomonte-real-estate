import { FadeUp } from '@/components/ui/FadeUp';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Accordion built on native <details>, so it works without JS and stays a
 * server component. Separation via hairlines, no boxes (design rule).
 * The page that renders this must also render `faqJsonLd(items)` so the
 * FAQPage structured data always matches the visible text.
 */
export function FaqSection({
  title,
  items,
  centered = false,
}: {
  title: string;
  items: FaqItem[];
  /** Centres the block in the container. Text stays left-aligned inside it,
      so this stays clear of the centered-everything anti-pattern. */
  centered?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <div className={cn('max-w-3xl', centered && 'mx-auto')}>
          <FadeUp>
            <SectionHeader title={title} />
          </FadeUp>
          <FadeUp delay={120}>
            <div className="mt-12 border-b border-navy/10 md:mt-16">
              {items.map((item) => (
                <details key={item.question} className="group border-t border-navy/10">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-base font-medium text-navy transition-colors hover:text-navy-soft md:text-lg [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span
                      aria-hidden
                      className="shrink-0 text-xl font-normal text-gold transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted md:text-base">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
