import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { FadeUp } from '@/components/ui/FadeUp';

/**
 * THE shared final CTA — one component, used on every page.
 * Navy block, serif headline, gold button.
 *
 * The phone and WhatsApp row that used to sit under the button was removed
 * with the agency phone number. If a business number ever arrives, this is
 * where "or call us directly" belongs.
 */
export async function FinalCTA() {
  const t = await getTranslations('finalCta');

  return (
    <section className="section-pad bg-navy">
      <FadeUp className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-tight text-white md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-5 text-base text-white/70 md:text-lg">
            {t('subtitle')}
          </p>
          <div className="mt-10 flex flex-col items-center gap-6">
            <ButtonLink href="/contact" variant="white">
              {t('button')}
            </ButtonLink>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
