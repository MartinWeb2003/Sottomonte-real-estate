import { getLocale } from 'next-intl/server';
import { FadeUp } from '@/components/ui/FadeUp';
import { pickLocale } from '@/lib/utils';
import type { Locale, Testimonial } from '@/types';
import { TestimonialRotator } from './TestimonialRotator';

/**
 * Stone section: one large serif quote (~28px) centered, gold quote
 * ornament, attribution with origin. Multiple quotes auto-fade slowly —
 * no arrows, no dots.
 */
export async function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const locale = (await getLocale()) as Locale;
  if (testimonials.length === 0) return null;

  const items = testimonials
    .map((item) => ({
      id: item._id,
      quote: pickLocale(item.quote, locale),
      author: item.authorName,
      origin: item.authorOrigin ?? '',
    }))
    .filter((item) => item.quote);

  if (items.length === 0) return null;

  return (
    <section className="section-pad bg-navy">
      <FadeUp className="container-site">
        <div className="mx-auto max-w-[800px] text-center">
          <TestimonialRotator items={items} />
        </div>
      </FadeUp>
    </section>
  );
}
