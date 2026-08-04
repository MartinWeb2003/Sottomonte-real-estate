'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset, apiVersion } from './sanity/env';

/**
 * Every locale renders the same document, so a document maps to three URLs.
 * Croatian leads because it is the default locale and the source of truth.
 */
const localeLocations = (title: string, path: string) => [
  { title: `${title} (HR)`, href: `/hr${path}` },
  { title: `${title} (EN)`, href: `/en${path}` },
  { title: `${title} (DE)`, href: `/de${path}` },
];

export default defineConfig({
  name: 'sottomonte',
  title: 'Sottomonte',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    /**
     * Side-by-side editing: the document on the left, the real page on the
     * right, rendering the draft. This is what makes it possible to read a
     * guide as a visitor will see it before anyone publishes it.
     *
     * Only `enable` is wired. The `disable` option is marked deprecated and
     * not implemented upstream, so leaving draft mode is handled by the exit
     * link in the site's own draft-mode banner instead.
     */
    presentationTool({
      previewUrl: {
        initial: '/hr',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        locations: {
          guide: defineLocations({
            select: { title: 'title.hr', slug: 'slug.current' },
            resolve: (doc) =>
              doc?.slug
                ? {
                    locations: [
                      ...localeLocations(doc.title || 'Guide', `/guides/${doc.slug}`),
                      { title: 'Svi vodiči', href: '/hr/guides' },
                    ],
                  }
                : { locations: [] },
          }),
          property: defineLocations({
            select: { title: 'title.hr', slug: 'slug.current' },
            resolve: (doc) =>
              doc?.slug
                ? {
                    locations: [
                      ...localeLocations(doc.title || 'Property', `/properties/${doc.slug}`),
                      { title: 'Sve nekretnine', href: '/hr/properties' },
                    ],
                  }
                : { locations: [] },
          }),
          location: defineLocations({
            select: { title: 'name.hr', slug: 'slug.current' },
            resolve: (doc) =>
              doc?.slug
                ? {
                    locations: [
                      ...localeLocations(doc.title || 'Village', `/locations/${doc.slug}`),
                    ],
                  }
                : { locations: [] },
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});
