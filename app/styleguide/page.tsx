import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { FaqList } from "@/components/sections/Faq";

export const metadata: Metadata = { title: "Style guide", robots: { index: false, follow: false } };

const colors = [
  ["Near-black (ink 900)", "#1C1C1C", "Headings, dark sections, primary text", "bg-ink-900 text-white"],
  ["Olive 600", "#5B6B5A", "Accents, links, buttons", "bg-olive-600 text-white"],
  ["Bronze 500", "#9A8B72", "Logo bronze, decorative lines", "bg-bronze-500 text-white"],
  ["Bronze 300", "#C9BA9C", "Eyebrows and lines on dark", "bg-bronze-300 text-ink-900"],
  ["Warm grey 400", "#A7A7A0", "Icons, placeholders (brand warm grey)", "bg-grey-400 text-ink-900"],
  ["Grey 600", "#5E5E57", "Secondary text (warm grey darkened for AA)", "bg-grey-600 text-white"],
  ["Greige 200", "#D6D3CC", "Borders, dividers", "bg-grey-200 text-ink-900"],
  ["Cream", "#FAFAF4", "Page background", "bg-warm text-ink-900"],
];

/** Contrast ratio (WCAG) between two hex colours. */
function lum(hex: string) {
  const c = hex.replace("#", "").match(/.{2}/g)!.map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a: string, b: string) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return ((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
}
const pairs: [string, string, string][] = [
  ["Grey 600 on cream", "#5E5E57", "#FAFAF4"],
  ["Grey 600 on white", "#5E5E57", "#FFFFFF"],
  ["Grey 600 on sand 50", "#5E5E57", "#F1ECE2"],
  ["Olive 600 on cream (links)", "#5B6B5A", "#FAFAF4"],
  ["White on olive 600 (buttons)", "#FFFFFF", "#5B6B5A"],
  ["Near-black on cream", "#1C1C1C", "#FAFAF4"],
  ["White on near-black", "#FFFFFF", "#1C1C1C"],
  ["Bronze 300 on near-black", "#C9BA9C", "#1C1C1C"],
  ["White 75% on near-black (lead text)", "#CBCBCB", "#1C1C1C"],
  ["Bronze 600 text on sand 50", "#6F6049", "#F1ECE2"],
  ["Charcoal on greige 50", "#2E2E2E", "#F0EEE8"],
];

export default function StyleGuide() {
  return (
    <>
      <Section className="border-b hairline bg-warm" tight>
        <Container>
          <SectionHeading as="h1" eyebrow="Style guide · not indexed" heading="Valencia Dentistry design system" lead="The Ideal Dental Solutions design language in the Valencia Dentistry colours: Urbanist type, cream and near-black flat sections, full-bleed photo heroes, square photos and buttons, and the brand charcoal, olive and bronze." />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="01" heading="Color" lead="Charcoal, olive, warm grey, greige and ivory from the brand board, with the logo bronze for highlights. Every text/background pair below meets WCAG AA (4.5:1 for body text, 3:1 for large text)." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map(([name, hex, use, cls]) => (
              <li key={hex} className={`rounded-3xl p-6 ring-1 ring-ink-900/10 ${cls}`}>
                <p className="font-semibold">{name}</p>
                <p className="font-mono text-sm opacity-80">{hex}</p>
                <p className="mt-3 text-sm opacity-80">{use}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-ink-900/10">
            <table className="w-full text-sm">
              <thead className="bg-greige-50 text-left"><tr><th className="px-4 py-3">Pair</th><th className="px-4 py-3">Ratio</th><th className="px-4 py-3">AA</th></tr></thead>
              <tbody>
                {pairs.map(([n, a, b]) => { const r = Number(contrast(a, b)); return (
                  <tr key={n} className="border-t hairline"><td className="px-4 py-2.5"><span className="mr-3 inline-block h-5 w-10 rounded align-middle ring-1 ring-ink-900/10" style={{ background: b, color: a }} aria-hidden="true"><span className="block text-center text-[11px] font-bold leading-5">Aa</span></span>{n}</td><td className="px-4 py-2.5 font-mono">{r}:1</td><td className="px-4 py-2.5">{r >= 4.5 ? "Pass" : r >= 3 ? "Large text only" : "Fail"}</td></tr>
                ); })}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="02" heading="Typography" lead="Urbanist for headings (semibold) and body text, as on the Ideal Dental Solutions site. Fluid sizes use clamp() between 390px and 1440px; body line-height 1.65; measure capped at 70ch." />
          <div className="mt-10 space-y-8">
            <div><p className="text-sm text-grey-600">Display 6xl · hero</p><p className="font-display text-6xl text-ink-900">Dentistry that feels calm.</p></div>
            <div><p className="text-sm text-grey-600">H1 · 5xl</p><p className="font-display text-5xl">Dental Implants in Santa Clarita</p></div>
            <div><p className="text-sm text-grey-600">H2 · 4xl</p><h2>Why patients choose us</h2></div>
            <div><p className="text-sm text-grey-600">H3 · 2xl</p><h3>Personalized attention</h3></div>
            <div><p className="text-sm text-grey-600">Lead · xl</p><p className="lead text-xl prose-measure">Holistic, integrative care with modern technology.</p></div>
            <div><p className="text-sm text-grey-600">Body · base / Urbanist</p><p className="prose-measure text-grey-700">From holistic preventive care and long-term treatment plans to advanced cosmetic and surgical solutions, our Santa Clarita office offers everything you need in one trusted location.</p></div>
            <div><p className="text-sm text-grey-600">Eyebrow</p><p className="eyebrow">Our services</p></div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="03" heading="Components" lead="Square uppercase buttons with a 44px minimum height, flat cream cards with the photo on top, accordions, trust row, and flat near-black sections." />
          <div className="mt-10 flex flex-wrap gap-3">
            <Button arrow>Primary</Button><Button variant="dark">Dark</Button><Button variant="outline">Outline</Button><Button variant="light">Light</Button><Button size="lg" arrow>Large</Button><Button size="sm">Small</Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["Same-day care", "Personalized attention", "Modern technology"].map((t, i) => (
              <div key={t} className="card card-hover p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-greige-50 text-olive-600">{i === 0 ? <Icon.bolt className="h-6 w-6" /> : i === 1 ? <Icon.user className="h-6 w-6" /> : <Icon.tech className="h-6 w-6" />}</span>
                <h3 className="mt-5 text-xl">{t}</h3>
                <p className="mt-2 text-[0.95rem] text-grey-600">Cards lift 4px on hover with a deeper shadow; disabled under reduced motion.</p>
              </div>
            ))}
          </div>
          <div className="mt-10"><FaqList items={[{ q: "Accordion item (native details/summary)", a: "Smooth rotate on the icon, keyboard accessible, one open at a time via the name attribute." }, { q: "Second question", a: "Answer text." }]} /></div>
          <div className="dark-section mt-10 rounded-4xl p-10">
            <p className="eyebrow mb-4">Dark section</p>
            <h2 className="text-4xl">Navy surface with gradient and grain</h2>
            <p className="lead mt-4 max-w-[36rem]">Bronze eyebrows, 75% white lead text, light and outline buttons.</p>
            <div className="mt-6 flex gap-3"><Button variant="light" arrow>Book online</Button><Button variant="outline">Call</Button></div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="04" heading="Spacing, grid and motion" lead="12-column grid at 1280px max width with 16/24/32px gutters; an 8px spacing scale; section padding 64/80/112px. Motion: fade-up on scroll (IntersectionObserver), hover lift on cards, smooth accordion and native scroll-snap carousels. Everything is disabled under prefers-reduced-motion and works without JavaScript." />
          <div className="mt-10 grid grid-cols-12 gap-4">{Array.from({ length: 12 }, (_, i) => <div key={i} className="h-16 rounded-xl bg-greige-100 text-center text-xs leading-[4rem] text-olive-700">{i + 1}</div>)}</div>
        </Container>
      </Section>
    </>
  );
}
