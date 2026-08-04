import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Long-form editorial guide: the depth content the portals do not write and
 * the surface that earns links.
 *
 * Two fields here are not optional in practice even though Sanity would let
 * them be. `author` and `publishedAt` are what turn a page into signed, dated
 * content, and unsigned undated advice is exactly what current ranking systems
 * discount. Both are required for that reason.
 */
export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basics',
      options: { source: 'title.hr', maxLength: 96 },
      description:
        'Lower case, no diacritics, hyphen separated. Once this is live, do not change it without a 301 redirect.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localizedText',
      group: 'basics',
      description:
        'One or two sentences. Doubles as the meta description, so aim for 120-155 characters and end with a reason to read on.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      group: 'basics',
      description:
        'Who wrote this. Rendered with name, role and photo, and emitted as a Person in the structured data.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'datetime',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last substantive update',
      type: 'datetime',
      group: 'basics',
      description:
        'Set this when you revise the content, not for typo fixes. Prefer updating an existing guide over writing a second one on the same topic.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'basics',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description:
            'Describe what is actually in the photo, in plain language. Not a keyword list.',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localizedBlockContent',
      group: 'content',
      description:
        'Aim for 1.500+ words in Croatian. Use H2 for sections and H3 for subsections, never skip a level, and phrase headings as the question a reader would actually type.',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'content',
      description:
        'Optional. Question-and-answer pairs, rendered on the page and emitted as FAQPage markup. Keep the two identical.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'localizedString' }),
            defineField({ name: 'answer', title: 'Answer', type: 'localizedText' }),
          ],
          preview: { select: { title: 'question.hr' } },
        }),
      ],
    }),
    defineField({
      name: 'relatedLocations',
      title: 'Related villages',
      type: 'array',
      group: 'content',
      description:
        'Villages this guide is relevant to. Drives the links between this guide and those village pages, in both directions.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'location' }] })],
    }),
    defineField({
      name: 'primaryQuery',
      title: 'Primary search query',
      type: 'string',
      group: 'seo',
      description:
        'The one query this guide is meant to own, e.g. "troskovi kupnje nekretnine Hrvatska". Editorial bookkeeping only, never rendered. Two guides must never share one primary query, or they compete with each other.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title.hr', subtitle: 'primaryQuery', media: 'coverImage' },
  },
});
