import { getLocale, getTranslations } from 'next-intl/server';
import { FadeUp } from '@/components/ui/FadeUp';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { VillageTile } from '@/components/ui/VillageTile';
import type { Locale, Location } from '@/types';

/**
 * Navy section, white text: grid of six village tiles (photo, name, tagline),
 * each linking to the village landing page at /locations/[slug].
 *
 * Which six is a content decision, not an alphabetical accident. The filter
 * comes before the cap on purpose: locations are ordered by name, so a bare
 * `slice(0, 6)` would have silently dropped Viganj the moment Postup sorted
 * into the list. Opting a location out here leaves its page, its footer link
 * and its sitemap entry untouched.
 */
export async function PeninsulaSection({ locations }: { locations: Location[] }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('peninsula');
  if (locations.length === 0) return null;

  return (
    <section className="section-pad bg-navy">
      <div className="container-site">
        <FadeUp>
          <SectionHeader dark title={t('title')} subtitle={t('subtitle')} />
        </FadeUp>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {locations
            .filter((loc) => loc.showOnHomepage !== false)
            .slice(0, 6)
            .map((loc, i) => (
              <FadeUp key={loc._id} delay={(i % 3) * 100}>
                <VillageTile location={loc} locale={locale} />
              </FadeUp>
            ))}
        </div>
      </div>
    </section>
  );
}
