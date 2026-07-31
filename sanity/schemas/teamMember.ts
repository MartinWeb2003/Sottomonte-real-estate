import { defineField, defineType } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'localizedString',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'phone',
      title: 'Direct phone',
      type: 'string',
      description: 'Direct contact per person — reinforces the personal premise.',
    }),
    defineField({
      name: 'email',
      title: 'Direct email',
      type: 'string',
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Hrvatski', value: 'HR' },
          { title: 'English', value: 'EN' },
          { title: 'Deutsch', value: 'DE' },
        ],
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'localizedText',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role.hr', media: 'photo' },
  },
});
