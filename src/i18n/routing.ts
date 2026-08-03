import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['hr', 'en', 'de'],
  defaultLocale: 'hr',
  localePrefix: 'always',
  /**
   * Off on purpose. next-intl detects the browser's Accept-Language by
   * default, which sent every German visitor to /de and every English one to
   * /en, so `defaultLocale` only ever applied to languages we do not publish.
   * Everyone now lands on Croatian and switches via the HR/EN/DE control.
   *
   * Trade-off worth remembering: the DE/AT/CH audience no longer gets German
   * automatically. Set this back to true to restore that.
   */
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
