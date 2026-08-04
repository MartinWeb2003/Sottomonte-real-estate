# CLAUDE.md — Sottomonte

Real estate website for **Sottomonte**, a boutique agency on the Pelješac peninsula, Croatia.

## Premise & positioning

Sottomonte is not a listings portal. The brand promise: **we know every location and every owner personally**. Mass portals show photos; Sottomonte knows the story behind every property — who owns it, why it's for sale, what the village is like, whether the papers are clean. Think local konoba vs. fast food — but NEVER use that metaphor literally in site copy. Translate it into: local knowledge, personal relationships, honest guidance.

Target audiences:
1. Foreign buyers (DE/AT/CH primarily, also UK/Scandinavia) — anxious about buying blind in Croatia, need trust + legal hand-holding
2. Croatian buyers — want insider access and honesty
3. Local sellers — want discretion and a partner who brings serious buyers

Every design and copy decision should build **trust** and **insider access**, not volume.

---

## Tech stack

- **Next.js 14+ (App Router), TypeScript, Tailwind CSS**
- **Rendering:** static-first. SSG + ISR (`revalidate: 3600`) for listings. No unnecessary client components.
- **CMS:** Sanity (embedded Studio at `/studio`), localized fields for HR/EN/DE
- **i18n:** `next-intl`, path-based routing: `/hr` (default), `/en`, `/de`
- **Maps:** MapTiler SDK (custom navy-toned style), gold markers
- **Forms:** Server Actions → Resend (email notifications to agency)
- **Fonts:** self-hosted via `next/font/local` (no Google Fonts requests — GDPR-clean)
- **Hosting:** Vercel (or Netlify), Sanity free tier
- **Analytics:** Cloudflare Web Analytics (cookieless, no consent banner needed)

---

## Design system

### Feel

"Quiet luxury with a local soul." References: Sotheby's International Realty (photography-first, UI disappears), Engel & Völkers (grid discipline, restraint — German buyers trust this visual language), The Agency (confident oversized type, editorial asymmetry). Warmer and more personal than all three — real Pelješac light, stone, sea. No sterile villa-catalog feel.

### Color tokens

```css
--white:      #FDFDFB;  /* warm white — page background. NOT #FFFFFF */
--navy:       #0E2A47;  /* primary dark — footer, CTA blocks, headings */
--navy-soft:  #1B3A5C;  /* hover states, secondary navy surfaces */
--gold:       #C9A96A;  /* muted brass accent — USE SPARINGLY */
--stone:      #EAE6DF;  /* RETIRED as a background. Token kept only for reference. */
--text-muted: #5C6B7A;  /* secondary text */
```

Rules:
- **Backgrounds are WHITE or NAVY only.** Never stone, never gold, never any third fill. Section rhythm is white → navy → white → navy. Image placeholders and small inset shapes may use `bg-navy/5` (a tint of the same navy), nothing else.
- Gold survives as 1px hairlines, small text accents and hover states ONLY. It must never fill a button, panel or section.
- **Gold discipline: max ONE gold element per viewport.** Gold is for hairlines, one word in a headline, and hover states. Never as a fill. Gold overused = tacky real estate.
- Single color exception: WhatsApp button may be WhatsApp green.

### Typography

- **Display:** Archivo (grotesque, `font-display` class) — headlines, prices, quotes, numbers, wordmark. Chosen for strength, stability, cleanliness and modernity: sturdy low-contrast stems and squared terminals read as architectural rather than decorative, and it is monumental set in caps.
- **Body/UI:** Inter (`font-sans`) — everything else. Large x-height and open counters keep long HR/EN/DE copy legible on screen.
- Both self-hosted variable fonts via Fontsource, `latin` + `latin-ext` (needed for š/č/ć/ž/đ). No Google Fonts requests — GDPR-clean.
- The two faces are both neutral sans, so **hierarchy comes from weight, size and case — not from a style clash.** Bold caps display against regular-weight body. Never introduce a third family to create contrast.
- Signature move: large display headline with one gold word — e.g. "Your partner on **Pelješac**"
- **Never use italics anywhere on the site** — no italic headlines, numbers, or quotes. Enforced globally in `globals.css` (`em`/`i`/`cite` render upright), so CMS rich text stays upright too.
- **All headings (h1–h4) render in CAPS** — enforced globally in `globals.css` via `text-transform: uppercase`, `letter-spacing: 0.02em` (caps need tracking to breathe) and `font-weight: 700` (Tailwind preflight resets headings to inherit/400, which reads thin in a grotesque). Never hand-add `uppercase` to a heading; never override it back to sentence case. Write headings in normal sentence case in JSX and message files — the transform is presentational, so screen readers and SEO still get the real text.
- **No eyebrows anywhere.** Section-name labels (`WHY SOTTOMONTE`, `HOW WE WORK`) and the hero location tag (`PELJEŠAC · CROATIA`) are all removed. The `Eyebrow` component has been deleted and `SectionHeader` has no eyebrow slot. Do not reintroduce either.
- The one surviving small-caps label is the village name on property cards and the property detail title row, styled inline with `tracking-eyebrow`.
- **No breadcrumbs on screen.** `PageHeader` renders the H1 only. The `BreadcrumbList` JSON-LD on the properties pages stays for SEO, since it is invisible.
- **Never use an em or en dash (—, –) in visible copy.** Use a comma, colon or full stop instead. Applies to all three message files and any hardcoded string.
- H1 ~72px desktop / ~40px mobile. Statement sections ~40px display, regular weight (deliberate contrast against bold caps headings).
- Prices always in display font, semibold, navy, formatted `€ 1.450.000` (dot thousands separator, space after €)

### Layout language

- Full-bleed hero imagery with navy gradient scrim (rgba(14,42,71,0.55) → transparent)
- Asymmetric editorial splits (60/40, 65/35) over centered symmetric blocks
- **Thin 1px gold hairlines** as signature accent: section dividers, under headings, column top-borders, card hovers
- Section padding: 120–160px desktop, 64–80px mobile. Generous whitespace everywhere.
- No boxes with visible borders; separation via whitespace and background alternation
- Property cards: image (4:3) → gold caps location → serif title → one-line spec row → serif navy price. No badges, ribbons, or overlay text.

### Motion

- Slow, cinematic. Fade-up on scroll (30px, 700ms, ease-out), images scale 1.03 on hover (600ms)
- Hero: slow Ken Burns zoom or looping muted drone video
- Nothing bouncy or springy. Everything eases "like a yacht docking."
- Respect `prefers-reduced-motion`

### Photography

- No stock photos, ever. Real properties, real drone footage, real people.
- Consistent grade: slightly warm, lifted shadows, golden-hour bias
- Land parcels: drone shots, not cadastre screenshots

### Anti-patterns (never do)

- Carousel arrows/dots everywhere; badge clutter ("EXCLUSIVE!", "NEW!")
- More than one gold element per viewport
- Boxed layouts with visible borders
- Stock people shaking hands
- Centered-everything symmetric layouts
- Literal McDonald's/konoba metaphor in copy

---

## Project structure

```
sottomonte/
├── CLAUDE.md
├── .env.local                    # SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN,
│                                 # RESEND_API_KEY, NEXT_PUBLIC_MAPTILER_KEY
├── messages/                     # next-intl UI strings
│   ├── hr.json  ├── en.json  └── de.json
├── sanity/
│   ├── schemas/
│   │   ├── property.ts
│   │   ├── location.ts
│   │   ├── testimonial.ts
│   │   └── teamMember.ts
│   └── lib/
│       ├── client.ts
│       └── queries.ts            # ALL GROQ queries centralized here
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        # Navbar + Footer + NextIntlClientProvider
│   │   │   ├── page.tsx          # Home
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx      # grid + filters via searchParams
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── selling/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── studio/[[...tool]]/page.tsx   # embedded Sanity Studio
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/          # Button, Chip, SectionHeader, HairlineDivider, Input, Textarea, Select, FadeUp
│   │   ├── layout/      # Navbar, Footer, LangSwitcher, MobileMenu
│   │   ├── property/    # PropertyCard, PropertyGrid, FilterBar, Gallery, Lightbox,
│   │   │                #   SpecGrid, InquiryCard, PapersStatus, SimilarProperties
│   │   ├── sections/    # Hero, IntroStatement, TheDifference, FeaturedProperties, FaqSection,
│   │   │                #   PeninsulaSection, HowWeWork, Testimonials, OffMarketTeaser,
│   │   │                #   FinalCTA, PageHeader
│   │   └── map/         # PropertyMap, PeninsulaMap
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── formatters.ts         # formatPrice, formatArea, formatSeaDistance
│   │   ├── actions.ts            # server actions: inquiry, sellerLead, buyerWishlist
│   │   └── seo.ts                # generateMetadata helpers + JSON-LD builders
│   ├── styles/globals.css        # CSS variables + font-face
│   └── types/index.ts
└── public/
    ├── images/                   # logo, og-image only
    └── fonts/
```

Conventions:
- `sections/` = page-specific compositions. `ui/` = design-system primitives that enforce consistency (Eyebrow, HairlineDivider, SectionHeader used everywhere — never hand-roll these inline).
- Server Components by default; `"use client"` only for: FilterBar, Gallery/Lightbox, maps, forms, Navbar scroll behavior, LangSwitcher.
- All GROQ queries live in `sanity/lib/queries.ts` — never inline in pages.
- `FinalCTA` is ONE shared component used on every page (navy block, serif headline, gold button, phone + WhatsApp visible).

---

## Sanity schemas

### `property`

| Field | Type | Notes |
|---|---|---|
| title | localized string (hr/en/de) | |
| slug | slug (from title.hr) | |
| status | string: available / reserved / sold | sold hidden from grid by default |
| featured | boolean | drives homepage Featured section (max 4) |
| location | reference → location | required |
| type | string: house / apartment / land / stone-ruin | "stone house for renovation" is a real Pelješac category |
| price | number (EUR) | |
| priceOnRequest | boolean | if true, show "Price on request" |
| area | number (m²) | building area; optional for land |
| landArea | number (m²) | |
| bedrooms, bathrooms, floors | number | optional |
| yearOrCondition | localized string | e.g. "Renovated 2021" |
| seaDistance | number (meters) | powers filter buckets |
| parking | boolean/string | |
| papersStatus | localized text | explicit honesty: "Vlasništvo 1/1, čisti papiri…" or what's pending |
| description | localized portable text | real insight, no boilerplate |
| gallery | array of images (hotspot) | first = card image |
| droneVideoUrl | url | optional |
| coordinates | geopoint | |
| exactLocationPublic | boolean | false → map shows approximate circle + "Exact location shared on inquiry" |

### `location` (village) — the keystone schema

| Field | Type | Notes |
|---|---|---|
| name | localized string | Orebić, Viganj, Kućište, Lovište, Trpanj, Ston… |
| slug | slug | |
| tagline | localized string | "wind, waves, and quiet luxury" |
| description | localized portable text | village character: wind, seasonality, neighbors, konoba/shop/school proximity |
| photos | array of images | |
| coordinates | geopoint | |

Used in THREE places: property detail "About the location" block, homepage peninsula section, footer SEO links. Write once, reuse everywhere.

### `testimonial`
quote (localized), authorName, authorOrigin ("Munich, Germany"), related property (optional ref).

### `teamMember`
name, role (localized), photo, phone, email, languages (array: HR/EN/DE), bio (localized). Direct contact per person — reinforces the personal premise.

---

## Pages — section by section

### 1. Home (`/[locale]`)

Section order: Hero → Featured properties → The difference → Peninsula → How we work → Testimonial → Off-market → FinalCTA. Inventory comes directly after the hero (proof of portfolio is the trust argument). The former IntroStatement was merged into TheDifference: one philosophy block, statement first, three proof columns after.

1. **Hero (100vh)** — full-bleed drone shot/video (golden hour coastline), navy scrim. Content bottom-LEFT: H1 "Your real estate partner on **Pelješac**" (gold word, upright), subline max-w 480px ("We don't just list properties. We know every location, every parcel, and every owner personally."), CTAs: solid white "View properties" + ghost white "Get in touch". Thin scroll indicator bottom-right. Navbar transparent → solid white on scroll (sticky), logo left, links + HR/EN/DE switcher right.
2. **Featured properties (white)** — header row: H2 left, "View all →" gold text-link right. 3 PropertyCards (featured=true), 1 col mobile.
3. **The difference (white, merged)** — centered statement block (60px gold hairline, display ~40px statement "Buying on a peninsula where everyone knows everyone requires a partner who actually does." + premise paragraph, from the `intro` namespace) followed by 3 columns, NO cards: gold 1px top-border each, gold number (01/02/03): "We've walked every parcel" / "We know the owners" / "We tell you the truth". `IntroStatement` component was deleted; `difference.title` key removed.
5. **Peninsula (navy, white text)** — H2 "One peninsula. A dozen worlds." Grid of 6 location tiles (photo, name, tagline) from `location` docs. Each links to the village landing page `/locations/{slug}`. (V2 option: stylized SVG map with gold dots + hover panels.)
6. **How we work (white)** — 4 steps on a thin gold connecting line: First conversation → Curated selection (incl. off-market) → Viewings together → Legal & closing (explicitly mention foreign-buyer support: EU citizens buy freely, we handle paperwork).
7. **Testimonial (navy)** — one large serif quote ~28px centered max-w 800px, gold quote ornament, attribution with origin. Multiple → slow auto-fade, NO arrows/dots.
8. **Off-market teaser (white, 50/50 split)** — detail photo left (stone wall/old door), right: "Some of our best properties never go online." + discretion line + CTA "Tell us what you're looking for" → deep-links to `/properties#wishlist` (the buyer-wishlist form anchor, `scroll-mt` clears the sticky navbar).
9. **FinalCTA (navy)** — shared component: "Let's find your place on Pelješac", gold button, phone + WhatsApp shown directly.

**Footer (navy, gold hairline top):** 4 cols — logo/one-liner/socials | Pages | Locations (links to `/locations/{slug}` village pages) | Contact. Bottom row: © Sottomonte 2026 · Privacy · agency license number (legally required in HR + trust signal).

### 2. Properties (`/[locale]/properties`)

1. **PageHeader (~40vh)** — photo banner, navy scrim, H1 "Properties on Pelješac", breadcrumb.
2. **FilterBar (static, NOT sticky — it must never follow the scroll and cover the off-market CTA; white, 1px hairline bottom)** — Location (multi-select villages), Type, Price range, Sea distance (<100m / <500m / <1km / any). Sort: Newest / Price ↑↓. Active filters = removable gold-outline chips. Results count. Mobile: "Filters" button → slide-over. **All filter state in URL searchParams** (`?location=viganj&type=land`) — shareable, SEO-friendly, homepage tiles deep-link into it.
3. **Grid** — 3/2/1 cols, PropertyCard, pagination or "Load more" (NO infinite scroll — kills footer + SEO). Sold hidden; reserved shown with subtle navy "Reserved" text (only allowed status label).
4. **Bottom CTA (white, always visible)** — "Didn't find it? Most of our portfolio is off-market." + short buyer-wishlist form (what you're looking for, budget, email/phone). Highest-value lead element on the site.

### 3. Property detail (`/[locale]/properties/[slug]`)

1. **Gallery** — 1 large + 2 stacked (Airbnb pattern), "View all photos (N)" → fullscreen Lightbox (keyboard + swipe). Drone video tab if `droneVideoUrl`.
2. **Title row** — left: gold caps location, serif H1, muted area line. Right: serif price ~36px + "≈ € X/m²" small. On scroll: sticky sub-bar (price + "Inquire" button), critical on mobile.
3. **Content split 65/35:**
   - Left: SpecGrid (2×4, thin-line navy icons: m², land, bedrooms, bathrooms, floors, condition, sea distance, parking) → "About this property" → **"About the location"** signature block (white bg, 2px gold left border, content from `location` ref) → PapersStatus block (explicit legal transparency).
   - Right (sticky): InquiryCard — real agent photo + name, phone, WhatsApp button (green allowed), form with message pre-filled "I'm interested in {title}". Below: "We speak HR / EN / DE".
4. **Map** — full-width, custom navy MapTiler style, gold marker. If `!exactLocationPublic`: approximate circle + note.
5. **SimilarProperties** — 3 cards: same village first, then same type/price range.

### 4. About — REMOVED

The About page was deleted on request. Its route, the `about` and `meta.about`
message namespaces, the `nav.about` link and the `/about` sitemap entry are all
gone. `teamMember` documents still power the property-detail InquiryCard via
`getFirstTeamMember`, so the schema stays. If the page ever returns, the village
coverage grid it used now lives in the shared `ui/VillageTile` component.

### 5. Selling (`/[locale]/selling`)

1. **PageHeader** — H1 "Selling on Pelješac?", subline "We already know the buyer for your property."
2. **Pitch (white, 3 columns, same pattern as home §3)** — International reach (DE/AT/CH, UK, Scandinavia) / Presentation that sells (pro photo, drone, honest staging) / Discretion available (off-market to vetted buyers).
3. **Process (`SellingTimeline`, client)** — 5 steps on a center gold line (md+), alternating sides: 01/03/05 left, 02/04 right; mobile keeps the line left. The gold line draws itself with scroll progress (scaleY, rAF-throttled) and steps slide in from their side; both collapse to static under prefers-reduced-motion. Steps: Free valuation & visit → Documentation check (we flag issues BEFORE buyers do) → Presentation & marketing → Viewings & negotiation → Closing (lawyers/notary). The former "Honest expectations" navy section was removed (its honesty message lives in the selling FAQ).
4. **FAQ** — 4 questions via `FaqSection` + `FAQPage` JSON-LD.
5. **Seller form (white)** — location, type, approx. size, name, phone/email, message. Alt: "Or just call us."
6. **FinalCTA**.

### 6. Buying (`/[locale]/buying`) — foreign-buyer funnel page

1. **PageHeader** — H1 "Buying on Pelješac", subline about walking every step together.
2. **Reassurance statement (white)** — "EU citizens buy property in Croatia as freely as Croatians do." + short paragraph defusing the buying-blind fear.
3. **Process (numbered, gold line, same pattern as selling)** — Conversation → Viewings → Documentation check → Contract & notary (power of attorney possible) → Tax, registration, keys.
4. **Costs (navy)** — honest cost table: 3% transfer tax, notary/land registry, lawyer ~1%, commission per agreement. No surprises positioning.
5. **FAQ** — 6 questions (can foreigners buy, total costs, timeline, remote purchase, what we verify, tourist rental) rendered via `FaqSection` + `FAQPage` JSON-LD (`faqJsonLd`). Structured data must always be built from the same translated array the section renders.
6. **FinalCTA**.

### 7. Village pages (`/[locale]/locations/[slug]`)

Static per-village landing pages, the SEO surface for "nekretnine {village}" queries. Content from the keystone `location` schema: PageHeader with village photo + tagline, "About the village" portable text + photo column, listings in that village (PropertyGrid) with a link into the filtered grid, FinalCTA. Empty state points to contact. In the sitemap these replaced the old `/properties?location=` query URLs.

### 8. Contact (`/[locale]/contact`)

1. Compact PageHeader — H1 "Let's talk".
2. 50/50 split — left: stacked contact details (phone, WhatsApp, email, address, hours, "HR / EN / DE"), small office map. Right: form (name, email, phone optional, interest: buying/selling/other, message). When interest = buying, two optional qualification selects appear: budget range and timeframe. Success state: warm confirmation + "We reply within 24 hours."
3. Keep page short. Footer follows.

---

## Funnel furniture (sitewide)

- **Navbar**: logo left; links (Home, Properties, Buying, Selling, Contact) + phone number (lg+, tel: link) + HR/EN/DE switcher right.
- **MobileContactBar**: fixed bottom call/WhatsApp bar on mobile, all pages (`layout/MobileContactBar.tsx`). WhatsApp green is the allowed exception.
- **TrustStrip** (`forms/TrustStrip.tsx`): compact row above every submit button — "We reply within 24 hours · Licensed agency, HGK · We speak HR / EN / DE". Rendered in all four forms.
- **FAQs**: `FaqSection` (native `<details>`, hairlines, no boxes) + `faqJsonLd`. Buying page has 6 items, Selling has 4.

## i18n rules

- Locales: `hr` (default), `en`, `de`. Path prefix always present (`/hr/...` included) for clean hreflang.
- UI strings in `messages/{locale}.json`; content localization in Sanity fields.
- Fallback chain: missing DE → EN → HR. Never render empty strings.
- Slugs: single slug from HR title shared across locales (simpler, fine for SEO with hreflang).
- Formatting: prices `€ 1.450.000` in all locales; areas `m²`; German copy uses formal "Sie".

## SEO

- `lib/seo.tsx`: per-page `generateMetadata` with localized title/description + hreflang alternates including `x-default` (points at hr). Meta titles lead with the search query per locale (e.g. DE "Immobilien auf Pelješac kaufen | Sottomonte"), descriptions end with a soft CTA.
- JSON-LD: `RealEstateAgent` (sitewide), `RealEstateListing` per property, `BreadcrumbList`, `FAQPage` on buying/selling.
- `sitemap.ts`: all pages × locales + all property slugs + `/locations/{slug}` village pages (query-param URLs are gone).
- OG images: property card image for listings; branded default elsewhere.
- Image alts always populated (Sanity field or generated from title + location).
- Performance targets: Lighthouse ≥ 95, LCP < 2.0s. `next/image` everywhere, hero image `priority`.

## Forms / server actions (`lib/actions.ts`)

Three actions, all → Resend email to agency + honeypot spam field + zod validation:
1. `submitInquiry` — property detail (includes property title + URL)
2. `submitSellerLead` — selling page
3. `submitBuyerWishlist` — properties bottom CTA + off-market teaser

GDPR: consent checkbox on all forms, link to privacy policy. Consent banner for GA4.

## Commands

```bash
npm run dev          # Next.js dev
npm run build        # production build (must pass with 0 type errors)
npm run lint
npx sanity dev       # if running Studio standalone
```

## Working agreements

- Mobile-first responsive; test 375px, 768px, 1440px.
- Croatian content is source of truth; EN/DE translated from it.
- No placeholder lorem ipsum in committed code — use realistic HR copy drafts.
- Every new section must use `SectionHeader` / `HairlineDivider` primitives, no inline re-implementations.
- Before adding ANY gold element, check the one-per-viewport rule.
