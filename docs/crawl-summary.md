# Crawl of the current site (2026-10-29)

Source: https://www.valenciasmileexpert.com/ (Next.js + Sanity on Vercel, Elementor-style markup). `sitemap.xml` lists 56 URLs; all answered 200. Local copy of every page (HTML, extracted text/headings/FAQs/images, JSON-LD) was kept during the build; the URL list is in `docs/live-urls.txt`.

## Pages

- Home + 8 other pages: /about/, /appointment/, /contact/, /privacy-policy/, /sitemap/, /terms-and-services/, /testimonials/, /thank-you/
- 17 service pages (hub + 15 services + /tmj-treatments/)
- 30 blog posts at the site root (not under /blog/), index at /category/blogs/ (noindex on the live site, paginated /page/2/ and /page/3/)
- Footer “Patient Resources” lists New Patient Offer, Emergency Dental and New Patient Spanish as plain text (no pages exist for them on the live site; /new-patient-offer/ and /emergency-dental/ are new in this build, Spanish is out of scope until confirmed).
- /appointment/ holds only an embedded GoHighLevel form; /testimonials/ is an empty page with an H1; /sitemap/ is a short list of pages; /thank-you/ is indexable on the live site (noindex now).

## On-page issues found on the live site

- Titles over 60 characters: 24 (longest 124 chars). Missing meta descriptions: 32. Pages without exactly one H1: 6 (/about/, /appointment/, /services/, /sitemap/, /terms-and-services/, /thank-you/).
- Service pages carry a FAQPage schema; posts carry BlogPosting + FAQPage; every page prints the same Dentist node. aggregateRating is not printed anywhere.
- Blog bodies contain keyword-stuffed headings, forum/Reddit anecdotes (incl. medical tourism) and “Local SEO” sections; these were tightened (see content-flags.md).
- Several service pages reuse copy from other pages (e.g. an Invisalign process list on the bridges page, a veneers CTA on the whitening page).

## Redirects on the live site

Probed 2,879 old/alternative URLs. Besides the trailing-slash 308s and WordPress leftovers answering 410, the live site only redirects:

- /author/admin → /category/blogs/
- /author/valenciasmileexpert → /category/blogs/
- /dental-implants → /services/dental-implants/
- /dental-implants/ → /services/dental-implants/
- /index.php → /
- /page-sitemap.xml → /sitemap.xml
- /post-sitemap.xml → /sitemap.xml
- /sitemap_index.xml → /sitemap.xml

All of these are kept in `redirects.ts` (301, no chains), plus a few obvious variants. All 56 live URLs are unchanged.

## Images

- 98 distinct image files referenced. Practice-owned photos reused in the new design: 13 team/office/doctor photos and 14 before/after case photos (public/images/team, public/images/cases). The doctor cut-outs had a blue glow baked into the PNG; it was removed with a chroma key for the new hero (replace with the new portrait when supplied).
- Stock photos on the live site (service category cards, “woman in dental chair”, “family”, “CBCT scan”, “man with mirror”, model tooth) are NOT used in the new design.
- The 28 blog hero images are AI/stock images from the live posts; they were migrated with the articles and are flagged for replacement (two contain garbled generated text).
- The old logo is not used; a placeholder wordmark/tooth mark stands in until the SVG logo arrives (components/layout/Logo.tsx, scripts/favicons.ts).

## Gaps (need from the client)

1. New logo (SVG) and the new photo set: doctor portrait with a clean background (hero), office/team photos at ≥2000px, treatment photos per service, before/after cases with consent.
2. Sanity project ID for this site (sanity/env.ts) and an Editor token for `npm run seed`; CORS origins to add in sanity.io/manage.
3. GoHighLevel webhook URL (GHL_WEBHOOK_URL in Vercel); whether to keep the embedded GHL form anywhere (currently replaced by the native form).
4. Confirmation of: Spanish pages in scope?; the two new landing pages (/new-patient-offer/, /emergency-dental/); service-area list; display face (Fraunces vs Cal Sans); the $59 offer fine print; sedation types to name publicly; the content flags in docs/content-flags.md.
5. Google reviews: the five reviews on the live site were kept verbatim; supply more (or connect a reviews widget) if wanted. The rating (4.9, 180) must be updated in lib/site.ts / Site settings when it changes.
