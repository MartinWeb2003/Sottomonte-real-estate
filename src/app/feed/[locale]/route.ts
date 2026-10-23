import { getGuideFeedEntries } from '@sanity-config/lib/queries';
import { pickLocale, AGENCY } from '@/lib/utils';
import { SITE_URL } from '@/lib/seo';
import { localeUrl, routing } from '@/i18n/routing';
import type { Locale } from '@/types';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * RSS 2.0 feed of the guides, one per locale.
 *
 * The point is repurposing rather than reach in itself. A feed is what lets a
 * single guide become a newsletter issue, a syndicated post or an item in
 * someone else's roundup without anyone re-keying it, and it is the standard
 * way an aggregator or a local community site picks up new articles. That is
 * also the cheapest kind of inbound link there is: one someone else creates.
 *
 * Per locale, not one combined feed. A subscriber wants one language, and a
 * feed that alternates Croatian and German is one nobody keeps.
 *
 * Only guides genuinely written in the locale appear, using the same coverage
 * rule as the sitemap and the hreflang set. A German feed carrying Croatian
 * articles under German titles would be the fallback chain leaking into
 * someone else's inbox.
 */
const FEED_TITLE: Record<Locale, string> = {
  hr: 'Sottomonte, vodiči o nekretninama na Pelješcu',
  en: 'Sottomonte, guides to property on Pelješac',
  de: 'Sottomonte, Ratgeber zu Immobilien auf Pelješac',
  pl: 'Sottomonte, poradniki o nieruchomościach na Peljeszacu',
};

const FEED_DESCRIPTION: Record<Locale, string> = {
  hr: 'Vodiči o kupnji, prodaji i životu na poluotoku Pelješcu, iz prve ruke.',
  en: 'First hand guides to buying, selling and living on the Pelješac peninsula.',
  de: 'Ratgeber aus erster Hand zu Kauf, Verkauf und Leben auf der Halbinsel Pelješac.',
  pl: 'Poradniki z pierwszej ręki o kupnie, sprzedaży i życiu na półwyspie Peljeszac.',
};

/**
 * The five XML predefined entities.
 *
 * Croatian and Polish text is full of characters that are perfectly legal in
 * XML and only these five are not, so this escapes exactly those and leaves
 * the diacritics alone under the UTF-8 declaration.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RFC 822, which is what RSS requires. `toUTCString` produces exactly that. */
function rfc822(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toUTCString();
}

export async function GET(
  _request: Request,
  { params }: { params: { locale: string } }
) {
  const locale = params.locale as Locale;
  if (!routing.locales.includes(locale)) {
    return new Response('Not found', { status: 404 });
  }

  const entries = await getGuideFeedEntries();

  const guides = entries.filter((guide) => {
    const covered = routing.locales.filter(
      (l) => guide.coverage?.[l as Locale]
    );
    // Same fail-open rule as everywhere else: a guide with no coverage data at
    // all is published rather than silently dropped from every feed.
    return covered.length === 0 || covered.includes(locale);
  });

  const feedUrl = `${SITE_URL}/feed/${locale}`;
  const guidesUrl = localeUrl(SITE_URL, locale, '/guides');

  const items = guides
    .map((guide) => {
      const url = localeUrl(SITE_URL, locale, '/guides/[slug]', {
        slug: guide.slug,
      });
      const title = pickLocale(guide.title, locale);
      const excerpt = pickLocale(guide.excerpt, locale);
      const published = rfc822(guide.publishedAt);

      return [
        '    <item>',
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        // The URL is a stable permalink, so it doubles as the guid. A reader
        // uses this to decide whether an item is new.
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        excerpt ? `      <description>${escapeXml(excerpt)}</description>` : null,
        published ? `      <pubDate>${published}</pubDate>` : null,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const lastBuild =
    rfc822(guides[0]?.updatedAt || guides[0]?.publishedAt) ??
    new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE[locale])}</title>
    <link>${escapeXml(guidesUrl)}</link>
    <description>${escapeXml(FEED_DESCRIPTION[locale])}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <managingEditor>${escapeXml(AGENCY.email)} (${escapeXml(AGENCY.name)})</managingEditor>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // Matches the hourly revalidate above, with a stale window so a reader
      // polling during a rebuild still gets the previous feed rather than a
      // cold miss.
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
