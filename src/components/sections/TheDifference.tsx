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
                    numbers used to put them. */}
                <div className="flex h-7 items-center">
                  <span
                    aria-hidden
                    className="block h-[14px] w-[14px] rounded-full bg-gold"
                  />
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
