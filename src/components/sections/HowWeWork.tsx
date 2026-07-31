import { getTranslations } from 'next-intl/server';
import { FadeUp } from '@/components/ui/FadeUp';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * White section: 4 steps on a thin gold connecting line.
 */
export async function HowWeWork() {
  const t = await getTranslations('howWeWork');
  const steps = [0, 1, 2, 3] as const;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <FadeUp>
          <SectionHeader title={t('title')} />
        </FadeUp>
        <div className="relative mt-14 md:mt-20">
          {/* the connecting gold line */}
          <div
            aria-hidden
            className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-gold md:left-0 md:top-[7px] md:h-px md:w-full"
          />
          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((i) => (
              <FadeUp key={i} as="li" delay={i * 120} className="relative pl-8 md:pl-0 md:pt-10">
                <span
                  aria-hidden
                  className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border border-gold bg-white md:top-0"
                />
                <p className="font-display text-lg text-gold">0{i + 1}</p>
                <h3 className="mt-2 font-display text-xl text-navy">
                  {t(`steps.${i}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {t(`steps.${i}.body`)}
                </p>
              </FadeUp>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
