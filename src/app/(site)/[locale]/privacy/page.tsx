import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { AGENCY } from '@/lib/utils';
import type { Locale } from '@/types';

/**
 * Privacy policy — linked from every form's consent checkbox and the
 * cookie banner. Plain static content per locale.
 */

const CONTENT: Record<
  Locale,
  { title: string; updated: string; sections: Array<{ heading: string; body: string }> }
> = {
  hr: {
    title: 'Pravila privatnosti',
    updated: 'Zadnja izmjena: srpanj 2026.',
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
        body: 'Google Analytics 4 učitava se samo uz vašu izričitu privolu putem bannera. IP adrese su anonimizirane. Privolu možete povući brisanjem kolačića u pregledniku.',
      },
      {
        heading: 'Vaša prava',
        body: 'U skladu s GDPR-om imate pravo na pristup, ispravak i brisanje svojih podataka. Dovoljan je e-mail i podatke uklanjamo bez odgode.',
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    updated: 'Last updated: July 2026',
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
        body: 'Google Analytics 4 loads only with your explicit consent via the banner. IP addresses are anonymized. You can withdraw consent by clearing your browser cookies.',
      },
      {
        heading: 'Your rights',
        body: 'Under the GDPR you have the right to access, correct and delete your data. A single email is enough and we remove your data without delay.',
      },
    ],
  },
  de: {
    title: 'Datenschutzerklärung',
    updated: 'Zuletzt aktualisiert: Juli 2026',
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
        body: 'Google Analytics 4 wird nur mit Ihrer ausdrücklichen Einwilligung über das Banner geladen. IP-Adressen werden anonymisiert. Sie können Ihre Einwilligung widerrufen, indem Sie die Cookies Ihres Browsers löschen.',
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
