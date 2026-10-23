import type { StructureResolver } from 'sanity/structure';

/**
 * Studio navigation, plus a Translations section that answers one question the
 * default Studio cannot: what have we published that is not translated yet?
 *
 * This matters because the site now acts on the answer. A property, village or
 * guide with no copy in a given language is excluded from that language's
 * sitemap and hreflang set and marked `noindex, follow` (see
 * `src/lib/i18nCoverage.ts`), so an untranslated document is not a slightly
 * worse German page, it is no German page at all. Without a view like this,
 * that decision is invisible from inside the CMS and a Polish gap can sit
 * there for months.
 *
 * The filters here deliberately mirror the coverage rule exactly: a headline
 * and a body, both in that locale. Change one and change the other.
 */

const LOCALES = [
  { id: 'en', title: 'English' },
  { id: 'de', title: 'Deutsch' },
  { id: 'pl', title: 'Polski' },
] as const;

/** Missing either the localised title or the localised body. */
const missing = (type: string, titleField: string, bodyField: string, locale: string) =>
  `_type == "${type}" && (!defined(${titleField}.${locale}) || ${titleField}.${locale} == "" || count(${bodyField}.${locale}) == 0)`;

/** Villages are judged on the description alone: the name is the same word in
    every language, so requiring it would flag nothing useful. */
const missingDescription = (type: string, bodyField: string, locale: string) =>
  `_type == "${type}" && count(${bodyField}.${locale}) == 0`;

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sadržaj')
    .items([
      S.documentTypeListItem('property').title('Nekretnine'),
      S.documentTypeListItem('location').title('Lokacije'),
      S.documentTypeListItem('guide').title('Vodiči'),
      S.documentTypeListItem('testimonial').title('Preporuke'),
      S.documentTypeListItem('teamMember').title('Tim'),
      S.divider(),
      S.listItem()
        .title('Nedostaju prijevodi')
        .child(
          S.list()
            .title('Nedostaju prijevodi')
            .items(
              LOCALES.map((locale) =>
                S.listItem()
                  .id(locale.id)
                  .title(locale.title)
                  .child(
                    S.list()
                      .title(`Nedostaje ${locale.title}`)
                      .items([
                        S.listItem()
                          .id('property')
                          .title('Nekretnine')
                          .child(
                            S.documentList()
                              .title('Nekretnine bez prijevoda')
                              .filter(missing('property', 'title', 'description', locale.id))
                          ),
                        S.listItem()
                          .id('location')
                          .title('Lokacije')
                          .child(
                            S.documentList()
                              .title('Lokacije bez prijevoda')
                              .filter(missingDescription('location', 'description', locale.id))
                          ),
                        S.listItem()
                          .id('guide')
                          .title('Vodiči')
                          .child(
                            S.documentList()
                              .title('Vodiči bez prijevoda')
                              .filter(missing('guide', 'title', 'body', locale.id))
                          ),
                      ])
                  )
              )
            )
        ),
    ]);
