import { getTranslations } from 'next-intl/server';
import { FadeUp } from '@/components/ui/FadeUp';
import type { Property } from '@/types';
import { PropertyCard } from './PropertyCard';

/** 3 cards: same village first, then same type / price range. */
export async function SimilarProperties({ properties }: { properties: Property[] }) {
  const t = await getTranslations('property');
  if (properties.length === 0) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <FadeUp>
          <h2 className="font-display text-3xl text-navy md:text-[40px]">
            {t('similar')}
          </h2>
        </FadeUp>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {properties.slice(0, 3).map((property, i) => (
            <FadeUp key={property._id} delay={i * 120}>
              <PropertyCard property={property} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
