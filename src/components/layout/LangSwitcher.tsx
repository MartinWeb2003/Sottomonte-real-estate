'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link, usePathname, routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LangSwitcher({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-xs font-medium tracking-wider',
        light ? 'text-white/70' : 'text-muted'
      )}
    >
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden>/</span>}
          <Link
            // @ts-expect-error — dynamic params are compatible at runtime
            href={{ pathname, params }}
            locale={l}
            className={cn(
              'uppercase transition-colors duration-300',
              l === locale
                ? light
                  ? 'text-white'
                  : 'text-gold'
                : light
                  ? 'hover:text-white'
                  : 'hover:text-navy'
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
