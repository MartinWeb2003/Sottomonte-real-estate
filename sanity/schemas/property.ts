import { defineField, defineType } from 'sanity';

export const property = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'specs', title: 'Specs' },
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
    { name: 'map', title: 'Map' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      group: 'basics',
      validation: (rule) =>
        rule.custom((value?: { hr?: string }) =>
          value?.hr ? true : 'Croatian title is required (source of truth)'
        ),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basics',
      options: { source: 'title.hr', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Reserved', value: 'reserved' },
          { title: 'Sold', value: 'sold' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (rule) => rule.required(),
      description: 'Sold properties are hidden from the grid by default.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
      description: 'Max 4 featured properties are shown on the homepage.',
    }),
    defineField({
      name: 'location',
      title: 'Location (village)',
      type: 'reference',
      to: [{ type: 'location' }],
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'House', value: 'house' },
          { title: 'Apartment', value: 'apartment' },
          { title: 'Land', value: 'land' },
          { title: 'Stone house for renovation', value: 'stone-ruin' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (EUR)',
      type: 'number',
      group: 'basics',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'priceOnRequest',
      title: 'Price on request',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
      description: 'If enabled, the price is hidden and "Price on request" is shown.',
    }),
    defineField({
      name: 'area',
      title: 'Building area (m²)',
      type: 'number',
      group: 'specs',
      description: 'Optional for land.',
    }),
    defineField({
      name: 'landArea',
      title: 'Land area (m²)',
      type: 'number',
      group: 'specs',
    }),
    defineField({ name: 'bedrooms', title: 'Bedrooms', type: 'number', group: 'specs' }),
    defineField({ name: 'bathrooms', title: 'Bathrooms', type: 'number', group: 'specs' }),
    defineField({ name: 'floors', title: 'Floors', type: 'number', group: 'specs' }),
    defineField({
      name: 'yearOrCondition',
      title: 'Year / condition',
      type: 'localizedString',
      group: 'specs',
      description: 'e.g. "Renovated 2021", "New build 2024"',
    }),
    defineField({
      name: 'seaDistance',
      title: 'Distance to sea (meters)',
      type: 'number',
      group: 'specs',
      description: 'Powers the sea-distance filter buckets (<100 m / <500 m / <1 km).',
    }),
    defineField({
      name: 'parking',
      title: 'Parking',
      type: 'boolean',
      group: 'specs',
      initialValue: false,
    }),
    defineField({
      name: 'papersStatus',
      title: 'Documentation status',
      type: 'localizedText',
      group: 'content',
      description:
        'Explicit honesty: "Vlasništvo 1/1, čisti papiri…" or exactly what is pending.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localizedBlockContent',
      group: 'content',
      description: 'Real insight, no boilerplate.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        },
      ],
      description: 'The first image is used as the card image.',
    }),
    defineField({
      name: 'droneVideoUrl',
      title: 'Drone video URL',
      type: 'url',
      group: 'media',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      group: 'map',
    }),
    defineField({
      name: 'exactLocationPublic',
      title: 'Show exact location publicly',
      type: 'boolean',
      group: 'map',
      initialValue: false,
      description:
        'If off, the map shows an approximate circle with "Exact location shared on inquiry".',
    }),
  ],
  preview: {
    select: { title: 'title.hr', subtitle: 'status', media: 'gallery.0' },
  },
});
