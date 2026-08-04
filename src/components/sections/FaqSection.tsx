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
  animate = true,
}: {
  title: string;
  items: FaqItem[];
  /** Centres the block in the container. Text stays left-aligned inside it,
      so this stays clear of the centered-everything anti-pattern. */
  centered?: boolean;
  /**
   * Scroll reveal, on by default. Turned off where this sits inside something
   * being read straight through, such as a guide: content sliding in under the
   * cursor is fine on a landing page you are scanning and a distraction in the
   * middle of an article.
   */
  animate?: boolean;
}) {
  if (items.length === 0) return null;

  const Reveal = animate ? FadeUp : Static;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <div className={cn('max-w-3xl', centered && 'mx-auto')}>
          <Reveal>
            <SectionHeader title={title} />
          </Reveal>
          <Reveal delay={120}>
            <FaqList items={items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Same shape as FadeUp, without the reveal. Keeps the markup identical. */
function Static({ children }: { children: React.ReactNode; delay?: number }) {
  return <div>{children}</div>;
}
