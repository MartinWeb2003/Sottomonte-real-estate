import { getTranslations } from 'next-intl/server';
import { FadeUp } from '@/components/ui/FadeUp';
import { HairlineDivider } from '@/components/ui/HairlineDivider';

/**
 * The merged philosophy section: the intro statement leads (display type,
 * regular weight), the three concrete proof columns follow. This absorbed the
 * former IntroStatement component so the home page carries exactly one
 * philosophy block before the rest.
 */
export async function TheDifference() {
  const t = await getTranslations('difference');
  const tIntro = await getTranslations('intro');
  const items = [0, 1, 2] as const;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <FadeUp>
          <div className="mx-auto max-w-[720px] text-center">
            <HairlineDivider width="w-[60px]" className="mx-auto mb-10" />
            <p className="font-display text-2xl leading-snug text-navy md:text-[40px] md:leading-[1.25]">
              {tIntro('statement')}
            </p>
            <p className="mt-8 text-base leading-relaxed text-muted md:text-lg">
              {tIntro('body')}
            </p>
          </div>
        </FadeUp>
        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
          {items.map((i) => (
            <FadeUp key={i} delay={i * 120}>
              <div className="border-t border-gold pt-8">
                {/* Replaces the 01/02/03 numerals. The h-7 wrapper keeps the
                    old line box, so the titles below sit exactly where the
                    numbers used to put them.

                    Outlined circle with a tick rather than a solid dot: the
                    dot was decoration, the tick reads as "we actually do
                    this", which is what these three columns are claiming.
                    Drawn as an inline SVG so the stroke stays a true hairline
                    at any size and inherits the gold via currentColor. */}
                <div className="flex h-7 items-center">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-gold"
                  >
                    <circle cx="12" cy="12" r="10.5" />
                    <path d="M7.5 12.4l3 3 6-6.4" />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-2xl text-navy">
                  {t(`items.${i}.title`)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  {t(`items.${i}.body`)}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
