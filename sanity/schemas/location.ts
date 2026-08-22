import { defineField, defineType } from 'sanity';

/**
 * The keystone schema. Used in three places: property detail
 * "About the location", homepage peninsula section, footer SEO links.
 */
export const location = defineType({
  name: 'location',
  title: 'Location (village)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localizedString',
      validation: (rule) =>
        rule.custom((value?: { hr?: string }) =>
          value?.hr ? true : 'Croatian name is required'
        ),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.hr', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'localizedString',
      description: 'e.g. "wind, waves, and quiet luxury"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localizedBlockContent',
      description:
        'Village character: wind, seasonality, neighbors, konoba/shop/school proximity.',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        },
      ],
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on the homepage',
      type: 'boolean',
      initialValue: true,
      description:
        'On by default. Turn it off for a locality that has its own page and listings but is not one of the villages the homepage grid presents, e.g. Postup, which is a vineyard position rather than a settlement. Turning it off changes nothing else: the page, the footer link and the sitemap entry all stay.',
    }),
  ],
  preview: {
    select: { title: 'name.hr', media: 'photos.0' },
  },
});
