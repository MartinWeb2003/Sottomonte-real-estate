import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { FadeUp } from '@/components/ui/FadeUp';
import { IMAGES } from '@/lib/images';

/**
 * White 50/50 split: detail photo (stone wall / old door) left,
 * off-market pitch right.
 */
export async function OffMarketTeaser() {
  const t = await getTranslations('offMarket');

  return (
    <section className="section-pad bg-white">
      <div className="container-site grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <FadeUp className="img-hover-zoom relative order-2 aspect-[4/5] overflow-hidden md:order-1">
          <Image
            src={IMAGES.offMarketDetail}
            alt="Old stone wall with a navy wooden door on Pelješac"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </FadeUp>
        <FadeUp className="order-1 md:order-2" delay={150}>
          <h2 className="max-w-lg font-display text-3xl leading-tight text-navy md:text-[40px] md:leading-[1.15]">
            {t('title')}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
            {t('body')}
          </p>
          {/* Deep-link to the buyer-wishlist form: the teaser's promise and
              that form are the same ask, so land the visitor on it directly. */}
          <ButtonLink href={{ pathname: '/properties', hash: 'wishlist' }} variant="ghost-navy" className="mt-9">
            {t('cta')}
          </ButtonLink>
        </FadeUp>
      </div>
    </section>
  );
}
