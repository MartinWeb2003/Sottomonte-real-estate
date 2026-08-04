import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * On-demand revalidation, called by a Sanity webhook whenever a document is
 * published, edited or deleted.
 *
 * Without this, every listing page waits out its `revalidate = 3600` window
 * before showing new content. That is not just slow: an editor who publishes a
 * guide and then cannot find it on the site reasonably concludes that
 * publishing failed, which is exactly what happened here before this existed.
 *
 * Route patterns, not concrete URLs. `revalidatePath('/[locale]/guides',
 * 'page')` clears that route for every locale in one call, so nothing has to
 * enumerate hr/en/de or track which slugs exist. Passing a literal path such as
 * '/hr/guides' would only ever clear the Croatian copy and silently leave the
 * English and German ones stale.
 */

/** Which routes each document type can appear on. */
const AFFECTED_ROUTES: Record<string, string[]> = {
  // A guide shows on the guides index, its own page, the buying page's guide
  // strip, and any village page it is tagged to. Tags can change in the same
  // edit that triggers this, so all village pages are cleared rather than only
  // the ones the incoming payload happens to mention.
  guide: [
    '/[locale]/guides',
    '/[locale]/guides/[slug]',
    '/[locale]/buying',
    '/[locale]/locations/[slug]',
  ],
  // A property shows in the grid, on its own page, in the village it belongs
  // to, and in the homepage featured row.
  property: [
    '/[locale]/properties',
    '/[locale]/properties/[slug]',
    '/[locale]/locations/[slug]',
    '/[locale]',
  ],
  // A village shows on its own page, the homepage peninsula grid, and inside
  // every property that references it.
  location: [
    '/[locale]/locations/[slug]',
    '/[locale]',
    '/[locale]/properties',
    '/[locale]/properties/[slug]',
  ],
  testimonial: ['/[locale]'],
  // The team member behind the InquiryCard and the guide bylines.
  teamMember: ['/[locale]/properties/[slug]', '/[locale]/guides/[slug]'],
};

/** Always refreshed: both are generated from the same CMS content. */
const ALWAYS = ['/sitemap.xml', '/llms.txt'];

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    // Refuse rather than run unauthenticated. An open revalidation endpoint is
    // a free way for anyone to force expensive regeneration of every page.
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET is not configured' },
      { status: 500 }
    );
  }

  const { isValidSignature, body } = await parseBody<{
    _type?: string;
    slug?: string;
  }>(req, secret);

  if (!isValidSignature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  if (!body?._type) {
    return NextResponse.json(
      { message: 'Payload is missing _type' },
      { status: 400 }
    );
  }

  const routes = AFFECTED_ROUTES[body._type];

  if (!routes) {
    // A document type nothing renders. Report it rather than failing, so the
    // webhook does not show up as an error in Sanity for a harmless case.
    return NextResponse.json({
      revalidated: false,
      type: body._type,
      message: 'No routes are affected by this document type',
    });
  }

  for (const route of routes) {
    revalidatePath(route, 'page');
  }

  // The footer lists villages and is rendered by the shared layout, so a
  // village edit has to clear the layout too or the old name survives in the
  // footer of every page while being correct on the village page itself.
  if (body._type === 'location') {
    revalidatePath('/[locale]', 'layout');
  }

  for (const route of ALWAYS) {
    revalidatePath(route);
  }

  return NextResponse.json({
    revalidated: true,
    type: body._type,
    slug: body.slug ?? null,
    routes: [...routes, ...ALWAYS],
    now: Date.now(),
  });
}
