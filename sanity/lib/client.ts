import { createClient, type QueryParams } from 'next-sanity';
import { draftMode } from 'next/headers';
import { projectId, dataset, apiVersion, sanityConfigured } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Server-only read token. Deliberately not prefixed with NEXT_PUBLIC_: that
 * prefix ships a value to the browser, which here would hand every visitor
 * read access to unpublished content.
 */
const token = process.env.SANITY_API_TOKEN;

export const previewConfigured = Boolean(token);

/**
 * The client used while draft mode is on.
 *
 * The `drafts` perspective returns the draft of a document wherever one exists
 * and the published version otherwise, which is exactly what "show me what
 * this will look like" means. It also overlays draft ids onto their published
 * ones, so `_id` stays stable and slug lookups keep matching.
 *
 * This is the current name for what used to be `previewDrafts`; the old name
 * still resolves on our pinned API version but logs a deprecation warning on
 * every request.
 *
 * The CDN is off because it only ever serves published content, and the token
 * is required because drafts are not public.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: 'drafts',
});

/**
 * Fetch wrapper used by every query. Static-first: ISR with
 * revalidate 3600. Fails soft (returns the fallback) so the site
 * builds and renders even before Sanity is configured.
 *
 * With draft mode on it switches to the token-authed preview client and stops
 * caching, so an editor sees each save immediately rather than an hour-old
 * copy. Draft mode is a per-request cookie, so this affects only the person
 * previewing: every other visitor still gets cached, published content.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  fallback: T
): Promise<T> {
  if (!sanityConfigured) return fallback;

  // `draftMode()` throws when there is no request scope, which is the case in
  // `generateStaticParams` and in sitemap.ts. Those callers only ever want
  // published content, so a throw means "not previewing" rather than an error
  // worth failing the build over.
  let isDraft = false;
  try {
    isDraft = draftMode().isEnabled;
  } catch {
    isDraft = false;
  }

  const preview = isDraft && previewConfigured;

  try {
    return await (preview ? previewClient : client).fetch<T>(query, params, {
      ...(preview ? { cache: 'no-store' } : { next: { revalidate: 3600 } }),
    });
  } catch (error) {
    console.error('[sanity] fetch failed:', error);
    return fallback;
  }
}
