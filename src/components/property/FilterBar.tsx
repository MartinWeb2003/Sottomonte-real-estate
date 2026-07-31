'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Chip } from '@/components/ui/Chip';
import { cn, pickLocale } from '@/lib/utils';
import { formatPrice } from '@/lib/formatters';
import type { Locale, Location } from '@/types';

const TYPES = ['house', 'apartment', 'land', 'stone-ruin'] as const;
const SEA_BUCKETS = [100, 500, 1000] as const;
const PRICE_BUCKETS = [150000, 300000, 500000, 1000000] as const;
const SORTS = ['newest', 'price-asc', 'price-desc'] as const;

/** Native select stripped back, with our own chevron drawn beside it. */
const SELECT_CLASS =
  'w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-sm font-medium text-navy focus:outline-none';

function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      className="pointer-events-none absolute right-0 top-1/2 h-2 w-3 -translate-y-1/2 text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 1.5 6 6.5 11 1.5" />
    </svg>
  );
}

/** One labelled cell of the search bar. */
function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0 flex-1 px-5 py-3.5', className)}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-eyebrow text-muted">
        {label}
      </p>
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * Sticky search bar under the navbar. ALL state lives in URL searchParams
 * (?location=viganj&type=land) so results are shareable, SEO-friendly, and
 * the homepage village tiles can deep-link straight into a filtered grid.
 */
export function FilterBar({
  locations,
  resultsCount,
}: {
  locations: Location[];
  resultsCount: number;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('properties');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedLocations = useMemo(
    () => searchParams.get('location')?.split(',').filter(Boolean) ?? [],
    [searchParams]
  );

  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') params.delete(key);
        else params.set(key, value);
      }
      params.delete('page'); // filter changes reset pagination
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}` as never, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams]
  );

  const toggleLocation = (slug: string) => {
    const next = selectedLocations.includes(slug)
      ? selectedLocations.filter((s) => s !== slug)
      : [...selectedLocations, slug];
    setParams({ location: next.length ? next.join(',') : null });
  };

  const type = searchParams.get('type');
  const maxPrice = searchParams.get('maxPrice');
  const sea = searchParams.get('sea');

  const activeChips: Array<{ key: string; label: string; remove: () => void }> = [];
  for (const slug of selectedLocations) {
    const loc = locations.find((l) => l.slug === slug);
    activeChips.push({
      key: `loc-${slug}`,
      label: loc ? pickLocale(loc.name, locale) : slug,
      remove: () => toggleLocation(slug),
    });
  }
  if (type && TYPES.includes(type as (typeof TYPES)[number])) {
    activeChips.push({
      key: 'type',
      label: t(`types.${type as (typeof TYPES)[number]}`),
      remove: () => setParams({ type: null }),
    });
  }
  if (maxPrice) {
    activeChips.push({
      key: 'maxPrice',
      label: t('filters.priceUpTo', { price: formatPrice(Number(maxPrice)) }),
      remove: () => setParams({ maxPrice: null }),
    });
  }
  if (sea) {
    activeChips.push({
      key: 'sea',
      label: Number(sea) >= 1000 ? t('filters.under1km') : `< ${sea} m`,
      remove: () => setParams({ sea: null }),
    });
  }

  // No location field in the bar (removed on request). The ?location= param
  // still works — village pages and the footer deep-link into the filtered
  // grid — and shows up as a removable chip below the bar.
  const typeField = (
    <Field label={t('filters.type')}>
      <select
        aria-label={t('filters.type')}
        className={SELECT_CLASS}
        value={type ?? ''}
        onChange={(e) => setParams({ type: e.target.value || null })}
      >
        <option value="">{t('filters.allTypes')}</option>
        {TYPES.map((value) => (
          <option key={value} value={value}>
            {t(`types.${value}`)}
          </option>
        ))}
      </select>
      <Chevron />
    </Field>
  );

  const priceField = (
    <Field label={t('filters.price')}>
      <select
        aria-label={t('filters.price')}
        className={SELECT_CLASS}
        value={maxPrice ?? ''}
        onChange={(e) => setParams({ maxPrice: e.target.value || null })}
      >
        <option value="">{t('filters.anyPrice')}</option>
        {PRICE_BUCKETS.map((value) => (
          <option key={value} value={value}>
            {t('filters.priceUpTo', { price: formatPrice(value) })}
          </option>
        ))}
      </select>
      <Chevron />
    </Field>
  );

  const seaField = (
    <Field label={t('filters.seaDistance')}>
      <select
        aria-label={t('filters.seaDistance')}
        className={SELECT_CLASS}
        value={sea ?? ''}
        onChange={(e) => setParams({ sea: e.target.value || null })}
      >
        <option value="">{t('filters.anyDistance')}</option>
        {SEA_BUCKETS.map((value) => (
          <option key={value} value={value}>
            {value >= 1000 ? t('filters.under1km') : `< ${value} m`}
          </option>
        ))}
      </select>
      <Chevron />
    </Field>
  );

  const sortField = (
    <Field label={t('filters.sort')} className="md:max-w-[190px]">
      <select
        aria-label={t('filters.sort')}
        className={SELECT_CLASS}
        value={searchParams.get('sort') ?? 'newest'}
        onChange={(e) =>
          setParams({ sort: e.target.value === 'newest' ? null : e.target.value })
        }
      >
        {SORTS.map((value) => (
          <option key={value} value={value}>
            {t(
              `filters.${
                value === 'newest'
                  ? 'sortNewest'
                  : value === 'price-asc'
                    ? 'sortPriceAsc'
                    : 'sortPriceDesc'
              }`
            )}
          </option>
        ))}
      </select>
      <Chevron />
    </Field>
  );

  // Not sticky on purpose: a bar following the scroll kept covering the
  // off-market CTA at the bottom of the page, the highest-value element.
  return (
    <div className="relative z-40 border-b border-navy/10 bg-white">
      <div className="container-site py-5">
        {/* Desktop: one segmented bar */}
        <div className="hidden md:block">
          <div className="flex items-stretch divide-x divide-navy/15 border border-navy/15">
            {typeField}
            {priceField}
            {seaField}
            {sortField}
          </div>
        </div>

        {/* Mobile: trigger opens a slide-over */}
        <div className="flex items-center justify-between gap-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 border border-navy/20 px-5 py-3 text-sm font-medium text-navy"
          >
            {t('filters.button')}
            {activeChips.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[11px] text-white">
                {activeChips.length}
              </span>
            )}
          </button>
          <span className="text-sm font-medium text-navy">
            {t('results', { count: resultsCount })}
          </span>
        </div>

        {/* Active filters + result count */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <Chip key={chip.key} onRemove={chip.remove}>
                {chip.label}
              </Chip>
            ))}
            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setParams({
                    location: null,
                    type: null,
                    maxPrice: null,
                    sea: null,
                    sort: null,
                  })
                }
                className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-navy"
              >
                {t('filters.clearAll')}
              </button>
            )}
          </div>
          <span className="hidden text-sm font-medium text-navy md:inline">
            {t('results', { count: resultsCount })}
          </span>
        </div>
      </div>

      {/* Mobile slide-over */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-navy/40 transition-opacity duration-300 md:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={cn(
            'absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-white transition-transform duration-500 ease-yacht',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-navy/10 px-6 py-5">
            <p className="text-sm font-semibold uppercase tracking-eyebrow text-navy">
              {t('filters.button')}
            </p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={t('filters.apply')}
              className="p-2 text-xl leading-none text-muted"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col divide-y divide-navy/10">
            {typeField}
            {priceField}
            {seaField}
            {sortField}
          </div>

          <div className="mt-auto border-t border-navy/10 p-6">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-full bg-navy px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-navy-soft"
            >
              {t('filters.apply')} · {t('results', { count: resultsCount })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
