import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ConsentBanner } from '@/components/layout/ConsentBanner';
import { MobileContactBar } from '@/components/layout/MobileContactBar';
import { getLocations } from '@sanity-config/lib/queries';
import { JsonLd, realEstateAgentJsonLd } from '@/lib/seo';

// Self-hosted variable fonts (latin + latin-ext for Croatian diacritics).
// Served from _next/static — no Google Fonts requests, GDPR-clean.
import '@fontsource-variable/archivo';
import '@fontsource-variable/inter';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Sottomonte',
  icons: {
    icon: '/images/logo-trim.png',
    shortcut: '/images/logo-trim.png',
    apple: '/images/logo-trim.png',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const locations = await getLocations();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer locations={locations} />
          <MobileContactBar />
          <ConsentBanner />
        </NextIntlClientProvider>
        <JsonLd data={realEstateAgentJsonLd()} />
      </body>
    </html>
  );
}
