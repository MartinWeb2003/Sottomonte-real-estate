import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/sections/PageHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import { PeninsulaMap } from '@/components/map/PeninsulaMap';
import { FadeUp } from '@/components/ui/FadeUp';
import { buildMetadata } from '@/lib/seo';
import { AGENCY } from '@/lib/utils';
import { apartmentLink } from '@/components/ui/apartmentLink';
import type { Locale } from '@/types';
import { IMAGES } from '@/lib/images';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/contact',
  });
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  // Phone and WhatsApp rows removed with the agency phone number. Email, the
  // address and the form are the contact routes now.
  const details: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: t('email'),
      value: (
        <a
          href={`mailto:${AGENCY.email}`}
          className="transition-colors hover:text-gold"
        >
          {AGENCY.email}
        </a>
      ),
    },
    { label: t('address'), value: t('addressValue') },
    // Someone about to write to us is often about to plan a trip, which is
    // the only reason this belongs on the page at all.
    { label: t('stayLabel'), value: t.rich('stayValue', { link: apartmentLink }) },
  ];

  return (
    <>
      <PageHeader
        image={IMAGES.bannerContact}
        title={t('title')}
      />

      <section className="section-pad bg-white">
        <div className="container-site grid gap-14 md:grid-cols-2 md:gap-20">
          <FadeUp>
            <h2 className="font-display text-2xl text-navy">{t('detailsTitle')}</h2>
            <dl className="mt-8 space-y-5">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-base text-navy">{detail.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-muted">{t('languages')}</p>
            <div className="mt-8">
              <PeninsulaMap zoom={13} className="h-56 w-full" />
            </div>
          </FadeUp>

          <FadeUp delay={150}>
            <h2 className="font-display text-2xl text-navy">{t('formTitle')}</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
            {/* No reply-time line here: TrustStrip inside the form already
                carries it, and on this page the two sat one above the other. */}
          </FadeUp>
        </div>
      </section>
    </>
  );
}
