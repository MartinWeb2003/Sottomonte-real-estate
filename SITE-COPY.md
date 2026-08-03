# Sottomonte, sav tekst sa stranice

Generirano iz `messages/hr.json`, `en.json`, `de.json`, jedinog izvora teksta na stranici.

## Kako uređivati

- Mijenjajte SAMO tekst iza `HR:`, `EN:` i `DE:`. **Ne dirajte retke `KLJUČ:`**, oni su adresa po kojoj se izmjene vraćaju u kod.
- Vitičaste zamjene poput `{name}`, `{count}`, `{price}`, `{page}`, `{total}` moraju ostati u tekstu, doslovno kako jesu.
- Dva teksta pod `properties.results` su ICU plural pravila, mijenjajte samo riječi, ne strukturu `{count, plural, ...}`.
- Naslovi se na stranici automatski prikazuju VELIKIM SLOVIMA, zato ih ovdje pišite normalno (rečenično).
- Ne koristite crtice — ni – (pravilo brenda), umjesto njih zarez, dvotočka ili točka.
- Hrvatski je izvor istine, EN i DE su prijevodi. Njemački koristi formalno Sie.
- Ako neki tekst ne želite mijenjati, jednostavno ga ostavite kakav jest.


---

# Global: navigation

*Labels in the top navigation bar; also reused as the Pages column in the footer.*


**KLJUČ: `nav.home`**

- HR: Početna
- EN: Home
- DE: Startseite

**KLJUČ: `nav.properties`**

- HR: Nekretnine
- EN: Properties
- DE: Immobilien

**KLJUČ: `nav.selling`**

- HR: Prodaja
- EN: Selling
- DE: Verkaufen

**KLJUČ: `nav.contact`**

- HR: Kontakt
- EN: Contact
- DE: Kontakt

**KLJUČ: `nav.buying`**

- HR: Kupnja
- EN: Buying
- DE: Kaufen

---

# Global: footer

*The navy footer on every page.*


**KLJUČ: `footer.tagline`**

- HR: Specijalizirana agencija za nekretnine na Pelješcu. Poznajemo svaku lokaciju, parcelu i vlasnika osobno.
- EN: Boutique real estate agency on Pelješac, Croatia. We know every location and property owner personally.
- DE: Boutique Immobilienagentur auf Pelješac, Kroatien. Wir kennen jede Lage und jeden Eigentümer persönlich.

**KLJUČ: `footer.pages`**

- HR: Stranice
- EN: Pages
- DE: Seiten

**KLJUČ: `footer.locations`**

- HR: Lokacije
- EN: Locations
- DE: Orte

**KLJUČ: `footer.contact`**

- HR: Kontakt
- EN: Contact
- DE: Kontakt

**KLJUČ: `footer.privacy`**

- HR: Privatnost
- EN: Privacy
- DE: Datenschutz

**KLJUČ: `footer.rights`**

- HR: Sva prava pridržana.
- EN: All rights reserved.
- DE: Alle Rechte vorbehalten.

---

# Global: trust strip

*The one-line trust row shown above the submit button of every form.*


**KLJUČ: `trust.reply`**

- HR: Odgovaramo u najkraćem mogućem roku
- EN: We reply as soon as possible
- DE: Antwort so schnell wie möglich

**KLJUČ: `trust.licensed`**

- HR: Licencirana agencija za nekretnine, HGK
- EN: Licensed real estate agency, HGK
- DE: Lizenzierte Immobilienagentur, HGK

**KLJUČ: `trust.languages`**

- HR: Govorimo HR / EN / DE
- EN: We speak HR / EN / DE
- DE: Wir sprechen DE / EN / HR

---

# Global: shared form labels

*Field labels, validation and status messages shared by all four forms.*


**KLJUČ: `forms.name`**

- HR: Ime i prezime
- EN: Full name
- DE: Vor- und Nachname

**KLJUČ: `forms.email`**

- HR: E-mail adresa
- EN: Email address
- DE: E-Mail-Adresse

**KLJUČ: `forms.phone`**

- HR: Telefon (neobavezno)
- EN: Phone (optional)
- DE: Telefon (optional)

**KLJUČ: `forms.message`**

- HR: Poruka
- EN: Message
- DE: Nachricht

**KLJUČ: `forms.note`**

- HR: Napomena (neobavezno)
- EN: Note (optional)
- DE: Anmerkung (optional)

**KLJUČ: `forms.notePlaceholder`**

- HR: Želite li još nešto dodati? Željena lokacija na Pelješcu, budžet, način financiranja, posebne želje…
- EN: Anything else you would like to add? Desired location on Pelješac, budget, financing, specific requirements…
- DE: Möchten Sie noch etwas ergänzen? Gewünschte Lage auf Pelješac, Budget, Finanzierung, besondere Wünsche…

**KLJUČ: `forms.consent`**

- HR: Slažem se da Sottomonte pohrani moje podatke radi odgovora na upit, u skladu s <link>pravilima privatnosti</link>.
- EN: I agree that Sottomonte may store my details to respond to my inquiry, in line with the <link>privacy policy</link>.
- DE: Ich bin einverstanden, dass Sottomonte meine Daten zur Beantwortung meiner Anfrage speichert, gemäß der <link>Datenschutzerklärung</link>.

**KLJUČ: `forms.submit`**

- HR: Pošaljite upit
- EN: Send inquiry
- DE: Anfrage senden

**KLJUČ: `forms.sending`**

- HR: Šaljemo…
- EN: Sending…
- DE: Wird gesendet…

**KLJUČ: `forms.success`**

- HR: Hvala vam. Javit ćemo se u najkraćem mogućem roku.
- EN: Thank you. We will reply as soon as possible.
- DE: Vielen Dank. Wir antworten so schnell wie möglich.

**KLJUČ: `forms.error`**

- HR: Nešto je pošlo po zlu. Pokušajte ponovno ili nas nazovite.
- EN: Something went wrong. Please try again or give us a call.
- DE: Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder rufen Sie uns an.

**KLJUČ: `forms.required`**

- HR: Obavezno polje
- EN: This field is required
- DE: Pflichtfeld

**KLJUČ: `forms.invalidEmail`**

- HR: Unesite ispravnu e-mail adresu
- EN: Please enter a valid email address
- DE: Bitte geben Sie eine gültige E-Mail-Adresse ein

**KLJUČ: `forms.consentRequired`**

- HR: Potrebna je privola
- EN: Consent is required
- DE: Einwilligung erforderlich

---

# Global: cookie banner

*GDPR consent banner for analytics.*


**KLJUČ: `consent.text`**

- HR: Koristimo kolačiće za anonimnu analitiku posjeta (Google Analytics). Osobne podatke ne dijelimo s trećima.
- EN: We use cookies for anonymous visitor analytics (Google Analytics). We never share personal data with third parties.
- DE: Wir verwenden Cookies für anonyme Besucherstatistiken (Google Analytics). Persönliche Daten geben wir niemals an Dritte weiter.

**KLJUČ: `consent.accept`**

- HR: Prihvaćam
- EN: Accept
- DE: Akzeptieren

**KLJUČ: `consent.decline`**

- HR: Odbijam
- EN: Decline
- DE: Ablehnen

**KLJUČ: `consent.privacy`**

- HR: Pravila privatnosti
- EN: Privacy policy
- DE: Datenschutzerklärung

---

# Global: final CTA block

*The navy 'Let's find your place' block that closes every page.*


**KLJUČ: `finalCta.title`**

- HR: Pronađimo vašu savršenu nekretninu na Pelješcu.
- EN: Let's find your dream property on Pelješac, Croatia.
- DE: Finden wir Ihre Wunschimmobilie auf Pelješac.

**KLJUČ: `finalCta.subtitle`**

- HR: Javite nam se. Neobvezujući razgovor štedi mjesece samostalnog traženja.
- EN: Get in touch. A quick consultation costs nothing and saves months of searching.
- DE: Melden Sie sich bei uns. Ein unverbindliches Gespräch erspart Ihnen Monate der Suche.

**KLJUČ: `finalCta.button`**

- HR: Kontaktirajte nas
- EN: Contact us
- DE: Kontakt aufnehmen

---

# SEO: page titles and descriptions

*Browser-tab titles and Google snippet descriptions. THE most important texts for SEO.*


**KLJUČ: `meta.home.title`**

- HR: Nekretnine Pelješac: kuće, zemljišta i kamene kuće | Sottomonte
- EN: Property for Sale Pelješac Croatia: Houses & Land | Sottomonte
- DE: Immobilien auf Pelješac kaufen: Häuser & Grundstücke | Sottomonte

**KLJUČ: `meta.home.description`**

- HR: Tražite nekretnine na Pelješcu? Prodaja kuća, građevinskih zemljišta i kamenih kuća uz obalu i u unutrašnjosti poluotoka. Provjerena dokumentacija.
- EN: Looking for real estate on Pelješac peninsula, Croatia? We offer verified houses, seafront land, and traditional stone homes for sale. Contact us today.
- DE: Sie suchen Immobilien auf der Halbinsel Pelješac? Wir bieten geprüfte Häuser, Grundstücke am Meer und Steinhäuser zum Kauf. Jetzt informieren.

**KLJUČ: `meta.properties.title`**

- HR: Prodaja nekretnina Pelješac: ponuda kuća i zemljišta | Sottomonte
- EN: Properties for Sale on Pelješac Peninsula, Croatia | Sottomonte
- DE: Immobilien zum Kauf auf Pelješac: Angebote | Sottomonte

**KLJUČ: `meta.properties.description`**

- HR: Istražite ponudu nekretnina na Pelješcu. Kuće s pogledom na more, građevinska zemljišta i autohtone kamene kuće. Čisti papiri i sigurna kupnja.
- EN: Explore verified real estate for sale across the Pelješac peninsula in Croatia. Houses, building land, and sea view apartments. Browse current listings.
- DE: Entdecken Sie geprüfte Immobilien zum Kauf auf Pelješac, Kroatien. Häuser, Baugrundstücke und Wohnungen am Meer. Jetzt Portfolio durchstöbern.

**KLJUČ: `meta.selling.title`**

- HR: Prodaja nekretnine na Pelješcu: besplatna procjena | Sottomonte
- EN: Sell Your Property on Pelješac Croatia | Sottomonte
- DE: Immobilie auf Pelješac verkaufen: Agentur | Sottomonte

**KLJUČ: `meta.selling.description`**

- HR: Prodajete kuću ili zemljište na Pelješcu? Spajamo vas s provjerenim kupcima uz profesionalnu prezentaciju, besplatnu procjenu i potpunu diskreciju.
- EN: Selling a house or land on Pelješac? We connect sellers with qualified buyers, offering expert valuation, marketing, and full discretion.
- DE: Möchten Sie ein Haus oder Grundstück auf Pelješac verkaufen? Wir verbinden Sie mit internationalen Käufern. Kostenlose Bewertung und Diskretion.

**KLJUČ: `meta.contact.title`**

- HR: Kontakt: Agencija za nekretnine Pelješac | Sottomonte
- EN: Contact Us: Real Estate Agency Pelješac Croatia | Sottomonte
- DE: Kontakt: Immobilienagentur Pelješac | Sottomonte

**KLJUČ: `meta.contact.description`**

- HR: Kontaktirajte našu agenciju za nekretnine na Pelješcu putem telefona, e-maila ili WhatsAppa. Brz odgovor u roku od 24 sata na hrvatskom, engleskom i njemačkom.
- EN: Get in touch with our Pelješac real estate agency by phone, email, or WhatsApp. We respond within 24 hours in English, German, and Croatian.
- DE: Kontaktieren Sie unsere Immobilienagentur auf Pelješac per Telefon, E-Mail oder WhatsApp. Schnelle Antwort innerhalb von 24 Stunden.

**KLJUČ: `meta.buying.title`**

- HR: Kupnja nekretnine na Pelješcu: vodič i troškovi | Sottomonte
- EN: Buying Property in Pelješac Croatia: Process & Costs | Sottomonte
- DE: Immobilie auf Pelješac kaufen: Ablauf und Kosten | Sottomonte

**KLJUČ: `meta.buying.description`**

- HR: Kompletan vodič za kupnju nekretnina na Pelješcu za domaće i strane državljane. Saznajte sve o pravnom postupku, porezima i dodatnim troškovima.
- EN: Complete guide to buying real estate on Pelješac, Croatia. Learn about legal procedures, property transfer tax, notary steps, and buying costs.
- DE: Leitfaden zum Immobilienkauf auf Pelješac für ausländische Käufer. Erfahren Sie alles über Kaufablauf, Steuern, rechtliche Prüfung und Nebenkosten.

---

# Home page

*Sections in page order: hero, featured properties, statement + three columns (merged section), village grid, how we work, off-market teaser.*


**KLJUČ: `hero.titleLead`**

- HR: Vaš pouzdani partner za nekretnine na
- EN: Your trusted real estate partner on
- DE: Ihr verlässlicher Immobilienpartner auf

**KLJUČ: `hero.titleItalic`**

- HR: Pelješcu
- EN: Pelješac
- DE: Pelješac

**KLJUČ: `hero.subline`**

- HR: Ne objavljujemo samo oglase. Poznajemo svaku lokaciju, svaku parcelu i svakog vlasnika na Pelješcu osobno.
- EN: We do not just list properties. We know every location, every land parcel, and every owner personally.
- DE: Wir veröffentlichen nicht nur Inserate. Wir kennen jede Lage, jedes Grundstück und jeden Eigentümer persönlich.

**KLJUČ: `hero.ctaProperties`**

- HR: Pogledajte nekretnine
- EN: View properties
- DE: Immobilien ansehen

**KLJUČ: `hero.ctaContact`**

- HR: Kontaktirajte nas
- EN: Get in touch
- DE: Kontakt aufnehmen

**KLJUČ: `featured.title`**

- HR: Izdvojene nekretnine na Pelješcu
- EN: Featured properties on Pelješac
- DE: Ausgewählte Immobilien auf Pelješac

**KLJUČ: `featured.viewAll`**

- HR: Pogledajte sve nekretnine
- EN: View all properties
- DE: Alle Immobilien ansehen

**KLJUČ: `intro.statement`**

- HR: Kupnja nekretnine na poluotoku gdje svi znaju svakoga traži partnera koji stvarno poznaje teren.
- EN: Buying real estate on a peninsula where everyone knows everyone requires a partner who truly knows the region.
- DE: Wer auf einer Halbinsel kauft, auf der jeder jeden kennt, braucht einen Partner, der die Region wirklich kennt.

**KLJUČ: `intro.body`**

- HR: Sottomonte je licencirana agencija za nekretnine s Pelješca. Iza svake nekretnine koju predstavljamo stoji priča koju znamo iz prve ruke: tko je vlasnik, kakva je lokacija, kakvo je selo i jesu li svi papiri čisti. To ne možete pročitati u oglasniku.
- EN: Sottomonte is a licensed real estate agency based on Pelješac. Behind every property we represent is a story we know first-hand: ownership history, location details, village life, and legal documentation status.
- DE: Sottomonte ist eine lizenzierte Immobilienagentur von Pelješac. Hinter jeder Immobilie steht eine Geschichte aus erster Hand: Eigentümer, Lage, Dorfleben und rechtliche Dokumentation.

**KLJUČ: `difference.items.0.title`**

- HR: Osoban obilazak svake parcele
- EN: We inspect every parcel on foot
- DE: Persönliche Besichtigung jedes Grundstücks

**KLJUČ: `difference.items.0.body`**

- HR: Svaku kuću i zemljište u ponudi obišli smo osobno. Znamo gdje popodne pada sjena, odakle puše bura i kakav je pogled s terase u predvečerje.
- EN: We visit every house and land parcel in person. We know where the afternoon shade falls, wind patterns, and terrace views at sunset.
- DE: Jede Immobilie in unserem Portfolio besichtigen wir persönlich. Wir kennen Schattenverhältnisse, Windverhältnisse und Aussichten bei Sonnenuntergang.

**KLJUČ: `difference.items.1.title`**

- HR: Izravan kontakt s vlasnicima
- EN: Direct access to property owners
- DE: Direkter Kontakt zu Eigentümern

**KLJUČ: `difference.items.1.body`**

- HR: Na Pelješcu se najbolje nekretnine često ne prodaju putem javnih oglasnika nego povjerenjem. Godinama građeni odnosi donose nam ponude koje uopće ne izlaze na otvoreno tržište.
- EN: On Pelješac, the best real estate often sells through trust rather than portals. Long-standing relationships give us access to exclusive off-market listings.
- DE: Auf Pelješac wechseln Top-Immobilien meist durch Vertrauen den Besitzer. Durch jahrelange Beziehungen erhalten wir exklusive Off-Market Angebote.

**KLJUČ: `difference.items.2.title`**

- HR: Transparentno savjetovanje
- EN: Transparent advice
- DE: Transparente Beratung

**KLJUČ: `difference.items.2.body`**

- HR: Ako nekretnina ne odgovara vašim željama ili budžetu, reći ćemo vam to otvoreno prije nego što potrošite vrijeme i novac. Jedan iskren savjet nama je važniji od brze prodaje.
- EN: If a property is not right for your needs or budget, we will tell you directly. Honest advice matters more to us than a quick sale.
- DE: Passt eine Immobilie nicht zu Ihren Vorstellungen oder Ihrem Budget, sagen wir es direkt. Ehrliche Beratung steht bei uns an erster Stelle.

**KLJUČ: `peninsula.title`**

- HR: Jedan poluotok. Jedinstvene lokacije.
- EN: One peninsula. Unique locations.
- DE: Eine Halbinsel. Einzigartige Orte.

**KLJUČ: `peninsula.subtitle`**

- HR: Svako mjesto na Pelješcu ima svoj specifičan karakter, povijest, ritam i atmosferu. Pomoći ćemo vam pronaći idealnu lokaciju.
- EN: Every village on Pelješac has its own distinct character, history, and lifestyle. We will help you find the location that fits you best.
- DE: Jedes Dorf auf Pelješac hat seinen eigenen Charakter, seine Geschichte und seinen Rhythmus. Wir helfen Ihnen, den passenden Ort zu finden.

**KLJUČ: `howWeWork.title`**

- HR: Postupak kupnje
- EN: The buying process
- DE: Der Kaufprozess

**KLJUČ: `howWeWork.steps.0.title`**

- HR: Prvi neobvezujući razgovor
- EN: First consultation
- DE: Erstes Beratungsgespräch

**KLJUČ: `howWeWork.steps.0.body`**

- HR: Slušamo vaše želje, budžet i kriterije. Bez obveza, uz poziv ili sastanak na Pelješcu.
- EN: We listen to your wishes, budget, and criteria. Completely non-binding, over a phone call or meeting on Pelješac.
- DE: Wir besprechen Ihre Wünsche, Budget und Kriterien. Unverbindlich, per Anruf oder vor Ort auf Pelješac.

**KLJUČ: `howWeWork.steps.1.title`**

- HR: Pažljivo odabrana ponuda
- EN: Curated selection
- DE: Kuratierte Auswahl

**KLJUČ: `howWeWork.steps.1.body`**

- HR: Predlažemo samo nekretnine koje odgovaraju vašim parametrima, uključujući i diskretne off-market ponude.
- EN: We propose only relevant properties that fit your criteria, including confidential off-market opportunities.
- DE: Wir präsentieren nur passende Objekte, einschließlich vertraulicher Off-Market Angebote.

**KLJUČ: `howWeWork.steps.2.title`**

- HR: Stručni obilasci na terenu
- EN: Guided viewings
- DE: Vor-Ort Besichtigungen

**KLJUČ: `howWeWork.steps.2.body`**

- HR: Obilazimo lokacije zajedno, bez žurbe. Ukazujemo na sve prednosti, ali i potencijalne mane nekretnine.
- EN: We tour properties together without rush, highlighting both advantages and potential drawbacks.
- DE: Wir besichtigen gemeinsam und ohne Eile. Wir zeigen Vor- und Nachteile der Immobilie transparent auf.

**KLJUČ: `howWeWork.steps.3.title`**

- HR: Pravna provjera i primopredaja
- EN: Legal process and closing
- DE: Rechtliche Abwicklung und Übergabe

**KLJUČ: `howWeWork.steps.3.body`**

- HR: Vodimo cjelokupni postupak kupoprodaje u suradnji s odvjetnikom i javnim bilježnikom do uknjižbe vlasništva.
- EN: We handle the entire legal purchasing process in collaboration with verified lawyers and public notaries through to land registry.
- DE: Wir begleiten den gesamten Kaufprozess in Zusammenarbeit mit Anwalt und Notar bis zur Grundbucheintragung.

**KLJUČ: `offMarket.title`**

- HR: Neke od najboljih nekretnina nikad ne dođu na javno tržište.
- EN: Some of the best properties never reach the open market.
- DE: Einige der besten Immobilien erreichen nie den offenen Markt.

**KLJUČ: `offMarket.body`**

- HR: Mnogi vlasnici na Pelješcu prodaju kuće i zemljišta diskretno. Opišite nam što tražite i kontaktirat ćemo vas čim se pojavi odgovarajući objekt.
- EN: Many property owners on Pelješac prefer discreet selling without public exposure. Tell us your requirements for early access.
- DE: Viele Eigentümer verkaufen ihre Immobilien diskret. Teilen Sie uns Ihre Wünsche mit für direkten Zugang zu neuen Objekten.

**KLJUČ: `offMarket.cta`**

- HR: Pošaljite nam svoje kriterije
- EN: Send us your requirements
- DE: Kriterien mitteilen

---

# Properties page (/properties)

*Header, filter bar labels, pagination, and the buyer-wishlist form at the bottom.*


**KLJUČ: `properties.title`**

- HR: Ponuda nekretnina na Pelješcu
- EN: Real Estate for Sale on Pelješac
- DE: Immobilienangebot auf Pelješac

**KLJUČ: `properties.breadcrumbHome`**

- HR: Početna
- EN: Home
- DE: Startseite

**KLJUČ: `properties.breadcrumb`**

- HR: Nekretnine
- EN: Properties
- DE: Immobilien

**KLJUČ: `properties.results`**

- HR: {count, plural, one {# nekretnina} few {# nekretnine} other {# nekretnina}}
- EN: {count, plural, one {# property} other {# properties}}
- DE: {count, plural, one {# Immobilie} other {# Immobilien}}

**KLJUČ: `properties.reserved`**

- HR: Rezervirano
- EN: Reserved
- DE: Reserviert

**KLJUČ: `properties.filters.title`**

- HR: Pretražite nekretnine
- EN: Search properties
- DE: Immobilien suchen

**KLJUČ: `properties.filters.button`**

- HR: Filteri
- EN: Filters
- DE: Filter

**KLJUČ: `properties.filters.type`**

- HR: Vrsta nekretnine
- EN: Property type
- DE: Immobilientyp

**KLJUČ: `properties.filters.allTypes`**

- HR: Svi tipovi
- EN: All types
- DE: Alle Typen

**KLJUČ: `properties.filters.price`**

- HR: Cijena (€)
- EN: Price (€)
- DE: Preis (€)

**KLJUČ: `properties.filters.anyPrice`**

- HR: Sve cijene
- EN: Any price
- DE: Alle Preise

**KLJUČ: `properties.filters.priceUpTo`**

- HR: do {price}
- EN: up to {price}
- DE: bis {price}

**KLJUČ: `properties.filters.priceFrom`**

- HR: od {price}
- EN: from {price}
- DE: ab {price}

**KLJUČ: `properties.filters.seaDistance`**

- HR: Udaljenost od mora
- EN: Distance to sea
- DE: Entfernung zum Meer

**KLJUČ: `properties.filters.anyDistance`**

- HR: Sve udaljenosti
- EN: Any distance
- DE: Beliebig

**KLJUČ: `properties.filters.under100`**

- HR: < 100 m
- EN: < 100 m
- DE: < 100 m

**KLJUČ: `properties.filters.under500`**

- HR: < 500 m
- EN: < 500 m
- DE: < 500 m

**KLJUČ: `properties.filters.under1km`**

- HR: < 1 km
- EN: < 1 km
- DE: < 1 km

**KLJUČ: `properties.filters.sort`**

- HR: Sortiranje
- EN: Sort by
- DE: Sortieren nach

**KLJUČ: `properties.filters.sortNewest`**

- HR: Najnovije u ponudi
- EN: Newest first
- DE: Neueste zuerst

**KLJUČ: `properties.filters.sortPriceAsc`**

- HR: Cijena: od najniže
- EN: Price: low to high
- DE: Preis: aufsteigend

**KLJUČ: `properties.filters.sortPriceDesc`**

- HR: Cijena: od najviše
- EN: Price: high to low
- DE: Preis: absteigend

**KLJUČ: `properties.filters.clearAll`**

- HR: Očisti sve filtere
- EN: Reset filters
- DE: Filter zurücksetzen

**KLJUČ: `properties.filters.apply`**

- HR: Primijeni filtere
- EN: Apply filters
- DE: Filter anwenden

**KLJUČ: `properties.filters.selected`**

- HR: {count} odabrano
- EN: {count} selected
- DE: {count} ausgewählt

**KLJUČ: `properties.types.house`**

- HR: Kuća / Vila
- EN: House / Villa
- DE: Haus / Villa

**KLJUČ: `properties.types.apartment`**

- HR: Stan / Apartman
- EN: Apartment
- DE: Wohnung / Apartment

**KLJUČ: `properties.types.land`**

- HR: Građevinsko zemljište
- EN: Building land
- DE: Baugrundstück

**KLJUČ: `properties.types.stone-ruin`**

- HR: Kamena kuća za obnovu
- EN: Stone house for renovation
- DE: Steinhaus zum Renovieren

**KLJUČ: `properties.pagination.previous`**

- HR: Prethodna
- EN: Previous
- DE: Zurück

**KLJUČ: `properties.pagination.next`**

- HR: Sljedeća
- EN: Next
- DE: Weiter

**KLJUČ: `properties.pagination.page`**

- HR: Stranica {page} od {total}
- EN: Page {page} of {total}
- DE: Seite {page} von {total}

**KLJUČ: `properties.bottomCta.title`**

- HR: Niste pronašli ono što vas zanima? Dio ponude je izvan oglasa.
- EN: Haven't found what you are looking for? Part of our portfolio is off-market.
- DE: Nicht gefunden, was Sie suchen? Ein Teil des Portfolios ist off-market.

**KLJUČ: `properties.bottomCta.body`**

- HR: Opišite nam kakvu nekretninu tražite na Pelješcu i obavijestit ćemo vas čim se pojavi prilika.
- EN: Describe what kind of property you are looking for on Pelješac and we will inform you about new opportunities.
- DE: Beschreiben Sie Ihre Wunschimmobilie auf Pelješac und wir benachrichtigen Sie bei passenden Angeboten.

**KLJUČ: `properties.bottomCta.lookingFor`**

- HR: Kakvu nekretninu tražite?
- EN: What type of property are you looking for?
- DE: Was für eine Immobilie suchen Sie?

**KLJUČ: `properties.bottomCta.lookingForPlaceholder`**

- HR: npr. kamena kuća prvi red do mora, Viganj ili Orebić, budžet do 350.000 €
- EN: e.g. stone house near the sea, Viganj or Orebić, budget up to €350,000
- DE: z. B. Steinhaus am Meer, Viganj oder Orebić, Budget bis 350.000 €

**KLJUČ: `properties.bottomCta.budget`**

- HR: Okvirni budžet (€)
- EN: Approximate budget (€)
- DE: Ungefähres Budget (€)

**KLJUČ: `properties.bottomCta.submit`**

- HR: Pošaljite upit za nekretninu
- EN: Submit property request
- DE: Anfrage absenden

---

# Property detail page (/properties/[slug])

*All labels around a single listing: gallery, specs, papers, inquiry card. Listing content itself comes from the CMS.*


**KLJUČ: `property.viewAllPhotos`**

- HR: Sve fotografije ({count})
- EN: View all photos ({count})
- DE: Alle Fotos ansehen ({count})

**KLJUČ: `property.droneVideo`**

- HR: Video snimka dronom
- EN: Drone video tour
- DE: Drohnenvideo

**KLJUČ: `property.photos`**

- HR: Galerija fotografija
- EN: Photo gallery
- DE: Fotogalerie

**KLJUČ: `property.inquire`**

- HR: Pošaljite upit za ovu nekretninu
- EN: Send inquiry for this property
- DE: Anfrage für diese Immobilie senden

**KLJUČ: `property.aboutProperty`**

- HR: O nekretnini
- EN: Property description
- DE: Objektbeschreibung

**KLJUČ: `property.aboutLocation`**

- HR: O lokaciji na Pelješcu
- EN: About the location
- DE: Über die Lage

**KLJUČ: `property.papersTitle`**

- HR: Pravni status i dokumentacija
- EN: Documentation and legal status
- DE: Status der Unterlagen

**KLJUČ: `property.priceOnRequest`**

- HR: Cijena na upit
- EN: Price on request
- DE: Preis auf Anfrage

**KLJUČ: `property.perM2`**

- HR: ≈ {price}/m²
- EN: ≈ {price}/m²
- DE: ≈ {price}/m²

**KLJUČ: `property.approximateLocation`**

- HR: Prikazana je približna mikrolokacija. Točnu adresu i parcelu dijelimo nakon upita.
- EN: Approximate location shown. Exact location and plot details shared upon inquiry.
- DE: Ungefähre Lage dargestellt. Genaue Adresse und Flurstück auf Anfrage.

**KLJUČ: `property.similar`**

- HR: Slične nekretnine na Pelješcu
- EN: Similar properties on Pelješac
- DE: Ähnliche Immobilien auf Pelješac

**KLJUČ: `property.weSpeak`**

- HR: Govorimo HR / EN / DE
- EN: We speak HR / EN / DE
- DE: Wir sprechen HR / EN / DE

**KLJUČ: `property.yourAgent`**

- HR: Vaš agent za nekretnine
- EN: Your real estate agent
- DE: Ihr Ansprechpartner

**KLJUČ: `property.inquiryPlaceholder`**

- HR: Zanima me nekretnina: {title}
- EN: I am interested in property: {title}
- DE: Ich interessiere mich für die Immobilie: {title}

**KLJUČ: `property.specs.area`**

- HR: Stambena površina
- EN: Living area
- DE: Wohnfläche

**KLJUČ: `property.specs.landArea`**

- HR: Površina zemljišta
- EN: Land plot area
- DE: Grundstücksfläche

**KLJUČ: `property.specs.bedrooms`**

- HR: Spavaće sobe
- EN: Bedrooms
- DE: Schlafzimmer

**KLJUČ: `property.specs.bathrooms`**

- HR: Kupaonice
- EN: Bathrooms
- DE: Badezimmer

**KLJUČ: `property.specs.floors`**

- HR: Broj etaža
- EN: Floors
- DE: Etagen

**KLJUČ: `property.specs.condition`**

- HR: Stanje nekretnine
- EN: Condition
- DE: Zustand

**KLJUČ: `property.specs.seaDistance`**

- HR: Udaljenost od mora
- EN: Distance to sea
- DE: Entfernung zum Meer

**KLJUČ: `property.specs.parking`**

- HR: Parkirno mjesto
- EN: Parking
- DE: Parkplatz

**KLJUČ: `property.specs.parkingYes`**

- HR: Da
- EN: Yes
- DE: Ja

**KLJUČ: `property.specs.parkingNo`**

- HR: Ne
- EN: No
- DE: Nein

**KLJUČ: `property.status.available`**

- HR: Dostupno
- EN: Available
- DE: Verfügbar

**KLJUČ: `property.status.reserved`**

- HR: Rezervirano
- EN: Reserved
- DE: Reserviert

**KLJUČ: `property.status.sold`**

- HR: Prodano
- EN: Sold
- DE: Verkauft

---

# Buying page (/buying)

*The foreign-buyer page: reassurance, process, cost table, FAQ.*


**KLJUČ: `buying.title`**

- HR: Kupnja nekretnine na Pelješcu
- EN: Buying Property on Pelješac, Croatia
- DE: Immobilienkauf auf Pelješac, Kroatien

**KLJUČ: `buying.subtitle`**

- HR: Kompletan vodič kroz postupak kupnje, pravnu provjeru, poreze i troškove.
- EN: Comprehensive guide to property acquisition, legal checks, taxes, and purchase costs.
- DE: Umfassender Leitfaden zu Kaufabwicklung, rechtlicher Prüfung, Steuern und Nebenkosten.

**KLJUČ: `buying.introStatement`**

- HR: Državljani EU kupuju nekretnine u Hrvatskoj pod jednakim uvjetima kao i hrvatski državljani.
- EN: EU citizens buy property in Croatia under the exact same conditions as Croatian citizens.
- DE: EU Bürger kaufen Immobilien in Kroatien zu den gleichen Bedingungen wie kroatische Staatsbürger.

**KLJUČ: `buying.introBody`**

- HR: Čest strah stranih kupaca jest kupnja u nepoznatom pravnom okruženju. Sottomonte osigurava potpunu pravnu sigurnost: stručna provjera vlasničkog lista, građevinskih dozvola te vođenje postupka s ovlaštenim odvjetnikom i javnim bilježnikom.
- EN: Foreign buyers often fear navigating unfamiliar real estate laws and language barriers. Sottomonte guarantees complete transparency: title searches, permit checks, and attorney-backed contracts.
- DE: Die Sorge ausländischer Käufer vor unübersichtlichen Rechtslagen ist verständlich. Sottomonte garantiert vollständige Transparenz: Grundbuchprüfung, Baugenehmigungen und zweisprachige Verträge.

**KLJUČ: `buying.processTitle`**

- HR: Kako izgleda postupak kupnje nekretnine
- EN: Step-by-step property purchase process
- DE: Schritt für Schritt zum Immobilienkauf

**KLJUČ: `buying.processSteps.0.title`**

- HR: Razgovor i definiranje kriterija
- EN: Initial consultation
- DE: Erstgespräch und Kriterien

**KLJUČ: `buying.processSteps.0.body`**

- HR: Analiziramo vaše potrebe i predlažemo odgovarajuće nekretnine na Pelješcu, uključujući ponudu izvan javnih oglasnika.
- EN: We analyze your criteria and propose matching Pelješac properties, including off-market options.
- DE: Wir analysieren Ihre Wünsche und präsentieren passende Objekte auf Pelješac, auch off-market.

**KLJUČ: `buying.processSteps.1.title`**

- HR: Organizacija obilazaka
- EN: Property viewings
- DE: Besichtigungen vor Ort

**KLJUČ: `buying.processSteps.1.body`**

- HR: Obilazimo nekretnine bez pritiska. Objašnjavamo detalje o lokaciji, infrastrukturi i potencijalu ulaganja.
- EN: We inspect properties together without pressure, detailing location advantages, infrastructure, and investment ROI.
- DE: Wir besichtigen Immobilien ohne Druck und erklären Lage, Infrastruktur und Wertentwicklung.

**KLJUČ: `buying.processSteps.2.title`**

- HR: Pravna provjera dokumentacije
- EN: Legal document check
- DE: Rechtliche Dokumentenprüfung

**KLJUČ: `buying.processSteps.2.body`**

- HR: Prije izrade ugovora detaljno provjeravamo zemljišne knjige, katastar, terete i uporabne dozvole.
- EN: Before any deposit, our legal team verifies title deeds, land registry entries, encumbrances, and building permits.
- DE: Vor jeder Anzahlung prüfen wir Grundbuch, Kataster, Lasten und Baugenehmigungen gründlich.

**KLJUČ: `buying.processSteps.3.title`**

- HR: Kupoprodajni ugovor i ovjera
- EN: Contract and notarization
- DE: Kaufvertrag und Notar

**KLJUČ: `buying.processSteps.3.body`**

- HR: Odvjetnik sastavlja dvojezični kupoprodajni ugovor. Potpisi se ovjeravaju kod javnog bilježnika, a postupak je moguć i putem punomoći.
- EN: An attorney drafts a bilingual contract. Signatures are certified by a notary, with power of attorney support available.
- DE: Ein Anwalt erstellt einen zweisprachigen Kaufvertrag. Die Beglaubigung erfolgt beim Notar, auch per Vollmacht möglich.

**KLJUČ: `buying.processSteps.4.title`**

- HR: Porez, uknjižba vlasništva i primopredaja
- EN: Tax filing, title registration, handover
- DE: Steuer, Grundbucheintrag und Übergabe

**KLJUČ: `buying.processSteps.4.body`**

- HR: Prijavljujemo porez na promet nekretnina, podnosimo prijedlog za uknjižbu u zemljišne knjige i organiziramo primopredaju.
- EN: We handle the real estate transfer tax declaration, land registry submission, and official key handover.
- DE: Wir übernehmen die Grunderwerbsteuer-Meldung, den Grundbuchantrag und die kaufmännische Übergabe.

**KLJUČ: `buying.costsTitle`**

- HR: Pregled troškova kupnje nekretnine
- EN: Overview of property purchase costs
- DE: Übersicht der Kaufnebenkosten

**KLJUČ: `buying.costsIntro`**

- HR: Uz ugovorenu cijenu nekretnine, dodatni troškovi kupnje u Hrvatskoj iznose okvirno 4% do 5%. Detaljan prikaz:
- EN: In addition to the agreed purchase price, expect additional purchase costs in Croatia of roughly 4% to 5%:
- DE: Zusätzlich zum Kaufpreis fallen in Kroatien Nebenkosten von ca. 4% bis 5% an. Hier die Aufstellung:

**KLJUČ: `buying.costs.0.label`**

- HR: Porez na promet nekretnina
- EN: Real estate transfer tax
- DE: Grunderwerbsteuer

**KLJUČ: `buying.costs.0.value`**

- HR: 3%
- EN: 3%
- DE: 3%

**KLJUČ: `buying.costs.0.note`**

- HR: Plaća se jednokratno nakon kupnje. Kod novogradnji s obračunatim PDV-om ovaj se porez ne plaća.
- EN: One-time payment after acquisition. Exempt for new developments where VAT is included in the price.
- DE: Einmalige Zahlung nach dem Kauf. Entfällt bei Neubauten mit ausgewiesener Mehrwertsteuer.

**KLJUČ: `buying.costs.1.label`**

- HR: Javni bilježnik i uknjižba
- EN: Notary and land registry fees
- DE: Notar- und Grundbuchgebühren

**KLJUČ: `buying.costs.1.value`**

- HR: 200 do 500 €
- EN: €200 to €500
- DE: 200 bis 500 €

**KLJUČ: `buying.costs.1.note`**

- HR: Troškovi ovjere potpisnih izjava i takse za upis prava vlasništva u zemljišne knjige.
- EN: Fees for signature notarization and land registry court submission fees.
- DE: Gebühren für Unterschriftsbeglaubigungen und Eintragungsantrag ins Grundbuch.

**KLJUČ: `buying.costs.2.label`**

- HR: Odvjetnik
- EN: Lawyer
- DE: Anwalt

**KLJUČ: `buying.costs.2.value`**

- HR: oko 1%
- EN: about 1%
- DE: etwa 1%

**KLJUČ: `buying.costs.2.note`**

- HR: Nije obavezan, ali ga preporučujemo. Radimo s provjerenim odvjetnicima koji govore vaš jezik.
- EN: Not mandatory, but we recommend one. We work with trusted lawyers who speak your language.
- DE: Nicht verpflichtend, aber empfohlen. Wir arbeiten mit bewährten Anwälten, die Ihre Sprache sprechen.

**KLJUČ: `buying.costs.3.label`**

- HR: Posrednička provizija
- EN: Agency commission
- DE: Maklerprovision

**KLJUČ: `buying.costs.3.value`**

- HR: prema ugovoru
- EN: per agreement
- DE: laut Vertrag

**KLJUČ: `buying.costs.3.note`**

- HR: Dogovara se transparentno i unaprijed, prije prvog obilaska.
- EN: Agreed transparently and up front, before the first viewing.
- DE: Wird transparent und im Voraus vereinbart, vor der ersten Besichtigung.

**KLJUČ: `buying.faqTitle`**

- HR: Česta pitanja o kupnji
- EN: Frequently asked questions about buying
- DE: Häufige Fragen zum Kauf

**KLJUČ: `buying.faq.0.question`**

- HR: Mogu li kao stranac kupiti nekretninu u Hrvatskoj?
- EN: Can I buy property in Croatia as a foreigner?
- DE: Kann ich als Ausländer in Kroatien eine Immobilie kaufen?

**KLJUČ: `buying.faq.0.answer`**

- HR: Građani EU-a kupuju bez ikakvih ograničenja, jednako kao hrvatski državljani. Državljani trećih zemalja trebaju suglasnost Ministarstva pravosuđa po načelu uzajamnosti ili kupuju putem hrvatske tvrtke. Kroz oba postupka vodimo vas mi.
- EN: EU citizens buy without any restrictions, exactly like Croatian citizens. Non-EU citizens need consent from the Ministry of Justice based on reciprocity, or buy through a Croatian company. We guide you through either route.
- DE: EU-Bürger kaufen ohne jede Einschränkung, genau wie kroatische Staatsbürger. Bürger aus Drittstaaten benötigen eine Genehmigung des Justizministeriums nach dem Gegenseitigkeitsprinzip oder kaufen über eine kroatische Gesellschaft. Durch beide Verfahren führen wir Sie.

**KLJUČ: `buying.faq.1.question`**

- HR: Koliki su ukupni troškovi uz cijenu nekretnine?
- EN: What are the total costs on top of the price?
- DE: Wie hoch sind die Gesamtkosten zusätzlich zum Kaufpreis?

**KLJUČ: `buying.faq.1.answer`**

- HR: Okvirno 4 do 5% povrh cijene: porez na promet nekretnina od 3%, javni bilježnik i uknjižba te odvjetnik. Posrednička provizija dogovara se unaprijed, prije prvog obilaska.
- EN: Roughly 4 to 5% extra: the 3% transfer tax, notary and land registry fees, and a lawyer. The agency commission is agreed up front, before the first viewing.
- DE: Etwa 4 bis 5% zusätzlich: 3% Grunderwerbsteuer, Notar und Grundbuch sowie Anwalt. Die Maklerprovision wird im Voraus vereinbart, vor der ersten Besichtigung.

**KLJUČ: `buying.faq.2.question`**

- HR: Koliko traje kupnja?
- EN: How long does buying take?
- DE: Wie lange dauert der Kauf?

**KLJUČ: `buying.faq.2.answer`**

- HR: Od dogovora do potpisa ugovora obično prođe dva do četiri tjedna, a s porezom i uknjižbom cijeli postupak traje četiri do osam tjedana. Ključeve u pravilu preuzimate odmah po isplati.
- EN: From agreement to signing usually takes two to four weeks, and with tax and registration the whole process takes four to eight weeks. You normally receive the keys right after payment.
- DE: Von der Einigung bis zur Vertragsunterzeichnung vergehen meist zwei bis vier Wochen, mit Steuer und Grundbucheintrag dauert das gesamte Verfahren vier bis acht Wochen. Die Schlüssel erhalten Sie in der Regel direkt nach der Zahlung.

**KLJUČ: `buying.faq.3.question`**

- HR: Moram li biti u Hrvatskoj za kupnju?
- EN: Do I need to be in Croatia to buy?
- DE: Muss ich für den Kauf in Kroatien sein?

**KLJUČ: `buying.faq.3.answer`**

- HR: Ne. Uz punomoć ovjerenu kod javnog bilježnika ili u hrvatskom konzulatu cijeli postupak možemo odraditi bez vašeg dolaska.
- EN: No. With a power of attorney certified by a notary or at a Croatian consulate, we can complete the entire process without you travelling.
- DE: Nein. Mit einer beim Notar oder im kroatischen Konsulat beglaubigten Vollmacht können wir das gesamte Verfahren ohne Ihre Anreise abwickeln.

**KLJUČ: `buying.faq.4.question`**

- HR: Što sve provjeravate prije kupnje?
- EN: What do you check before a purchase?
- DE: Was prüfen Sie vor dem Kauf?

**KLJUČ: `buying.faq.4.answer`**

- HR: Vlasništvo 1/1, terete i hipoteke, usklađenost katastra i zemljišnih knjiga te građevinsku i uporabnu dozvolu. Ako nešto nije čisto, saznat ćete to od nas, prije ponude.
- EN: Clean 1/1 ownership, liens and mortgages, cadastre and land registry alignment, and building and usage permits. If something is not clean, you will hear it from us, before the offer.
- DE: Eigentum 1/1, Lasten und Hypotheken, die Übereinstimmung von Kataster und Grundbuch sowie Bau- und Nutzungsgenehmigung. Wenn etwas nicht sauber ist, erfahren Sie es von uns, vor dem Angebot.

**KLJUČ: `buying.faq.5.question`**

- HR: Mogu li nekretninu iznajmljivati turistima?
- EN: Can I rent the property out to tourists?
- DE: Darf ich die Immobilie an Touristen vermieten?

**KLJUČ: `buying.faq.5.answer`**

- HR: Da, uz rješenje o kategorizaciji. Postupak je standardan i pomažemo vam ga pokrenuti nakon kupnje.
- EN: Yes, with a categorization permit. The procedure is standard and we help you start it after the purchase.
- DE: Ja, mit einem Kategorisierungsbescheid. Das Verfahren ist Standard, und wir helfen Ihnen, es nach dem Kauf einzuleiten.

---

# Selling page (/selling)

*Pitch columns, five-step timeline, FAQ, seller form.*


**KLJUČ: `selling.title`**

- HR: Prodajete na Pelješcu?
- EN: Selling on Pelješac?
- DE: Sie verkaufen auf Pelješac?

**KLJUČ: `selling.subtitle`**

- HR: Vjerojatno već poznajemo kupca za vašu nekretninu.
- EN: We probably already know the buyer for your property.
- DE: Wahrscheinlich kennen wir den Käufer für Ihre Immobilie bereits.

**KLJUČ: `selling.pitchTitle`**

- HR: Ozbiljni kupci, bez gubljenja vremena
- EN: Serious buyers, no time wasted
- DE: Ernsthafte Käufer, keine Zeitverschwendung

**KLJUČ: `selling.pitchItems.0.title`**

- HR: Međunarodni doseg
- EN: International reach
- DE: Internationale Reichweite

**KLJUČ: `selling.pitchItems.0.body`**

- HR: Naši kupci dolaze iz Njemačke, Austrije i Švicarske, Velike Britanije i Skandinavije. Provjereni su i s jasnim budžetom.
- EN: Our buyers come from Germany, Austria and Switzerland, the UK and Scandinavia. They are vetted and have clear budgets.
- DE: Unsere Käufer kommen aus Deutschland, Österreich und der Schweiz, aus Großbritannien und Skandinavien. Sie sind geprüft und haben ein klares Budget.

**KLJUČ: `selling.pitchItems.1.title`**

- HR: Prezentacija koja prodaje
- EN: Presentation that sells
- DE: Präsentation, die verkauft

**KLJUČ: `selling.pitchItems.1.body`**

- HR: Profesionalna fotografija, snimke dronom i iskreno predstavljanje. Bez uljepšavanja koje se osveti na razgledavanju.
- EN: Professional photography, drone footage and honest presentation. No embellishment that backfires at the viewing.
- DE: Professionelle Fotografie, Drohnenaufnahmen und ehrliche Darstellung. Keine Beschönigung, die sich bei der Besichtigung rächt.

**KLJUČ: `selling.pitchItems.2.title`**

- HR: Diskrecija po želji
- EN: Discretion available
- DE: Diskretion auf Wunsch

**KLJUČ: `selling.pitchItems.2.body`**

- HR: Ne želite oglas? Nekretninu nudimo tiho, samo provjerenim kupcima iz naše baze.
- EN: Don't want a public listing? We offer your property quietly, only to vetted buyers from our network.
- DE: Sie möchten kein öffentliches Inserat? Wir bieten Ihre Immobilie still an, nur geprüften Käufern aus unserem Netzwerk.

**KLJUČ: `selling.processTitle`**

- HR: Pet koraka do prodaje
- EN: Five steps to a sale
- DE: Fünf Schritte zum Verkauf

**KLJUČ: `selling.processSteps.0.title`**

- HR: Besplatna procjena i obilazak
- EN: Free valuation & visit
- DE: Kostenlose Bewertung & Besichtigung

**KLJUČ: `selling.processSteps.0.body`**

- HR: Dolazimo na lokaciju, gledamo nekretninu i dajemo realnu procjenu vrijednosti.
- EN: We come to the property, take a look and give you a realistic estimate of its value.
- DE: Wir kommen vor Ort, sehen uns die Immobilie an und geben Ihnen eine realistische Werteinschätzung.

**KLJUČ: `selling.processSteps.1.title`**

- HR: Provjera dokumentacije
- EN: Documentation check
- DE: Prüfung der Unterlagen

**KLJUČ: `selling.processSteps.1.body`**

- HR: Uočavamo probleme u papirima prije nego što ih uoče kupci i pomažemo ih riješiti.
- EN: We flag issues in the paperwork before buyers do and help you resolve them.
- DE: Wir erkennen Probleme in den Unterlagen, bevor Käufer sie erkennen, und helfen, sie zu lösen.

**KLJUČ: `selling.processSteps.2.title`**

- HR: Prezentacija i marketing
- EN: Presentation & marketing
- DE: Präsentation & Marketing

**KLJUČ: `selling.processSteps.2.body`**

- HR: Fotografija, dron, tekstovi na tri jezika i plasman prema pravim kupcima.
- EN: Photography, drone, copy in three languages, and placement with the right buyers.
- DE: Fotografie, Drohne, Texte in drei Sprachen und Platzierung bei den richtigen Käufern.

**KLJUČ: `selling.processSteps.3.title`**

- HR: Razgledavanja i pregovori
- EN: Viewings & negotiation
- DE: Besichtigungen & Verhandlung

**KLJUČ: `selling.processSteps.3.body`**

- HR: Vodimo razgledavanja i pregovaramo u vašem interesu, bez pritiska.
- EN: We run the viewings and negotiate in your interest, without pressure.
- DE: Wir führen die Besichtigungen und verhandeln in Ihrem Interesse, ohne Druck.

**KLJUČ: `selling.processSteps.4.title`**

- HR: Zatvaranje
- EN: Closing
- DE: Abschluss

**KLJUČ: `selling.processSteps.4.body`**

- HR: Odvjetnici, javni bilježnik, porezi. Vodimo vas do isplate i primopredaje.
- EN: Lawyers, notary, taxes. We guide you through to payment and handover.
- DE: Anwälte, Notar, Steuern. Wir begleiten Sie bis zur Zahlung und Übergabe.

**KLJUČ: `selling.formTitle`**

- HR: Recite nam nešto o nekretnini
- EN: Tell us about your property
- DE: Erzählen Sie uns von Ihrer Immobilie

**KLJUČ: `selling.formLocation`**

- HR: Lokacija
- EN: Location
- DE: Lage

**KLJUČ: `selling.formType`**

- HR: Tip nekretnine
- EN: Property type
- DE: Immobilientyp

**KLJUČ: `selling.formSize`**

- HR: Približna površina (m²)
- EN: Approximate size (m²)
- DE: Ungefähre Fläche (m²)

**KLJUČ: `selling.formMessage`**

- HR: Poruka
- EN: Message
- DE: Nachricht

**KLJUČ: `selling.faqTitle`**

- HR: Česta pitanja o prodaji
- EN: Frequently asked questions about selling
- DE: Häufige Fragen zum Verkauf

**KLJUČ: `selling.faq.0.question`**

- HR: Kolika je provizija i tko je plaća?
- EN: What is the commission and who pays it?
- DE: Wie hoch ist die Provision und wer zahlt sie?

**KLJUČ: `selling.faq.0.answer`**

- HR: Provizija se dogovara ugovorom o posredovanju prije početka rada, transparentno i bez skrivenih troškova. Plaća je strana koja nas je angažirala, prema dogovoru.
- EN: The commission is set in the brokerage agreement before we start, transparently and with no hidden costs. It is paid by the party who engaged us, as agreed.
- DE: Die Provision wird im Maklervertrag festgelegt, bevor wir beginnen, transparent und ohne versteckte Kosten. Sie zahlt die Partei, die uns beauftragt hat, wie vereinbart.

**KLJUČ: `selling.faq.1.question`**

- HR: Koliko traje prodaja?
- EN: How long does a sale take?
- DE: Wie lange dauert ein Verkauf?

**KLJUČ: `selling.faq.1.answer`**

- HR: Realno oglašene nekretnine na Pelješcu prodaju se obično u roku od šest do dvanaest mjeseci. Precijenjene stoje godinama, zato prvo dajemo iskrenu procjenu.
- EN: Realistically priced properties on Pelješac usually sell within six to twelve months. Overpriced ones sit for years, which is why we start with an honest valuation.
- DE: Realistisch bewertete Immobilien auf Pelješac verkaufen sich meist innerhalb von sechs bis zwölf Monaten. Überteuerte stehen jahrelang, deshalb beginnen wir mit einer ehrlichen Bewertung.

**KLJUČ: `selling.faq.2.question`**

- HR: Što ako papiri nisu čisti?
- EN: What if the papers are not clean?
- DE: Was, wenn die Unterlagen nicht sauber sind?

**KLJUČ: `selling.faq.2.answer`**

- HR: To rješavamo prije oglašavanja. Provjeravamo vlasništvo, terete i dozvole te s odvjetnikom sređujemo što nedostaje, prije nego što kupac išta pita.
- EN: We solve that before listing. We check ownership, liens and permits, and sort out what is missing with a lawyer, before a buyer ever asks.
- DE: Das lösen wir vor der Vermarktung. Wir prüfen Eigentum, Lasten und Genehmigungen und klären mit einem Anwalt, was fehlt, bevor ein Käufer überhaupt fragt.

**KLJUČ: `selling.faq.3.question`**

- HR: Mogu li prodati diskretno, bez javnog oglasa?
- EN: Can I sell discreetly, without a public listing?
- DE: Kann ich diskret verkaufen, ohne öffentliches Inserat?

**KLJUČ: `selling.faq.3.answer`**

- HR: Da. Dio ponude nudimo samo provjerenim kupcima iz naše baze, bez fotografija na portalima i bez znatiželjnih susjeda.
- EN: Yes. Part of our portfolio is offered only to vetted buyers from our database, with no photos on portals and no curious neighbours.
- DE: Ja. Einen Teil unseres Angebots zeigen wir nur geprüften Käufern aus unserer Datenbank, ohne Fotos auf Portalen und ohne neugierige Nachbarn.

---

# Contact page (/contact)

*Contact details labels and the qualified contact form.*


**KLJUČ: `contact.title`**

- HR: Razgovarajmo.
- EN: Let's talk.
- DE: Sprechen wir.

**KLJUČ: `contact.detailsTitle`**

- HR: Kontakt podaci
- EN: Contact details
- DE: Kontaktdaten

**KLJUČ: `contact.email`**

- HR: E-mail
- EN: Email
- DE: E-Mail

**KLJUČ: `contact.address`**

- HR: Adresa
- EN: Address
- DE: Adresse

**KLJUČ: `contact.addressValue`**

- HR: Ul. Kralja Zvonimira 8, 20250 Orebić, Hrvatska
- EN: Ul. Kralja Zvonimira 8, 20250 Orebić, Croatia
- DE: Ul. Kralja Zvonimira 8, 20250 Orebić, Kroatien

**KLJUČ: `contact.hours`**

- HR: Radno vrijeme
- EN: Opening hours
- DE: Öffnungszeiten

**KLJUČ: `contact.hoursValue`**

- HR: Pon do sub, 9:00 do 18:00
- EN: Mon to Sat, 9:00 to 18:00
- DE: Mo bis Sa, 9:00 bis 18:00 Uhr

**KLJUČ: `contact.languages`**

- HR: Govorimo HR / EN / DE
- EN: We speak HR / EN / DE
- DE: Wir sprechen HR / EN / DE

**KLJUČ: `contact.formTitle`**

- HR: Pošaljite poruku
- EN: Send a message
- DE: Nachricht senden

**KLJUČ: `contact.interest`**

- HR: Zanima me
- EN: I'm interested in
- DE: Ich interessiere mich für

**KLJUČ: `contact.interestBuying`**

- HR: Kupnja
- EN: Buying
- DE: Kauf

**KLJUČ: `contact.interestSelling`**

- HR: Prodaja
- EN: Selling
- DE: Verkauf

**KLJUČ: `contact.interestOther`**

- HR: Ostalo
- EN: Other
- DE: Sonstiges

**KLJUČ: `contact.success`**

- HR: Hvala vam na poruci. Javit ćemo se u najkraćem mogućem roku.
- EN: Thank you for your message. We will reply as soon as possible.
- DE: Vielen Dank für Ihre Nachricht. Wir antworten so schnell wie möglich.

**KLJUČ: `contact.budget`**

- HR: Okvirni budžet
- EN: Approximate budget
- DE: Ungefähres Budget

**KLJUČ: `contact.budgetOptions.0`**

- HR: do € 200.000
- EN: up to € 200.000
- DE: bis € 200.000

**KLJUČ: `contact.budgetOptions.1`**

- HR: € 200.000 do € 500.000
- EN: € 200.000 to € 500.000
- DE: € 200.000 bis € 500.000

**KLJUČ: `contact.budgetOptions.2`**

- HR: € 500.000 do € 1.000.000
- EN: € 500.000 to € 1.000.000
- DE: € 500.000 bis € 1.000.000

**KLJUČ: `contact.budgetOptions.3`**

- HR: iznad € 1.000.000
- EN: over € 1.000.000
- DE: über € 1.000.000

**KLJUČ: `contact.timeline`**

- HR: Vremenski okvir
- EN: Timeframe
- DE: Zeitrahmen

**KLJUČ: `contact.timelineOptions.0`**

- HR: Što prije
- EN: As soon as possible
- DE: So bald wie möglich

**KLJUČ: `contact.timelineOptions.1`**

- HR: Unutar 6 mjeseci
- EN: Within 6 months
- DE: Innerhalb von 6 Monaten

**KLJUČ: `contact.timelineOptions.2`**

- HR: Unutar godine dana
- EN: Within a year
- DE: Innerhalb eines Jahres

**KLJUČ: `contact.timelineOptions.3`**

- HR: Tek razgledavam
- EN: Just looking
- DE: Ich schaue mich nur um

**KLJUČ: `contact.optional`**

- HR: Nije obavezno
- EN: Optional
- DE: Optional

---

# Village pages (/locations/[slug])

*Template strings for the per-village landing pages. {name} is replaced by the village name. Village descriptions themselves come from the CMS.*


**KLJUČ: `locations.metaTitle`**

- HR: {name}, nekretnine na Pelješcu | Sottomonte
- EN: {name}, property on Pelješac | Sottomonte
- DE: {name}, Immobilien auf Pelješac | Sottomonte

**KLJUČ: `locations.metaDescription`**

- HR: Kuće, zemljišta i stanovi u mjestu {name} na Pelješcu. Poznajemo svaku ulicu i svakog vlasnika osobno.
- EN: Houses, land and apartments in {name} on Pelješac. We know every street and every owner personally.
- DE: Häuser, Grundstücke und Wohnungen in {name} auf Pelješac. Wir kennen jede Straße und jeden Eigentümer persönlich.

**KLJUČ: `locations.aboutTitle`**

- HR: O mjestu
- EN: About the village
- DE: Über den Ort

**KLJUČ: `locations.propertiesTitle`**

- HR: Nekretnine u ponudi
- EN: Currently available
- DE: Aktuell im Angebot

**KLJUČ: `locations.viewFiltered`**

- HR: Pretražite s filterima
- EN: Browse with filters
- DE: Mit Filtern durchsuchen

**KLJUČ: `locations.emptyTitle`**

- HR: Za {name} pitajte nas izravno.
- EN: For {name}, ask us directly.
- DE: Für {name} fragen Sie uns direkt.

**KLJUČ: `locations.emptyBody`**

- HR: Da nemamo ništa javno oglašeno ne znači da nemamo ništa. Velik dio ponude na Pelješcu nikada ne izađe na internet, jer vlasnici tako žele. Recite nam što tražite i provjerit ćemo što je trenutno slobodno u mjestu {name}, uključujući i ono o čemu se još nije počelo govoriti.
- EN: Nothing listed publicly does not mean nothing available. A large part of what sells on Pelješac never reaches the internet, because the owners prefer it that way. Tell us what you are looking for and we will check what is free in {name} right now, including what nobody has started talking about yet.
- DE: Nichts öffentlich inseriert heißt nicht nichts verfügbar. Ein großer Teil dessen, was auf Pelješac verkauft wird, erreicht das Internet nie, weil die Eigentümer es so wollen. Sagen Sie uns, was Sie suchen, und wir prüfen, was in {name} gerade frei ist, auch das, worüber noch niemand spricht.

**KLJUČ: `locations.emptyCta`**

- HR: Recite nam što tražite
- EN: Tell us what you are looking for
- DE: Sagen Sie uns, was Sie suchen


---

# Napomena: stranica privatnosti

*Pravila privatnosti su pravni tekst, hardkodiran u `src/app/(site)/[locale]/privacy/page.tsx` i označen `noindex`, pa ne sudjeluje u SEO-u. Ako ga želite mijenjati, recite posebno.*

