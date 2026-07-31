import { getLocale, getTranslations } from 'next-intl/server';
import { formatArea, formatSeaDistance } from '@/lib/formatters';
import { pickLocale } from '@/lib/utils';
import type { Locale, Property } from '@/types';

/**
 * 2×4 spec grid with thin-line navy icons: m², land, bedrooms, bathrooms,
 * floors, condition, sea distance, parking.
 */
export async function SpecGrid({ property }: { property: Property }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('property.specs');

  const specs: Array<{ icon: React.ReactNode; label: string; value: string }> = [];

  const icon = (path: React.ReactNode) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-navy"
      aria-hidden
    >
      {path}
    </svg>
  );

  if (property.area)
    specs.push({
      icon: icon(<><rect x="4" y="4" width="16" height="16" /><path d="M4 9h16M9 4v16" /></>),
      label: t('area'),
      value: formatArea(property.area),
    });
  if (property.landArea)
    specs.push({
      icon: icon(<><path d="M3 20l4-14 6 3 5-5 3 16z" /></>),
      label: t('landArea'),
      value: formatArea(property.landArea),
    });
  if (property.bedrooms)
    specs.push({
      icon: icon(<><path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6" /><path d="M3 18h18M6 10V7a1 1 0 011-1h10a1 1 0 011 1v3" /></>),
      label: t('bedrooms'),
      value: String(property.bedrooms),
    });
  if (property.bathrooms)
    specs.push({
      icon: icon(<><path d="M4 12h16v2a5 5 0 01-5 5H9a5 5 0 01-5-5v-2z" /><path d="M6 12V6a2 2 0 012-2h1" /></>),
      label: t('bathrooms'),
      value: String(property.bathrooms),
    });
  if (property.floors)
    specs.push({
      icon: icon(<><path d="M4 20h16M4 20V8l8-5 8 5v12" /><path d="M4 14h16" /></>),
      label: t('floors'),
      value: String(property.floors),
    });
  const condition = pickLocale(property.yearOrCondition, locale);
  if (condition)
    specs.push({
      icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>),
      label: t('condition'),
      value: condition,
    });
  if (property.seaDistance != null)
    specs.push({
      icon: icon(<><path d="M3 15c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" /><path d="M3 19c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" /></>),
      label: t('seaDistance'),
      value: formatSeaDistance(property.seaDistance),
    });
  if (property.parking != null)
    specs.push({
      icon: icon(<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 16V8h4a2.5 2.5 0 010 5H9" /></>),
      label: t('parking'),
      value: property.parking ? t('parkingYes') : t('parkingNo'),
    });

  if (specs.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
      {specs.slice(0, 8).map((spec) => (
        <div key={spec.label}>
          {spec.icon}
          <dt className="mt-3 text-xs uppercase tracking-wider text-muted">
            {spec.label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
