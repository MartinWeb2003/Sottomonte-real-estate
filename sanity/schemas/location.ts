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
  ],
  preview: {
    select: { title: 'name.hr', media: 'photos.0' },
  },
});
