import { getTranslations } from 'next-intl/server';
import { AGENCY, whatsappHref } from '@/lib/utils';

/**
 * Sitewide fixed call/WhatsApp bar, mobile only. WhatsApp green is the one
 * permitted color exception. The spacer keeps the footer's bottom row
 * reachable underneath the fixed bar. ConsentBanner (z-90) sits above it.
 */
export async function MobileContactBar() {
  const t = await getTranslations('contactBar');

  return (
    <>
      <div aria-hidden className="h-[52px] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden">
        <a
          href={`tel:${AGENCY.phone.replace(/\s/g, '')}`}
          className="flex items-center justify-center border-t border-navy/10 bg-white py-4 text-sm font-medium text-navy"
        >
          {t('call')}
        </a>
        <a
          href={whatsappHref(AGENCY.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-[#25D366] py-4 text-sm font-medium text-white"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
