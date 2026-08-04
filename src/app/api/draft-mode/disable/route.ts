import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Turns draft mode off again.
 *
 * Worth having as a real endpoint rather than leaving people to clear a
 * cookie: draft mode is easy to forget you are in, and an editor who stays in
 * it silently sees uncached draft content on every page and can mistake an
 * unpublished change for a live one.
 *
 * Returns the visitor to the page they left. The target is taken from the
 * referer and reduced to its path before use, so a crafted referer cannot turn
 * this into an open redirect to another domain.
 */
export async function GET(request: Request) {
  draftMode().disable();

  const referer = request.headers.get('referer');
  let target = '/';
  if (referer) {
    try {
      const url = new URL(referer);
      // Same origin only, and only ever the path portion.
      if (url.origin === new URL(request.url).origin) {
        target = `${url.pathname}${url.search}`;
      }
    } catch {
      target = '/';
    }
  }

  redirect(target);
}
