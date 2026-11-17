# Image replacement and ozone removal: report

Status: photo replacement and ozone removal are live. The follow-up image fixes (section 7) are on staging (preview branch) first.
Full per-file inventory: `docs/image-audit.md`.

## 1. Images replaced (old → client photo ID)

Layout and page structure are exactly as on the live site; only the photos changed. Every photo spot still has a photo.
The client supplied six office/doctor photos (01, 02, 05, 07, 09, 10), fewer than the photo spots on most pages, so on
request **some photos repeat on a page** (the brief's no-repeat rule could not be kept without removing photos or changing layouts).

| Page | Slot | New |
|---|---|---|
| Home | Hero | 01 |
| Home | "Exceptional Smiles" trio | 09, 10, 07 |
| Home | "A New Standard in Dentistry" banner | 05 |
| Home | Technology cards | 09, 10, 07 |
| Home | Free Invisalign Consultation | 01 |
| Home | Meet Dr. Nuriel Lavi | 07 |
| Home | "Smile Reimagined" steps | 05, 09, 10 |
| About | Hero / intro / team card / closing CTA | 10 / 05 / 07 / 01 |
| About | 8 technology cards | 09, 07, 10, 05, 01, 09, 07, 10 |
| About | OG image | 07 |
| Appointment | Hero / first-visit photos | 09 / 10, 01, 07, 05, 09 |
| Before & After | Hero / step photos | 09 / 05, 10, 07 |
| Before & After | Gallery (6 cases) | 03, 04, 06 first (shown whole, same card size), then three older cases |
| Contact / Emergency / Thank you | Hero | 10 / 09 / 10 |
| Special Offer | Offer photo | 10 |
| Services hub | Hero / CTA | 09 / 01 |
| Testimonials | Hero / CTA | 10 / 01 |
| Services hub and category pages | Service card photos | 09, 10, 01, 07, 05 in turn, never the same photo twice in a row |
| 16 treatment pages | Hero | 09 and 10 alternating |
| 16 treatment pages | Photo beside "Benefits & care" | 01 (or a photo not yet on the page); **Veneers: 08**, **Cosmetic Dentistry: 03**, whole, on an ivory mat, labelled Before / After |
| 16 treatment pages | Process steps | doctor (07), the other room, doctor with loupes (05) |
| 16 treatment pages | Closing banner | the room that is not the hero |
| Blog (30 posts) | Post photo | 09, 10, 01, 05 in turn, newest first (neighbouring cards always differ) |
| Blog | Author photo (header / author box) | 07 / 02 |
| Shared CTA default | Photo | 10 |
| JSON-LD | Dentist / Person / Article fallback | 01 / 07 / 01 |
| OG images | Home, blog / Services / treatment pages | 01 / 09 / their hero |

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
- **Repeated photos**: with six photos, some repeat on a page (never side by side). More office/team photos from the client would remove the repeats.
- **Brand name**: the site already says "Valencia Dentistry", matching the logo in photo 01. Nothing renamed.
- **Next.js security advisory**: the build printed a notice that Next.js 16.4.3 has a known vulnerability (16.4.6 is out). Not upgraded, as it is outside this brief.

## 7. Image fixes after the in-depth audit (staging)

Layouts unchanged; only photo assignments, crop focus and before/after labels.

| Fault found | Fix |
|---|---|
| Same photo side by side (30 places: Services groups, blog grid, category cards) | Pickers never repeat the previous card's photo; blog photos cycle in listing order. Now 0. |
| Photo vs topic (headshots on X-ray / PRF / sedation cards, process steps) | Rooms for equipment topics, the doctor for consultation steps; still limited by having no clinical photos. |
| Blog cards and Services strips cropped to ceiling or cut faces | Every client photo has its own focus point (lib/clientPhotos.ts), applied wherever it appears. |
| Headings over the lit logo (About, Before & After, Testimonials, Thank you heroes; treatment-page closing banners; home step 1) | Those spots use the rooms or the doctor; 01 stays where no text sits on it (home hero, cards, About and Testimonials CTA). |
| 02 (667px) blurry in large frames | 02 only in the blog author box (96px). |
| Before/after on Veneers and Cosmetic Dentistry: no labels, olive bars | Ivory mat, Before / After labels, image whole. |
| 04 labelled twice in the gallery; 06 lost in white canvas | No overlay on 04 (it has its own marks); plain white border trimmed from 06 (photos untouched). |
| Client photo list kept in four places | One list: lib/clientPhotos.ts. The service generator uses it too. |

Still soft on sharp (2x) screens, because of the source files: 01 (1,448px) in the home hero, 08 (646px) on the Veneers page,
and 09/10 in full-width heroes (1,800px, the brief's 2,400px cap, under an olive overlay). Higher-resolution originals of 01 and 08 would fix the first two.
