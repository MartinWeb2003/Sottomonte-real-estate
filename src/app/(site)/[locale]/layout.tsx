import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ConsentBanner } from '@/components/layout/ConsentBanner';
import { PrefetchOnIntent } from '@/components/layout/PrefetchOnIntent';
import { DraftModeBanner } from '@/components/layout/DraftModeBanner';
import { getLocations } from '@sanity-config/lib/queries';
import { JsonLd, siteJsonLd } from '@/lib/seo';
import type { Locale } from '@/types';

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
      <head>
        {/*
         * Open the TCP + TLS connection to the two third-party origins before
         * anything asks for them. Measured on a real home -> contact
         * navigation, the first MapTiler request did not fire until 1170ms:
         * the SDK chunk has to download and parse first, and only then does
         * the browser start a fresh DNS lookup and handshake. Doing the
         * handshake up front takes that cost off the critical path.
         *
         * These are hints, not downloads: a visitor who never opens a page
         * with a map pays for one idle connection, not for any tiles.
         */}
        <link rel="preconnect" href="https://api.maptiler.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.maptiler.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer locations={locations} />
          <ConsentBanner />
          <PrefetchOnIntent />
          {draftMode().isEnabled && <DraftModeBanner />}
        </NextIntlClientProvider>
        {/*
          Sitewide entity graph: the agency plus the WebSite node that names it
          as publisher, linked by @id so every other page can reference the
          business instead of redescribing it. `areaServed` is built from the
          real village documents, which is why the locations fetched for the
          footer are handed to it here.
        */}
        <JsonLd data={siteJsonLd(locations, locale as Locale)} />
      </body>
    </html>
  );
}
