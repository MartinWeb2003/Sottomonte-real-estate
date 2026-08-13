import { getGuides, getLocations } from '@sanity-config/lib/queries';
import { pickLocale, AGENCY } from '@/lib/utils';
import { SITE_URL } from '@/lib/seo';
import { localeUrl, routing } from '@/i18n/routing';
import type { Locale } from '@/types';

export const revalidate = 3600;

/**
 * /llms.txt — a plain-text map of the site for AI crawlers and assistants.
 *
 * Generated rather than checked in as a static file: villages and guides come
 * from the CMS, and a hand-maintained copy would be wrong within a month. The
 * convention is still informal and carries no guarantees, but it costs one
 * cached request an hour and the visitors that arrive through those tools
 * convert at a far higher rate than search traffic does.
 *
 * Croatian is listed as the canonical path because it is the default locale;
 * the other locales are named once rather than duplicating every entry.
 */
const LOCALE_NAMES_HR: Record<Locale, string> = {
  hr: 'hrvatskom',
  en: 'engleskom',
  de: 'njemačkom',
  pl: 'poljskom',
};

export async function GET() {
  const [locations, guides] = await Promise.all([getLocations(), getGuides()]);

  // Every URL through the same helper the pages use, so this file cannot drift
  // from the real, localised paths.
  const url = (route: Parameters<typeof localeUrl>[2], params?: Record<string, string>) =>
    localeUrl(SITE_URL, 'hr', route, params);

  const villageLines = locations.map((location) => {
    const name = pickLocale(location.name, 'hr');
    const tagline = pickLocale(location.tagline, 'hr');
    return `- [${name}](${url('/locations/[slug]', { slug: location.slug })})${tagline ? `: ${tagline}` : ''}`;
  });

  const guideLines = guides.map((guide) => {
    const title = pickLocale(guide.title, 'hr');
    const excerpt = pickLocale(guide.excerpt, 'hr');
    return `- [${title}](${url('/guides/[slug]', { slug: guide.slug })})${excerpt ? `: ${excerpt}` : ''}`;
  });

  // Typed as Record<Locale, string>, so adding a locale to `routing` without
  // naming it here is a compile error rather than a quietly wrong sentence.
  const languageSentence = routing.locales
    .map((l) => `${LOCALE_NAMES_HR[l as Locale]} (/${l})`)
    .join(', ')
    .replace(/, ([^,]*)$/, ' i $1');
  const otherPrefixes = routing.locales
    .filter((l) => l !== routing.defaultLocale)
    .map((l) => `/${l}`)
    .join(', ')
    .replace(/, ([^,]*)$/, ' ili $1');

  const body = `# ${AGENCY.name}

> Agencija za nekretnine na poluotoku Pelješcu u Hrvatskoj. Kuće, građevinska
> zemljišta, apartmani i kamene kuće za obnovu. Poznajemo svaku lokaciju,
> parcelu i vlasnika osobno, pa uz svaku nekretninu ide i pravi kontekst:
> stanje dokumentacije, karakter mjesta i razlog prodaje.

Sadržaj je dostupan na ${languageSentence}.
Putanje ispod navedene su na hrvatskom; zamijenite /hr s ${otherPrefixes} za
ostale jezične verzije.

## Glavne stranice

- [Nekretnine u ponudi](${url('/properties')}): sve dostupne nekretnine, s filtrima po mjestu, tipu, cijeni i udaljenosti od mora.
- [Kupnja nekretnine](${url('/buying')}): postupak kupnje, troškovi i porezi, uključujući pravila za strane državljane.
- [Prodaja nekretnine](${url('/selling')}): procjena vrijednosti, priprema dokumentacije i prodajni postupak.
- [Vodiči](${url('/guides')}): dubinski tekstovi o kupnji, prodaji i tržištu na Pelješcu.
- [Kontakt](${url('/contact')}): kontakt podaci i upit.

## Mjesta na Pelješcu

${villageLines.length ? villageLines.join('\n') : '- (u pripremi)'}

## Vodiči

${guideLines.length ? guideLines.join('\n') : '- (u pripremi)'}

## Kontakt

- E-mail: ${AGENCY.email}${AGENCY.phone ? `\n- Telefon: ${AGENCY.phone}` : ''}
- Adresa: ${AGENCY.address}, Hrvatska
- Jezici: hrvatski, engleski, njemački
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
