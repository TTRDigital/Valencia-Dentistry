# Image replacement and ozone removal: report

Status: **on staging (preview branch) only; not on production.**
Full per-file inventory: `docs/image-audit.md`.

## 1. Images replaced (old → client photo ID)

Layout and page structure are exactly as on the live site; only the photos changed. Every photo spot still has a photo.
The client supplied six office/doctor photos (01, 02, 05, 07, 09, 10), fewer than the photo spots on most pages, so on
request **some photos repeat on a page** (the brief's no-repeat rule could not be kept without removing photos or changing layouts).

| Page | Slot | New |
|---|---|---|
| Home | Hero | 01 |
| Home | "Exceptional Smiles" trio | 09, 10, 02 |
| Home | "A New Standard in Dentistry" banner | 05 |
| Home | Technology cards | 09, 10, 05 |
| Home | Free Invisalign Consultation | 02 |
| Home | Meet Dr. Nuriel Lavi | 07 |
| Home | "Smile Reimagined" steps | 01, 09, 10 |
| About | Hero / intro / team card / closing CTA | 01 / 05 / 07 / 09 |
| About | 8 technology cards | 09, 10, 01, 05, 02, 07, 09, 10 |
| About | OG image | 07 |
| Appointment | Hero / first-visit photos | 09 / 10, 01, 07, 05, 02 |
| Before & After | Hero / step photos | 01 / 09, 10, 02 |
| Before & After | Gallery (still 6 cases) | 03, 04, 06 replace three of the older cases (shown whole, same card size) |
| Contact / Emergency / Thank you | Hero | 10 / 09 / 01 |
| Special Offer | Offer photo | 10 |
| Services hub / Testimonials | Hero, CTA | 09, 10 / 01, 10 |
| Services hub and category pages | Service card photos | client photos in turn (09, 10, 01, 05, 07, 02) |
| All 16 treatment pages | Hero | 09 |
| All 16 treatment pages | Photo beside "Benefits & care" | 10; **Veneers: 08**, **Cosmetic Dentistry: 03** (whole image, not cropped) |
| All 16 treatment pages | Process step photos / closing banner | client photos in turn / 01 or 10 |
| Blog (31 posts) | Post photo | 09, 10, 01, 05, 07, 02 in turn |
| Blog | Author photo | 07 |
| Shared CTA default | Photo | 10 |
| JSON-LD | Dentist / Person / Article fallback | 01 / 07 / 01 |
| OG images | Home, blog index and pages / Services | 01 / 09 |

## 2. Removed

- No photo spot was removed; layouts are unchanged.
- Files deleted: 57 in `public/images/real/`, 6 in `public/images/team/`, all their `public/images/_opt/` WebP variants, and 16 old QA screenshots in `docs/screenshots/` that showed those photos.

## 3. Ozone therapy removed

| Where | What |
|---|---|
| Holistic Dentistry page | "Ozone Therapy — a natural antibacterial treatment…" item removed from the Benefits & care list |
| Holistic Dentistry meta description | "…mercury-free fillings, SMART amalgam removal, fluoride-free cleanings and ozone therapy…" → "…mercury-free fillings, SMART amalgam removal and fluoride-free cleanings…" |
| Holistic Dentistry content note + docs/content-flags.md | internal note about ozone removed |

There was no ozone service page, nav or footer link, card, homepage mention, FAQ, blog post, schema item or sitemap entry. No replacement service was added.

## 4. Redirects added (301 → /services/)

`/ozone-therapy/`, `/ozone-dental-therapy/`, `/services/ozone-therapy/`, `/services/holistic-dentistry/ozone-therapy/`.
Tested: each returns 301 to /services/. (Without the trailing slash, the site first adds the slash, as for every URL.)

## 5. Checks

- Build passes; typecheck and lint clean.
- Desktop (1440) and mobile (390) screenshots of the changed pages: no broken images, no horizontal overflow, 06 and 08 never on the same page. Layout matches the live site.
- Search for "ozone" in source and in the built HTML: nothing, apart from the four redirect lines above.
- Search for the replaced filenames (images/real, images/team, dr-lavi*.jpg, meet-dr-lavi.jpg) in source and built output: nothing, apart from `docs/image-audit.md`, which lists them by design.

## 6. Not done / needs a decision

- **Sanity**: not connected (project ID still pending), so there was nothing to update there.
- **Older before/after cases** (`cases/case-1…6`, `implant`): close-ups of teeth only, kept. They came from the previous website; please confirm they are Dr. Lavi's own patients.
- **Client before/after photos on Home and Testimonials**: not added, because the brief limits them to cosmetic, veneer and gallery pages. Those sliders still show the older cases.
- **Repeated photos**: with six photos, some repeat on a page. More office/team photos from the client would remove the repeats.
- **Brand name**: the site already says "Valencia Dentistry", matching the logo in photo 01. Nothing renamed.
- **Next.js security advisory**: the build printed a notice that Next.js 16.4.3 has a known vulnerability (16.4.6 is out). Not upgraded, as it is outside this brief.
