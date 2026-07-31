'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, isActive } from './navItems';
import { LOGOS } from '@/lib/images';
import { LangSwitcher } from './LangSwitcher';

export function MobileMenu({ light = false }: { light?: boolean }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative z-[60] flex h-10 w-10 flex-col items-end justify-center gap-1.5"
      >
        <span
          className={cn(
            'h-px w-6 transition-all duration-300',
            open ? 'translate-y-[3.5px] rotate-45 bg-white' : light ? 'bg-white' : 'bg-navy'
          )}
        />
        <span
          className={cn(
            'h-px transition-all duration-300',
            open ? 'w-6 -translate-y-[3.5px] -rotate-45 bg-white' : 'w-4',
            !open && (light ? 'bg-white' : 'bg-navy')
          )}
        />
      </button>

      <div
        className={cn(
          'fixed inset-0 z-50 flex flex-col justify-between bg-navy px-6 pb-10 pt-28 transition-opacity duration-500 ease-yacht',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <nav className="flex flex-col gap-6">
          {/* White + gold logo on the navy overlay. self-start opts out of the
              flex column's default align-items: stretch, which would otherwise
              force the image full-width and distort its aspect ratio. */}
          <Image
            src={LOGOS.full.src}
            alt="Sottomonte"
            width={LOGOS.full.width}
            height={LOGOS.full.height}
            className="mb-4 h-24 w-auto self-start"
          />
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                // Current page reads as full white against dimmed siblings.
                // Gold would be the obvious pick but the overlay logo already
                // carries a gold frame, and one gold element per viewport wins.
                className={cn(
                  'font-display text-3xl transition-colors',
                  active ? 'text-white' : 'text-white/60 hover:text-gold'
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <LangSwitcher light />
      </div>
    </div>
  );
}
