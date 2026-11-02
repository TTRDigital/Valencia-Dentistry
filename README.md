# Valencia Dentistry website

A new, premium website for Valencia Dentistry (27420 Tourney Rd, Suite 240, Santa Clarita / Valencia, CA), built by TTR Digital Marketing. It keeps the structure, URLs and verified facts of the current site (valenciasmileexpert.com, "Valencia Smile Expert") and applies the new Valencia Dentistry identity: the V + tooth logo, and the charcoal / olive / warm grey / greige / ivory palette with the logo bronze for highlights. Stack: Next.js 16 (App Router, React Server Components), TypeScript, Tailwind CSS 4, next/image, next/font, Sanity CMS embedded at `/cms`, Vercel.

## What is here

- **All 56 URLs of the current site**, unchanged (home, 16 service pages incl. `/tmj-treatments/`, about, contact, appointment, testimonials, thank-you, privacy, terms, sitemap, blog index `/category/blogs/` and 30 articles at the site root). `npm run audit` checks that every old URL still answers 200.
- **Two new landing pages** (to confirm): `/new-patient-offer/` and `/emergency-dental/`. Spanish pages are not built (out of scope until confirmed).
- **Brand**: logo vectorized from the supplied artwork (`public/brand/logo-mark.svg`, `logo-stacked.svg`, `logo-horizontal.svg`; paths in `components/layout/logo-paths.ts`), favicons and the Open Graph image generated from it (`npm run favicons`). Replace the paths with the designer's master SVG when available.
- **Design**: follows the Ideal Dental Solutions design language (Urbanist type, cream and near-black flat sections, full-bleed photo heroes, square photos and buttons) in the Valencia Dentistry colours. Reference at `/styleguide/` (noindex) with the WCAG AA contrast table.
- **Content** lives in `content/` as JSON (services, posts, pages, legal, people, testimonials, before/after cases, navigation). It is the built-in copy the site renders from today and the source for `npm run seed` once the Sanity project exists. The site reads from Sanity automatically when the project ID is pinned (`sanity/env.ts`) and falls back to the built-in copy per collection.
- **Native forms** (appointment, contact, landing pages): accessible, inline validation, honeypot + time trap, optional Cloudflare Turnstile, no-JS fallback. Leads POST to the GoHighLevel webhook (`GHL_WEBHOOK_URL`), payload documented below.
- **SEO**: unique titles/descriptions, one H1 per page, canonicals, generated 1200×630 Open Graph images (`/og/`), `sitemap.xml`, `robots.txt`, favicon set + web manifest, JSON-LD (Dentist/LocalBusiness, Person, WebSite, WebPage, BreadcrumbList, MedicalProcedure + Service on service pages, BlogPosting on posts, FAQPage wherever FAQs are shown). `aggregateRating` is printed only on the home page, where the rating and reviews are visible.
- **Tracking**: Google Tag Manager `GTM-PPV3TDK8`, loaded after the first interaction or 6s after load (never render-blocking).

## Setup

1. `npm install`, then `npm run dev` → http://localhost:3000 (and `/cms` once Sanity is configured).
2. Copy `.env.example` to `.env.local`. Nothing secret is in the repo: the webhook URL, tokens and keys are environment variables only.
3. **Sanity** (not connected yet, see “Open items”): create the project at sanity.io/manage, set `projectId` in `sanity/env.ts` (pinned on purpose; the global `NEXT_PUBLIC_SANITY_PROJECT_ID` of this build environment belongs to another site and is never read), add CORS origins (`http://localhost:3000`, the Vercel preview URL, `https://valenciasmileexpert.com`, `https://www.valenciasmileexpert.com`, with credentials), then `SANITY_WRITE_TOKEN=<editor token> npm run seed` (writes through `api.sanity.io/v2024-01-01/projects/<id>/datasets/production/mutate`). `npm run seed -- --force` overwrites, `-- --dry-run` validates. Photos stay in `/public/images` and are referenced by path; editors can upload replacements in `/cms`, which take precedence.
4. **Publish webhook**: Sanity > API > Webhooks → `https://<site>/api/revalidate/`, secret = `SANITY_REVALIDATE_SECRET`. Pages also revalidate every 5 minutes.
5. **Domain**: the site is built for `valenciadentistryca.com` (business card). Add the old domain `valenciasmileexpert.com` to the same Vercel project and set it to redirect (301) to the new one so every old URL keeps working; or set `NEXT_PUBLIC_SITE_URL` to the old domain if it stays.
6. **Vercel**: import the repo, framework Next.js, add the variables from `.env.example` (`NEXT_PUBLIC_SITE_URL`, `GHL_WEBHOOK_URL`, `SANITY_REVALIDATE_SECRET`, optional Turnstile/Resend). Production deploys come from the default branch.

## Editing in /cms

- **Pages** (home, about, contact, appointment, thank-you, testimonials, services, new-patient-offer, emergency-dental): a section builder. Each section type (hero, intro with photo, feature grid, values, service categories, before/after, doctor, reviews, FAQ, visit, CTA, text, team, photo grid, form, insurance, offer, all services) has its own fields; the layout is fixed in code so edits cannot break the design.
- **Services**: hero, intro, who it's for, benefits, options, process steps, technology, care guide, cost note, FAQs, related services, CTA, SEO.
- **Blog posts**: title, slug, category, tags, dates, hero image, excerpt, key takeaways, body (rich text with tables), FAQ, related services/posts, SEO.
- **Doctor & team, Testimonials, Before/after cases, FAQ library, Legal pages, Navigation (header mega menu, footer), Site settings** (name, phone, address, hours, offer, booking URL, social, rating, areas served).
- Every document has an SEO tab (title, description, social image, noindex, canonical).

## Forms and leads

`components/forms/LeadForm.tsx` → `POST /api/lead/` → `lib/lead.ts`. Fields: first name, last name, phone (required), email, service of interest, preferred time, message, consent checkbox. Spam: hidden `website` honeypot, a time trap (submissions under 3 seconds after render are dropped), optional Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`). On success the visitor is sent to `/thank-you/`; if delivery fails the form shows the phone number and the lead is logged server-side with full details (never lost silently).

Webhook payload (JSON): `source`, `form`, `tags`, `submitted_at`, `name`, `first_name`, `last_name`, `email`, `phone` (E.164, `+1…`), `phone_raw`, `service`, `preferred_time`, `message`, `comments`, `consent`, `page_url`, `utm_*` (captured from the landing URL and kept in sessionStorage), and `fields` (every label → value). Optional email copy through Resend (`RESEND_API_KEY`, `LEAD_EMAIL_TO`). Tested end to end at 1440px and 390px against a local webhook catcher; **no test lead was sent to the real webhook**.

## Redirects

`redirects.ts` (loaded by `next.config.ts`): the live site's own redirects (`/sitemap_index.xml`, `/page-sitemap.xml`, `/post-sitemap.xml` → `/sitemap.xml`; `/index.php` → `/`; `/author/*` → `/category/blogs/`; `/dental-implants` → `/services/dental-implants/`) plus obvious variants (`/about-us`, `/contact-us`, `/blog`, services at wrong depths, `/<page>/feed`). All 301, no chains. Trailing-slash variants are answered by Next.js. See `docs/crawl-summary.md` for the probe.

## Scripts

```bash
npm run dev          # local site
npm run build        # production build (type-checks)
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run images       # image manifest (sizes + blur placeholders) and static hero variants (public/images/_opt)
npm run favicons     # favicon set from public/logo.svg (the brand mark) on an ivory tile
node --experimental-strip-types scripts/build-services.ts <crawl-dir>   # rebuild content/services from the crawled live pages (original wording)
npm run seed         # publish content/ to Sanity (needs SANITY_WRITE_TOKEN; --force, --dry-run)
node scripts/check-images.mjs [url]   # every image loads; no stock/AI images
npm run audit -- https://<site>   # launch checks: lang/charset, one H1, titles, descriptions, canonical, OG image, JSON-LD, alt text, links, old URLs
npm run screenshots -- http://localhost:3000   # full-page screenshots at 390/768/1024/1440/1920 + overflow check (needs Playwright)
```

Lighthouse (mobile) was run locally through an HTTP/2 proxy; see `docs/qa-report.md` for the numbers and how they were measured. Re-run on the Vercel preview with PageSpeed Insights before launch.

## Where things are

| Part | Where |
|---|---|
| Design tokens, type scale, components | `app/globals.css`, `lib/design.ts`, `lib/fonts.ts`, `components/ui/*` |
| Header / mega menu / mobile menu, footer, mobile bar | `components/layout/*` |
| Page sections (section builder) | `components/sections/*`, rendered by `components/PageView.tsx` |
| Service template | `components/ServiceView.tsx`, routes `app/services/[...slug]`, `app/tmj-treatments` |
| Blog | `components/PostView.tsx`, `components/BlogIndexPage.tsx`, routes `app/[slug]`, `app/category/blogs` |
| Content access (Sanity or built-in) | `lib/content/*`, types in `lib/types.ts` |
| Markdown ↔ Portable Text | `lib/markdown.ts`, `lib/portable.ts` |
| SEO helpers and JSON-LD | `lib/seo.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/og/route.tsx` |
| Practice facts | `lib/site.ts` (overridden by Site settings in Sanity) |
| Sanity schema / Studio | `sanity/*`, `sanity.config.ts`, `app/cms` |
| Docs | `docs/crawl-summary.md`, `docs/content-flags.md`, `docs/qa-report.md`, `docs/live-urls.txt` |

## Open items

See the end of `docs/qa-report.md` for the current list (logo and photos, Sanity project, GHL webhook URL, confirmations).
