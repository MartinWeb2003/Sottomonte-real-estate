import { defineField, defineType } from 'sanity';

const LOCALES = [
  { id: 'hr', title: 'Hrvatski' },
  { id: 'en', title: 'English' },
  { id: 'de', title: 'Deutsch' },
];

/** { hr, en, de } string — HR is the source of truth */
export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized string',
  type: 'object',
  fields: LOCALES.map((locale) =>
    defineField({
      name: locale.id,
      title: locale.title,
      type: 'string',
    })
  ),
});

/** { hr, en, de } text — for longer plain-text fields like papersStatus */
export const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized text',
  type: 'object',
  fields: LOCALES.map((locale) =>
    defineField({
      name: locale.id,
      title: locale.title,
      type: 'text',
      rows: 3,
    })
  ),
});

/** { hr, en, de } portable text — for rich descriptions */
export const localizedBlockContent = defineType({
  name: 'localizedBlockContent',
  title: 'Localized rich text',
  type: 'object',
  fields: LOCALES.map((locale) =>
    defineField({
      name: locale.id,
      title: locale.title,
      type: 'array',
      of: [{ type: 'block' }],
    })
  ),
});
