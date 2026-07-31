import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { HeroVideo } from '@/components/sections/HeroVideo';
import { IMAGES } from '@/lib/images';

/**
 * 100vh full-bleed hero: looping drone shot over Lovište, navy scrim,
 * content bottom-LEFT, thin scroll indicator bottom-right.
 *
 * The poster image is the LCP element and always renders; HeroVideo fades in
 * on top of it once it can play, and stays away entirely under
 * prefers-reduced-motion. The Ken Burns zoom is the fallback motion for that
 * case and for anyone whose video never loads.
 */
export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 ken-burns">
        <Image
          src={IMAGES.heroPoster}
          alt="Drone view of the coastline at Lovište on the Pelješac peninsula"
          fill
          priority
          className="object-cover brightness-[0.85]"
          sizes="100vw"
        />
      </div>
      <HeroVideo />
      <div className="hero-scrim absolute inset-0" />

      <div className="container-site relative flex h-full items-end pb-24 md:pb-28">
        <div className="max-w-2xl">
          <h1 className="text-shadow-hero font-display text-[40px] leading-[1.08] text-white md:text-7xl">
            {t('titleLead')}{' '}
            <span className="text-gold">{t('titleItalic')}</span>
          </h1>
          <p className="text-shadow-hero mt-6 max-w-[480px] text-base leading-relaxed text-white/85 md:text-lg">
            {t('subline')}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/properties" variant="white">
              {t('ctaProperties')}
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost-white">
              {t('ctaContact')}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 right-10 hidden pb-8 md:block"
      >
        <div className="h-16 w-px bg-white/40" />
      </div>
    </section>
  );
}
