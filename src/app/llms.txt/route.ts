import { getGuides, getLocations } from '@sanity-config/lib/queries';
import { pickLocale, AGENCY } from '@/lib/utils';
import { SITE_URL } from '@/lib/seo';

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
 * the /en and /de mirrors are named once rather than duplicating every entry.
 */
export async function GET() {
  const [locations, guides] = await Promise.all([getLocations(), getGuides()]);

  const villageLines = locations.map((location) => {
    const name = pickLocale(location.name, 'hr');
    const tagline = pickLocale(location.tagline, 'hr');
    return `- [${name}](${SITE_URL}/hr/locations/${location.slug})${tagline ? `: ${tagline}` : ''}`;
  });

  const guideLines = guides.map((guide) => {
    const title = pickLocale(guide.title, 'hr');
    const excerpt = pickLocale(guide.excerpt, 'hr');
    return `- [${title}](${SITE_URL}/hr/guides/${guide.slug})${excerpt ? `: ${excerpt}` : ''}`;
  });

  const body = `# ${AGENCY.name}

> Agencija za nekretnine na poluotoku Pelješcu u Hrvatskoj. Kuće, građevinska
> zemljišta, apartmani i kamene kuće za obnovu. Poznajemo svaku lokaciju,
> parcelu i vlasnika osobno, pa uz svaku nekretninu ide i pravi kontekst:
> stanje dokumentacije, karakter mjesta i razlog prodaje.

Sadržaj je dostupan na hrvatskom (/hr), engleskom (/en) i njemačkom (/de).
Putanje ispod navedene su na hrvatskom; zamijenite /hr s /en ili /de za ostale
jezične verzije.

## Glavne stranice

- [Nekretnine u ponudi](${SITE_URL}/hr/properties): sve dostupne nekretnine, s filtrima po mjestu, tipu, cijeni i udaljenosti od mora.
- [Kupnja nekretnine](${SITE_URL}/hr/buying): postupak kupnje, troškovi i porezi, uključujući pravila za strane državljane.
- [Prodaja nekretnine](${SITE_URL}/hr/selling): procjena vrijednosti, priprema dokumentacije i prodajni postupak.
- [Vodiči](${SITE_URL}/hr/guides): dubinski tekstovi o kupnji, prodaji i tržištu na Pelješcu.
- [Kontakt](${SITE_URL}/hr/contact): kontakt podaci i upit.

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
