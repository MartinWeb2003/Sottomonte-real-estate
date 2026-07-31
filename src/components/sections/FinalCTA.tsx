import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { FadeUp } from '@/components/ui/FadeUp';
import { AGENCY, whatsappHref } from '@/lib/utils';

/**
 * THE shared final CTA — one component, used on every page.
 * Navy block, serif headline, gold button, phone + WhatsApp visible.
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
            <p className="text-sm text-white/70">
              {t('orCall')}{' '}
              <a
                href={`tel:${AGENCY.phone.replace(/\s/g, '')}`}
                className="font-medium text-white transition-colors hover:text-gold"
              >
                {AGENCY.phone}
              </a>
              {' · '}
              <a
                href={whatsappHref(AGENCY.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#25D366] transition-opacity hover:opacity-80"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
