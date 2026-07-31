import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { AGENCY, pickLocale, whatsappHref } from '@/lib/utils';
import type { Locale, Location } from '@/types';
import { NAV_ITEMS } from './navItems';
import { LOGOS } from '@/lib/images';

/**
 * Navy footer with gold hairline top. 4 columns:
 * brand | pages | locations (SEO links to village pages) | contact.
 */
export async function Footer({ locations }: { locations: Location[] }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  return (
    <footer className="border-t border-gold bg-navy text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-4 md:py-24">
        <div>
          <Image
            src={LOGOS.white.src}
            alt="Sottomonte"
            width={LOGOS.white.width}
            height={LOGOS.white.height}
            className="h-24 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {t('tagline')}
          </p>
          <div className="mt-6 flex gap-5 text-sm text-white/60">
            <a
              href={AGENCY.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Instagram
            </a>
            <a
              href={AGENCY.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Facebook
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-white/40">
            {t('pages')}
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-white/80 transition-colors hover:text-white"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-white/40">
            {t('locations')}
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {locations.slice(0, 8).map((loc) => (
              <li key={loc._id}>
                <Link
                  href={`/locations/${loc.slug}`}
                  className="text-white/80 transition-colors hover:text-white"
                >
                  {pickLocale(loc.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-white/40">
            {t('contact')}
          </p>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            <li>
              <a href={`tel:${AGENCY.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-white">
                {AGENCY.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappHref(AGENCY.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${AGENCY.email}`} className="transition-colors hover:text-white">
                {AGENCY.email}
              </a>
            </li>
            <li className="text-white/60">{AGENCY.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © Sottomonte {new Date().getFullYear()} · {t('rights')}
          </p>
          <p>{t('license')}</p>
        </div>
      </div>
    </footer>
  );
}
