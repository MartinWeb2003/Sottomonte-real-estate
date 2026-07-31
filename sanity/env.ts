export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder';

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const apiVersion = '2024-10-01';

/** True once a real Sanity project is configured */
export const sanityConfigured = projectId !== 'placeholder';
