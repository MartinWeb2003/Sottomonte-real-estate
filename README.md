# Sottomonte

Real estate website for Sottomonte, a boutique agency on the Pelješac peninsula, Croatia.
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Sanity · next-intl (HR/EN/DE) · MapTiler · Resend.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the keys below
npm run dev                  # http://localhost:3000 → redirects to /hr
```

The site builds and runs without any keys configured — sections backed by CMS
content (properties, villages, testimonials, team) simply render empty until
Sanity is connected.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (create at sanity.io/manage) |
| `NEXT_PUBLIC_SANITY_DATASET` | usually `production` |
| `SANITY_API_TOKEN` | only needed for authenticated Studio actions |
| `RESEND_API_KEY` | form → email notifications (logged to console if unset) |
| `AGENCY_EMAIL` | where form submissions are delivered |
| `NEXT_PUBLIC_MAPTILER_KEY` | property / office maps |
| `NEXT_PUBLIC_GA_ID` | GA4 — loaded only after cookie consent |
| `NEXT_PUBLIC_SITE_URL` | canonical URL for sitemap / hreflang / OG |

## Content

The embedded Sanity Studio lives at `/studio`. Schemas: `property`,
`location` (village — the keystone schema), `testimonial`, `teamMember`.
Croatian content is the source of truth; EN/DE are translated from it, with
a DE → EN → HR fallback chain at render time.

## Commands

```bash
npm run dev          # Next.js dev
npm run build        # production build (must pass with 0 type errors)
npm run lint
npm run typecheck
npx sanity dev       # Studio standalone (optional)
```

## Notes

- Photography: current images under `public/images/` are stylized SVG
  placeholders. Replace with real Pelješac drone photography (see CLAUDE.md —
  no stock photos, ever).
- Agency contact details (phone, address, license number) are centralized in
  `src/lib/utils.ts` (`AGENCY`) and the footer license string in
  `messages/*.json` — update both before launch.
- Fonts are self-hosted (Fontsource Fraunces + Plus Jakarta Sans variable,
  latin + latin-ext) — no Google Fonts requests, GDPR-clean.
