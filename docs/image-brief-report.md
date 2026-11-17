# Image replacement and ozone removal: report

Status: **draft, not committed, pushed or deployed.** Everything below is local in the working copy.
Full per-file inventory: `docs/image-audit.md`.

## 1. Images replaced (old → client photo ID)

| Page | Slot | Old file | New |
|---|---|---|---|
| Home | Hero | team/dr-lavi-outdoor.jpg | 01 reception |
| Home | "Exceptional Smiles" trio | real/smile-plan-screen, real/treatment-room-2, real/veneer-smile-2 | 09, 10, 02 |
| Home | "A New Standard in Dentistry" banner | real/scan-hygienist.jpg | 05 |
| Home | Meet Dr. Nuriel Lavi | team/dr-lavi-casual.jpg | 07 |
| About | Hero | real/scan-hygienist.jpg | 01 |
| About | "Santa Clarita's dental home" | real/smile-plan-5.jpg | 05 |
| About | Team card (people.json) | team/dr-lavi-portrait.jpg | 07 |
| About | Closing CTA | real/smile-design.jpg | 09 |
| About | OG image | generated text card | 07 |
| Appointment | Hero | real/treatment-room-2.jpg | 09 |
| Appointment | First-visit photo (5 rotating) | scan-hygienist, cleaning, smile-plan-screen, smile-plan-5, veneer-smile | 10 (one photo) |
| Before & After | Hero | real/veneer-tryin.jpg | 01 |
| Before & After | Gallery | (added) | 03, 04, 06 shown whole, before the existing cases |
| Contact | Hero | real/treatment-room-2.jpg | 10 |
| Emergency dental | Hero | real/treatment-room-2.jpg | 09 |
| Special Offer (new-patient-offer) | Offer photo | real/aligner-patient-2.jpg | 10 |
| Services hub | Hero / CTA | real/smile-plan-screen / real/scan-hygienist | 09 / 10 |
| Testimonials | Hero / CTA | real/veneer-smile-2 / real/scan-hygienist | 01 / 10 |
| Thank you | Hero | real/veneer-smile.jpg | 01 |
| All 16 treatment pages | Hero | various real/* | 09 |
| All 16 treatment pages | Photo beside "Benefits & care" | various real/* | 10; **Veneers: 08**, **Cosmetic Dentistry: 03** (whole image, labelled Before / After) |
| All 16 treatment pages | Closing CTA | real/treatment-room(-2) etc. | 01 |
| Blog posts | Author photo (header / author box) | team/dr-lavi-portrait.jpg | 07 / 02 |
| Shared CTA default | Photo | real/* | 10 |
| JSON-LD | Dentist / Person / Article fallback | team/dr-lavi.jpg | 01 / 07 / 01 |
| OG images | Home, blog index and pages / Services | team/dr-lavi.jpg | 01 / 09 |

## 2. Images removed with no replacement (no client photo fits)

- Home: 3 technology cards (now show icons), the Free Invisalign Consultation photo (now a text panel), 3 "Smile Reimagined" step photos (now olive tiles).
- About: 8 technology cards (now icons).
- Before & After: 3 step photos (now olive tiles).
- Appointment: 4 of the 5 first-visit photos.
- Treatment pages: process step photos, "why choose" card photos, candidate and understanding photos; service cards on the Services hub and category pages are now text cards.
- Blog: all 31 post photos (other office / blonde model). Cards show a neutral olive panel with a tooth icon and the topic; the article header is text only.
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
- Desktop (1440) and mobile (390) screenshots of every changed page: no broken images, no horizontal overflow, no photo used twice on a page, 06 and 08 never on the same page.
- Search for "ozone" in source and in the built HTML: nothing, apart from the four redirect lines above.
- Search for the replaced filenames (images/real, images/team, dr-lavi*.jpg, meet-dr-lavi.jpg) in source and built output: nothing, apart from `docs/image-audit.md`, which lists them by design.

## 6. Not done / needs a decision

- **Sanity**: not connected (project ID still pending), so there was nothing to update there.
- **Older before/after cases** (`cases/case-1…6`, `implant`): close-ups of teeth only, kept. They came from the previous website; please confirm they are Dr. Lavi's own patients.
- **Client before/after photos on Home and Testimonials**: not added, because the brief limits them to cosmetic, veneer and gallery pages. Those sliders still show the older cases.
- **Brand name**: the site already says "Valencia Dentistry", matching the logo in photo 01. Nothing renamed.
- **Next.js security advisory**: the build printed a notice that Next.js 16.4.3 has a known vulnerability (16.4.6 is out). Not upgraded, as it is outside this brief.
