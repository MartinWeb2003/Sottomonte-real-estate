import { createClient, type QueryParams } from 'next-sanity';
import { projectId, dataset, apiVersion, sanityConfigured } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Fetch wrapper used by every query. Static-first: ISR with
 * revalidate 3600. Fails soft (returns the fallback) so the site
 * builds and renders even before Sanity is configured.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  fallback: T
): Promise<T> {
  if (!sanityConfigured) return fallback;
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: 3600 },
    });
  } catch (error) {
    console.error('[sanity] fetch failed:', error);
    return fallback;
  }
}
