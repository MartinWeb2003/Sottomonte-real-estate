import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { previewClient } from '@sanity-config/lib/client';

/**
 * Turns draft mode on, then redirects to the page being previewed.
 *
 * The secret handshake is not hand-rolled. `defineEnableDraftMode` validates
 * the `sanity-preview-secret` in the URL against a rotating secret document in
 * the dataset, so the endpoint cannot be enabled by guessing a URL, and the
 * secret is short-lived rather than a static value living in an env file.
 * It also validates the redirect target, which is what stops this from being
 * an open redirect.
 *
 * The Presentation tool in the Studio generates these URLs; nothing needs to
 * be constructed by hand.
 */
export const { GET } = defineEnableDraftMode({ client: previewClient });
