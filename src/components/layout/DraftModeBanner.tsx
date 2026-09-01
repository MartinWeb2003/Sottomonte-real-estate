import { useTranslations } from 'next-intl';

/**
 * Fixed bar shown only while draft mode is on.
 *
 * The point is that draft mode must never be invisible. It is a cookie that
 * survives navigation, so without an indicator an editor can forget they are
 * in it, keep browsing, and mistake an unpublished draft for what the public
 * actually sees. The exit link is right there for the same reason.
 *
 * Navy with a gold hairline, so it reads as part of the site rather than a
 * browser extension. Pinned to the bottom to stay clear of the sticky navbar
 * and of the sticky inquiry bar on property pages.
 */
export function DraftModeBanner() {
  const t = useTranslations('draftMode');

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gold bg-navy text-white">
      <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 text-sm">
        <p className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-gold"
          />
          <span>
            {t('status')}
            <span className="ml-2 text-white/60">{t('note')}</span>
          </span>
        </p>
        <a
          href="/api/draft-mode/disable"
          className="shrink-0 border-b border-gold pb-0.5 font-medium transition-colors hover:border-white"
        >
          {t('exit')}
        </a>
      </div>
    </div>
  );
}
