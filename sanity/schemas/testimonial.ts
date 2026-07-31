import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'localizedText',
      validation: (rule) =>
        rule.custom((value?: { hr?: string; en?: string; de?: string }) =>
          value?.hr || value?.en || value?.de ? true : 'At least one language is required'
        ),
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authorOrigin',
      title: 'Author origin',
      type: 'string',
      description: 'e.g. "Munich, Germany"',
    }),
    defineField({
      name: 'property',
      title: 'Related property',
      type: 'reference',
      to: [{ type: 'property' }],
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'authorOrigin' },
  },
});
