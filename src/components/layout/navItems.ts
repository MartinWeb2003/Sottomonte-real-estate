/** Shared between Navbar (client), MobileMenu (client) and Footer (server). */
export const NAV_ITEMS = [
  { key: 'home', href: '/' },
  { key: 'properties', href: '/properties' },
  { key: 'buying', href: '/buying' },
  { key: 'selling', href: '/selling' },
  { key: 'contact', href: '/contact' },
] as const;

/** "/" would match every path under startsWith, so home needs an exact test. */
export function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  // Village pages sit at /locations/{slug} but belong to the Properties
  // section as far as the visitor is concerned, so keep that item lit.
  if (href === '/properties' && pathname.startsWith('/locations')) return true;
  return pathname.startsWith(href);
}
