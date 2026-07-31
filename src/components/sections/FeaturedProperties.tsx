import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { FadeUp } from '@/components/ui/FadeUp';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Property } from '@/types';

/**
 * White section: H2 left, "View all →" gold text-link right,
 * 3 property cards (featured=true).
 */
export async function FeaturedProperties({
  properties,
}: {
  properties: Property[];
}) {
  const t = await getTranslations('featured');
  if (properties.length === 0) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <FadeUp>
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl text-navy md:text-[40px]">
              {t('title')}
            </h2>
            <Link
              href="/properties"
              className="whitespace-nowrap pb-1 text-sm font-medium text-gold transition-colors hover:text-navy"
            >
              {t('viewAll')} →
            </Link>
          </div>
        </FadeUp>
        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
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
