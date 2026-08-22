import { FadeUp } from '@/components/ui/FadeUp';
import type { Property } from '@/types';
import { PropertyCard } from './PropertyCard';

/**
 * 3 / 2 / 1 column grid of property cards. Renders nothing when empty —
 * the page skips straight to the off-market CTA instead of showing a
 * "no results" message.
 *
 * `animate` exists because FadeUp starts hidden and only reveals once the
 * component has hydrated and an IntersectionObserver has fired. That is right
 * for a section a visitor scrolls down to, and wrong for the grid on the
 * properties page, which is the reason the page was opened: there the cards
 * would be absent from the server HTML and appear a beat late even when
 * already in view. Pass animate={false} wherever the grid is the main content.
 */
export function PropertyGrid({
  properties,
  animate = true,
}: {
  properties: Property[];
  animate?: boolean;
}) {
  if (properties.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, i) =>
        animate ? (
          <FadeUp key={property._id} delay={(i % 3) * 100}>
            <PropertyCard property={property} />
          </FadeUp>
        ) : (
          <PropertyCard key={property._id} property={property} />
        )
      )}
    </div>
  );
}
