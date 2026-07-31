import { FadeUp } from '@/components/ui/FadeUp';
import type { Property } from '@/types';
import { PropertyCard } from './PropertyCard';

/**
 * 3 / 2 / 1 column grid of property cards. Renders nothing when empty —
 * the page skips straight to the off-market CTA instead of showing a
 * "no results" message.
 */
export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, i) => (
        <FadeUp key={property._id} delay={(i % 3) * 100}>
          <PropertyCard property={property} />
        </FadeUp>
      ))}
    </div>
  );
}
