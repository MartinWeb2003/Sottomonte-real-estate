'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { LangSwitcher } from './LangSwitcher';
import { MobileMenu } from './MobileMenu';
import { NAV_ITEMS, isActive } from './navItems';
import { LOGOS } from '@/lib/images';

/**
 * Transparent over the hero, solid warm-white once scrolled. Sticky.
 */
export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-yacht',
        solid ? 'bg-white shadow-[0_1px_0_0_rgba(14,42,71,0.08)]' : 'bg-transparent'
      )}
    >
      <div className="container-site flex h-20 items-center justify-between">
        <Link href="/" aria-label="Sottomonte" className="shrink-0">
          {/* The asset is a dark logo. Over the hero it is flipped to pure
              white (brightness-0 forces solid black, invert then makes it
              white); on the scrolled white bar it shows as-is. */}
          <Image
            src={LOGOS.navbar.src}
            alt="Sottomonte"
            width={LOGOS.navbar.width}
            height={LOGOS.navbar.height}
            priority
            className={cn(
              'h-11 w-auto transition-[filter] duration-500 ease-yacht md:h-[52px]',
              !solid && 'brightness-0 invert'
            )}
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                // One colour class per state on purpose. `cn` is a plain join,
                // not tailwind-merge, so emitting both text-navy and text-gold
                // leaves CSS source order to decide and navy silently wins.
                className={cn(
                  'text-sm font-medium tracking-wide transition-colors duration-300',
                  solid
                    ? active
                      ? 'text-gold'
                      : 'text-navy hover:text-gold'
                    : active
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
          {/* The direct-call link that used to sit here went with the agency
              phone number. Contact now runs through /contact and the forms. */}
          <LangSwitcher light={!solid} />
        </nav>

        <MobileMenu light={!solid} />
      </div>
    </header>
  );
}
