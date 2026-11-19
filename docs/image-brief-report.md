# Image replacement and ozone removal: report

Status: photo replacement and ozone removal are live. The image fixes (section 7) and the relevant-photo pass (section 8) are on staging (preview branch), not yet on production.
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

## 8. Relevant photos everywhere (client feedback, 2026-11-18)

Feedback: the client's own photos were used twice on the home page and were not relevant to sections such as
technology. Stock photos are fine if they are relevant and professional; only the blonde model and the previous
practice's photos were unwanted.

What changed (layout unchanged, photos only):

- Each of the client's photos appears **at most once per page** (checked on all 61 pages, desktop and mobile).
  They stay where they belong: reception, front desk, treatment room, Dr. Lavi.
- **Technology shows the technology**: CBCT machine, intraoral scanner, digital X-rays (home); CBCT, iTero scan,
  PRF centrifuge, implant surgical kit, crown finishing, intraoral camera images, dental laser, calm sedation patient (About).
- **Every treatment page has its own photos**: a hero and a "Benefits & care" photo about that treatment (implant models,
  full-arch bridge, crowns, bridges, fillings, whitening, aligners, shade guides, extraction instruments, X-rays,
  jaw pain and a night guard for TMJ, natural care for holistic). Veneers and Cosmetic Dentistry keep the client's real
  before/after cases. Process steps: Dr. Lavi (consultation), his treatment room (treatment), a smiling patient (result).
- **Blog**: each of the 30 posts has a photo for its topic (implants, All-on-X, bone grafting, extractions, healing foods,
  crowns, bridges, cosmetic, cleanings, first visit); no two neighbouring cards share a photo.
- Other pages: Emergency shows a toothache; Before & After and Testimonials show smiling patients; Appointment's first-visit
  photos follow each step (front desk, reception, X-ray, exam with Dr. Lavi, plan on screen).
- 54 licensed stock photos (Pexels / Unsplash, free for commercial use). No blonde model, no other clinic's branding,
  no stock photo presented as Dr. Lavi, his team or his patients. Full list with sources: `docs/photo-credits.md`.

## 9. Section-by-section audit (2026-11-18)

Every section of 31 pages checked visually at desktop (1,440 px) and mobile (390 px), plus an automated
check of every image on all 61 pages.

| Page / section | Finding | Fix |
|---|---|---|
| Home, Free Invisalign Consultation | Not a new section: the new-patient band since Nov 4, worded from the onboarding form on Nov 9. Live shows Dr. Lavi's small candid photo (02) | Kept, with a clear-aligner photo (client's choice) |
| 16 treatment pages, process steps | The same three photos on every page whatever the step | Each step now matches its subject: Dr. Lavi for consultations, his treatment room for in-office procedures, the scanner for "3D imaging" and "impressions", X-rays for sinus lift, the centrifuge for PRF healing, soft foods for extraction recovery, brushing for aligner care, a smiling patient for results |
| Testimonials hero, Before & After hero | Stock patients next to "real results" could read as the practice's own patients | The practice's own photos (front desk, reception) |
| Veneers hero | Pale shade-sample strip, near empty on mobile | A veneer being placed on a smiling patient |
| Wisdom teeth, Benefits & care | Back of a head at a monitor | Patient in a panoramic X-ray scanner |
| Bone grafting steps | Two near-identical implant model shots on one page | Transparent full-arch model for "Ridge augmentation" |
| Services page cards | Looked blank in automated captures | Not a fault: they load as a visitor scrolls (verified by scrolling the page) |

Checked and correct: every hero, technology card, before/after case, blog card and article header, About, Appointment,
Contact, Emergency, Special Offer, Thank-you; mobile layouts of the same pages. Result: no broken image, none of the
practice's photos twice on a page, no stock photo twice on a page, no identical photos side by side.

## 10. Client feedback round 2 (2026-11-19, staging)

Only the four requested changes; layout unchanged.

| Request | Done |
|---|---|
| Home hero = 01, logo fully visible | 01 stays as the hero; the logo wall is fully in frame at 390, 768, 1024, 1280, 1440 and 1920 px. On desktop the hero text sits over the left edge of the lettering (text on the left, logo centred in the photo); moving it would need a layout change, so it is left as is. |
| Before/after: teeth only, no faces | The two cases with faces (case-1, the man; case-4, the woman) re-cropped to the mouth, each before/after pair to the same area (540 × 405). All other cases already show only the teeth and lips. Covers the home slider, the "More cases" thumbnails, Testimonials and the Before & After page. Originals stay in `assets/originals/cases/`. |
| Office video → stills | No video exists on the site or in the repository (no `<video>`, .mp4 or .webm), so there was nothing to replace or keep. |
| New office photos 11-14 | Added to `public/images/client/` (2,400 px max, WebP variants built) with the brief's alt text. About hero: 11 (treatment room). Contact hero and Appointment "Before you arrive" photo: 13 (hallway to the front desk). Thank-you hero: 14 (hallway with imaging equipment). 12 (sun flare) is registered as a spare, unused, since 11 fits. |

The door photo (`11-treatment-rooms-doors.jpg`, a different file) stays where it was asked for: home banner, Special Offer, treatment-page closing banners and the shared CTA.
