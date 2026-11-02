### What changed at the system level

- **Container:** every section already used the shared `Container` (1280px max, 16/24/32px side padding). The audit found no section off the page edge before or after.
- **Section spacing:** one scale, `--section-y` 64 / 96 / 128px (mobile / tablet / desktop) and `--section-y-tight` 48 / 64 / 80px. The form section and post layouts no longer use their own padding.
- **Grids:** card sets use CSS grid with gap and a no-orphan plan:
  - An odd count gets a featured first card, or a column count that divides the set.
  - Technology cards share rows through subgrid.
  - Actions are pinned to the card bottom.
- **Type:** one fluid scale, with headings balanced (`text-wrap: balance`) and no outer margins. Body copy is 16px on phones.
- **Buttons:** one system: primary, secondary (outline), light, dark, and `.link-arrow` for text links. Heights are 44 / 48 / 52px, with one 6px radius and labels on one line.
- **Radii:** 4px for badges, 6px for buttons and fields, 10px for cards, panels and images, plus one arch shape for portraits.
- **Images:**
  - Fixed aspect ratios per set, with `object-fit: cover`.
  - Crop-aware `sizes`, so cropped portraits request a big enough file.
  - Focal points where faces were cut.
  - On phones, the page-hero photo sits in a 4:3 band above the text.
- **Mobile:**
  - No horizontal scroll, including blog posts with tables, which used to be cut off.
  - The action bar never covers the footer.
  - Tap targets are 44px.

### Animations added (all transform/opacity, tokens 150 / 300 / 600ms, off with reduced motion)

| Where | What it does | Why |
|---|---|---|
| Every page | Headings, text and cards fade and rise 16px as they enter, once only, cascading 70ms within a group. Visible without JavaScript and never stuck hidden. | Guides the eye down the page |
| Route changes | Content fades in over 300ms; the first load is never animated. | Softens page changes without delaying the LCP |
| Header | Transparent over the hero; after scrolling it turns solid with a shadow and 64px tall. The current section's underline draws in. Book Now always visible. | Keeps the next step and your location obvious |
| Mega menu | Panel drops in and the columns follow 40ms apart; closing is quicker. Keyboard: Enter/Space, Down Arrow into the panel, Escape returns focus. | Feedback that the menu responds |
| Buttons and cards | Lift 1–3px with a shadow fade; arrows nudge 3–4px; press settles. Same everywhere. | Consistent feedback on what is clickable |
| Mobile action bar | Slides up once the hero is out of view. | Call / Book / Directions appear when the hero's buttons are gone |
| Home and page heroes | Staged entrance: eyebrow, headline words, lead, buttons, trust points, all done by about 650ms. The portrait is uncovered by a soft curtain while settling from 104%. Gentle desktop-only parallax. | Directs attention to the headline, then the call to action |
| Trust band | 4.9, 180 and $59 count up the first time they scroll into view. | Draws the eye to the proof points |
| Before/after | Drag-to-compare per case (mouse, touch, arrow keys, `role="slider"`). The first time it appears, the handle sweeps once with a pulsing ring. | Shows it can be dragged |
| Technology | Items reveal one by one; hover, focus or tap shows "What this means for you". | Explains each piece of equipment |
| First-visit timeline | The line draws as you scroll and each step highlights in turn. | Explains the visit in order |
| Treatment picker | The answer panel fades and rises when an option is picked. | Feedback for the choice |
| Service pages | Reading-progress line at the top; the "On this page" list highlights the section being read. FAQ answers open with a smooth height and fade. | Orientation on long pages |
| Map | The static map shows at once; the pin drops and the directions card rises as it scrolls in. The live Google map loads only on request. | Replaces "Map loading…" |
| Reviews | Auto-advance every 6s with a progress line; pause on hover, focus, off-screen or the Pause button. | Built, but there are only 2 reviews in the content, so it shows them as a still grid until there are 4 or more |

### Keyboard and reduced-motion checks (Playwright, after the changes)

- **Header:**
  - Tab order runs skip link, logo, Services, Our Practice, New Patients and so on.
  - The skip link moves focus to `#main`.
  - Focus rings are 3px solid.
- **Mega menu:**
  - Down Arrow on Services opens the panel and focuses "Cosmetic Dentistry".
  - Escape closes it and returns focus to Services.
  - Hovering and then clicking leaves it open.
- **Slider:** two Left Arrow presses take it 50 → 46, and End takes it to 100. Dragging to 30% and 80% gives exactly those values.
- **Picker:** Down Arrow selects the next option.
- **FAQ:** Enter opens and closes it.
- **Forms:** an empty submit shows 4 inline errors, and focus moves to the first invalid field (fixed in this round).
- **Reduced motion:**
  - No element is left hidden, and nothing moves.
  - The hero curtain is skipped and the parallax is off.
  - The review autoplay does not start.
- **Navigation:**
  - Going to another page lands at the top (scroll position 0), and so does a reload.
  - Back and forward keep the browser's own scroll position.
  - Highlighting is correct: a service page highlights Services, About highlights Our Practice, and a blog post highlights Blog.

### Not fixed, and why

- **Photos with another dentist's name:** several practice photos show a coat or scrubs embroidered "Dr. Jason Verdi". These are the real photos supplied for the site. The practice needs to confirm who is pictured, or supply replacement photos.
- **Only 2 Google reviews in the content:** no reviews were invented. Adding 4 or more real reviews turns the grid into the auto-advancing carousel automatically.
- **Insurance logo file:** the Blue Cross Blue Shield file is truncated at the source, so it now shows the cross and shield marks only. A complete logo file would fix it.
- **Before/after photos:** the source images are only 345–437px wide. The slider is capped at 440px, and higher-resolution originals would allow a larger, sharper slider.
- **Heading case:** service-page H2s are Valencia's original SEO copy in Title Case. They were kept as instructed ("keep all copy").
- **Blog images:** some neighbouring blog cards share a photo. This is content, and needs more distinct images.
- **FAQ height animation:** it uses `::details-content`. It is smooth in Chrome and Edge; Safari and Firefox open the answer instantly, which is functional.
