import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { FaqList } from "@/components/sections/Faq";
import { DisplayToggle } from "./DisplayToggle";

export const metadata: Metadata = { title: "Style guide", robots: { index: false, follow: false } };

const colors = [
  ["Navy 900", "#112740", "Primary dark surfaces, headings", "bg-navy-900 text-white"],
  ["Steel 600", "#366797", "Accents, links, buttons", "bg-steel-600 text-white"],
  ["Off-white", "#FAFAFA", "Light surfaces", "bg-offwhite text-navy-900"],
  ["Warm white", "#FDFBF7", "Page background", "bg-warm text-navy-900"],
  ["Grey 600", "#5A6675", "Secondary text (brand #667280, darkened for AA on tints)", "bg-grey-600 text-white"],
  ["Champagne 300", "#DCC8A4", "Accent lines, eyebrows on dark", "bg-champagne-300 text-navy-900"],
  ["Pale sky 50", "#EEF5FB", "Highlight tints", "bg-sky-50 text-navy-900"],
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
  ["Grey 600 on warm white", "#5A6675", "#FDFBF7"],
  ["Grey 600 on white", "#5A6675", "#FFFFFF"],
  ["Grey 600 on champagne 50", "#5A6675", "#FAF6EF"],
  ["Champagne 500 text on champagne 50", "#876A3A", "#FAF6EF"],
  ["Steel 600 on white", "#366797", "#FFFFFF"],
  ["White on steel 600", "#FFFFFF", "#366797"],
  ["Navy 900 on warm white", "#112740", "#FDFBF7"],
  ["White on navy 900", "#FFFFFF", "#112740"],
  ["Champagne 300 on navy 900", "#DCC8A4", "#112740"],
  ["White 75% on navy (lead text)", "#C4CAD1", "#112740"],
  ["Navy 900 on pale sky", "#112740", "#EEF5FB"],
];

export default function StyleGuide() {
  return (
    <>
      <Section className="border-b hairline bg-warm" tight>
        <Container>
          <SectionHeading as="h1" eyebrow="Style guide · not indexed" heading="Valencia Smile Expert design system" lead="Quiet-luxury dental: the refined brand palette, a two-option type pairing, an 8px spacing system, large rounded cards and tasteful motion. Use the toggle to compare the display faces." />
          <DisplayToggle />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="01" heading="Color" lead="Deep navy and steel blue from the current brand, warmed by champagne and lifted by pale sky. Every text/background pair below meets WCAG AA (4.5:1 for body text, 3:1 for large text)." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map(([name, hex, use, cls]) => (
              <li key={hex} className={`rounded-3xl p-6 ring-1 ring-navy-900/10 ${cls}`}>
                <p className="font-semibold">{name}</p>
                <p className="font-mono text-sm opacity-80">{hex}</p>
                <p className="mt-3 text-sm opacity-80">{use}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-navy-900/10">
            <table className="w-full text-sm">
              <thead className="bg-sky-50 text-left"><tr><th className="px-4 py-3">Pair</th><th className="px-4 py-3">Ratio</th><th className="px-4 py-3">AA</th></tr></thead>
              <tbody>
                {pairs.map(([n, a, b]) => { const r = Number(contrast(a, b)); return (
                  <tr key={n} className="border-t hairline"><td className="px-4 py-2.5"><span className="mr-3 inline-block h-5 w-10 rounded align-middle ring-1 ring-navy-900/10" style={{ background: b, color: a }} aria-hidden="true"><span className="block text-center text-[11px] font-bold leading-5">Aa</span></span>{n}</td><td className="px-4 py-2.5 font-mono">{r}:1</td><td className="px-4 py-2.5">{r >= 4.5 ? "Pass" : r >= 3 ? "Large text only" : "Fail"}</td></tr>
                ); })}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="02" heading="Typography" lead="Option A (recommended): Fraunces, an editorial serif with optical sizing, for headings. Option B: Cal Sans, the geometric sans the current site uses. Both pair with Inter for body text. Fluid sizes use clamp() between 390px and 1440px; body line-height 1.65; measure capped at 70ch." />
          <div className="mt-10 space-y-8">
            <div><p className="text-sm text-grey-600">Display 6xl · hero</p><p className="font-display text-6xl text-navy-900">Dentistry that feels calm.</p></div>
            <div><p className="text-sm text-grey-600">H1 · 5xl</p><p className="font-display text-5xl">Dental Implants in Santa Clarita</p></div>
            <div><p className="text-sm text-grey-600">H2 · 4xl</p><h2>Why patients choose us</h2></div>
            <div><p className="text-sm text-grey-600">H3 · 2xl</p><h3>Personalized attention</h3></div>
            <div><p className="text-sm text-grey-600">Lead · xl</p><p className="lead text-xl prose-measure">Dr. Neda Moezzi sees every patient herself, at every visit. Holistic, integrative care with modern technology.</p></div>
            <div><p className="text-sm text-grey-600">Body · base / Inter</p><p className="prose-measure text-grey-700">From holistic preventive care and long-term treatment plans to advanced cosmetic and surgical solutions, our Santa Clarita office offers everything you need in one trusted location.</p></div>
            <div><p className="text-sm text-grey-600">Eyebrow</p><p className="eyebrow">Our services</p></div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="03" heading="Components" lead="Pill buttons with 44px minimum height, 24px-radius cards with hairline rings and layered shadows, accordion, trust row, and the dark section treatment with a subtle grain." />
          <div className="mt-10 flex flex-wrap gap-3">
            <Button arrow>Primary</Button><Button variant="dark">Dark</Button><Button variant="outline">Outline</Button><Button variant="light">Light</Button><Button size="lg" arrow>Large</Button><Button size="sm">Small</Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["Same-day care", "Personalized attention", "Modern technology"].map((t, i) => (
              <div key={t} className="card card-hover p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-steel-600">{i === 0 ? <Icon.bolt className="h-6 w-6" /> : i === 1 ? <Icon.user className="h-6 w-6" /> : <Icon.tech className="h-6 w-6" />}</span>
                <h3 className="mt-5 text-xl">{t}</h3>
                <p className="mt-2 text-[0.95rem] text-grey-600">Cards lift 4px on hover with a deeper shadow; disabled under reduced motion.</p>
              </div>
            ))}
          </div>
          <div className="mt-10"><FaqList items={[{ q: "Accordion item (native details/summary)", a: "Smooth rotate on the icon, keyboard accessible, one open at a time via the name attribute." }, { q: "Second question", a: "Answer text." }]} /></div>
          <div className="dark-section mt-10 rounded-4xl p-10">
            <p className="eyebrow mb-4">Dark section</p>
            <h2 className="text-4xl">Navy surface with gradient and grain</h2>
            <p className="lead mt-4 max-w-[36rem]">Champagne eyebrows, 75% white lead text, light and outline buttons.</p>
            <div className="mt-6 flex gap-3"><Button variant="light" arrow>Book online</Button><Button variant="outline">Call</Button></div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="04" heading="Spacing, grid and motion" lead="12-column grid at 1280px max width with 16/24/32px gutters; an 8px spacing scale; section padding 64/80/112px. Motion: fade-up on scroll (IntersectionObserver), hover lift on cards, smooth accordion and native scroll-snap carousels. Everything is disabled under prefers-reduced-motion and works without JavaScript." />
          <div className="mt-10 grid grid-cols-12 gap-4">{Array.from({ length: 12 }, (_, i) => <div key={i} className="h-16 rounded-xl bg-sky-100 text-center text-xs leading-[4rem] text-steel-700">{i + 1}</div>)}</div>
        </Container>
      </Section>
    </>
  );
}
