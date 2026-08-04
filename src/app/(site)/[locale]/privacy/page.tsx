import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { AGENCY } from '@/lib/utils';
import type { Locale } from '@/types';

/**
 * Privacy policy — linked from every form's consent checkbox.
 *
 * The analytics section describes Cloudflare Web Analytics, which is what the
 * site actually runs. It is cookieless and stores no personal data, which is
 * why there is no cookie banner: there is nothing to ask consent for. If a
 * cookie-setting tool is ever added, this section and the banner both have to
 * come back, together.
 */

const CONTENT: Record<
  Locale,
  { title: string; updated: string; sections: Array<{ heading: string; body: string }> }
> = {
  hr: {
    title: 'Pravila privatnosti',
    updated: 'Zadnja izmjena: kolovoz 2026.',
    sections: [
      {
        heading: 'Tko smo',
        body: `Sottomonte, agencija za posredovanje u prometu nekretninama, ${AGENCY.address}. Za sva pitanja o osobnim podacima obratite se na ${AGENCY.email}.`,
      },
      {
        heading: 'Koje podatke prikupljamo',
        body: 'Podatke koje nam sami pošaljete putem obrazaca (ime, e-mail, telefon, sadržaj poruke) koristimo isključivo za odgovor na vaš upit. Ne prodajemo ih niti dijelimo s trećima.',
      },
      {
        heading: 'Kolačići i analitika',
        body: 'Ova stranica ne postavlja kolačiće za praćenje i ne koristi Google Analytics. Posjećenost mjerimo servisom Cloudflare Web Analytics, koji ne postavlja kolačiće, ne pohranjuje IP adrese i ne stvara profil o vama. Prikupljaju se samo skupni podaci: koje su stranice posjećene, s koje su veze posjetitelji došli i koliko se brzo stranica učitala. Zbog toga za analitiku ne tražimo privolu, jer se ne obrađuju osobni podaci.',
      },
      {
        heading: 'Vaša prava',
        body: 'U skladu s GDPR-om imate pravo na pristup, ispravak i brisanje svojih podataka. Dovoljan je e-mail i podatke uklanjamo bez odgode.',
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    updated: 'Last updated: August 2026',
    sections: [
      {
        heading: 'Who we are',
        body: `Sottomonte, a real estate brokerage, ${AGENCY.address}, Croatia. For any questions about personal data, contact ${AGENCY.email}.`,
      },
      {
        heading: 'What data we collect',
        body: 'Data you send us yourself through forms (name, email, phone, message content) is used solely to respond to your inquiry. We never sell it or share it with third parties.',
      },
      {
        heading: 'Cookies and analytics',
        body: 'This site sets no tracking cookies and does not use Google Analytics. We measure traffic with Cloudflare Web Analytics, which sets no cookies, stores no IP addresses and builds no profile of you. Only aggregate data is collected: which pages were visited, which link visitors arrived from, and how quickly pages loaded. That is why we do not ask for analytics consent: no personal data is processed.',
      },
      {
        heading: 'Your rights',
        body: 'Under the GDPR you have the right to access, correct and delete your data. A single email is enough and we remove your data without delay.',
      },
    ],
  },
  de: {
    title: 'Datenschutzerklärung',
    updated: 'Zuletzt aktualisiert: August 2026',
    sections: [
      {
        heading: 'Wer wir sind',
        body: `Sottomonte, Immobilienmakler, ${AGENCY.address}, Kroatien. Bei Fragen zu personenbezogenen Daten wenden Sie sich an ${AGENCY.email}.`,
      },
      {
        heading: 'Welche Daten wir erheben',
        body: 'Daten, die Sie uns selbst über Formulare senden (Name, E-Mail, Telefon, Nachrichteninhalt), verwenden wir ausschließlich zur Beantwortung Ihrer Anfrage. Wir verkaufen sie nicht und geben sie nicht an Dritte weiter.',
      },
      {
        heading: 'Cookies und Analyse',
        body: 'Diese Website setzt keine Tracking-Cookies und verwendet kein Google Analytics. Die Reichweite messen wir mit Cloudflare Web Analytics. Der Dienst setzt keine Cookies, speichert keine IP-Adressen und erstellt kein Profil von Ihnen. Erhoben werden ausschließlich aggregierte Daten: welche Seiten aufgerufen wurden, über welchen Link Besucher kamen und wie schnell die Seiten geladen haben. Deshalb holen wir für die Analyse keine Einwilligung ein, da keine personenbezogenen Daten verarbeitet werden.',
      },
      {
        heading: 'Ihre Rechte',
        body: 'Gemäß DSGVO haben Sie das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Eine E-Mail genügt, wir entfernen Ihre Daten unverzüglich.',
      },
    ],
  },
};

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Metadata {
  return { title: `${CONTENT[locale].title} | Sottomonte`, robots: { index: false } };
}

export default function PrivacyPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const content = CONTENT[locale];

  return (
    <section className="section-pad container-site pt-40">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl text-navy">{content.title}</h1>
        <p className="mt-3 text-sm text-muted">{content.updated}</p>
        <HairlineDivider width="w-[60px]" className="mt-8" />
        <div className="mt-10 space-y-10">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-2xl text-navy">{section.heading}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
