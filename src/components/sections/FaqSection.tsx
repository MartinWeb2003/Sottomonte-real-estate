import { FadeUp } from '@/components/ui/FadeUp';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FaqList } from './FaqList';
import { cn } from '@/lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Section wrapper: heading stays server-rendered, the interactive list is a
 * client component (see FaqList for the open/close behaviour).
 * Separation via hairlines, no boxes (design rule).
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
            <FaqList items={items} />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
