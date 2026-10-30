import Link from "next/link";
import type { BannerSection, CaseCarouselSection, CenteredCtaSection, PhotoCardsSection, StepPanelsSection, TechAccordionSection } from "@/lib/types";
import { getCases } from "@/lib/content";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { CaseCarousel } from "@/components/blocks/CaseCarousel";
import { cn } from "@/lib/utils";

/**
 * Home-page sections that follow the Ideal Dental Solutions layout the client
 * asked for (photo cards, full-width mission banner, technology accordion
 * with a large photo, before/after carousel, centred consultation CTA and
 * three numbered image panels), restyled with the Valencia Dentistry tokens.
 */

/** Three photo cards: image on top, title and text in a tinted box. */
export function PhotoCards({ s }: { s: PhotoCardsSection }) {
  return (
    <Section className="bg-warm">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {s.cards.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 80} className="card card-hover overflow-hidden">
              <div className="relative aspect-[4/3] bg-greige-50">
                <Picture image={c.image} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="text-xl">{c.title}</h3>
                <p className="mt-2 text-[0.95rem] text-grey-600">{c.text}</p>
                {c.link && <Link href={c.link.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-olive-600 hover:underline">{c.link.label} <Icon.arrow className="h-4 w-4" /></Link>}
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Full-width banner with text over a photo (or the dark brand surface when no photo is supplied). */
export function Banner({ s }: { s: BannerSection }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white" aria-labelledby="banner-heading">
      {s.image && (
        <div className="absolute inset-0 -z-10">
          <Picture image={s.image} fill sizes="100vw" className="object-cover" quality={70} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-900/60 to-ink-900/20" aria-hidden="true" />
        </div>
      )}
      {!s.image && <div className="dark-section absolute inset-0 -z-10" aria-hidden="true" />}
      <Container>
        <div className="max-w-xl py-24 lg:py-32">
          {s.eyebrow && <p className="eyebrow mb-4 text-bronze-300">{s.eyebrow}</p>}
          <h2 id="banner-heading" className="text-4xl text-white">{s.heading}</h2>
          <p className="mt-5 text-lg text-white/80">{s.text}</p>
          {s.cta && <Button href={s.cta.href} variant="light" className="mt-8" arrow>{s.cta.label}</Button>}
        </div>
      </Container>
    </section>
  );
}

/** Text + accordion on the left, large photo on the right. */
export function TechAccordion({ s }: { s: TechAccordionSection }) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
            <div className="mt-8 divide-y hairline border-y hairline">
              {s.items.map((it, i) => (
                <details key={it.title} className="group" open={i === 0} name="tech">
                  <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-left text-[0.95rem] font-semibold uppercase tracking-[0.12em] text-ink-900 group-open:text-olive-600 [&::-webkit-details-marker]:hidden">
                    {it.title}
                    <Icon.chevron className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 text-[0.95rem] leading-relaxed text-grey-600">{it.text}</p>
                </details>
              ))}
            </div>
          </div>
          <Reveal className="lg:col-span-7">
            <div className="overflow-hidden rounded-4xl shadow-lift ring-1 ring-ink-900/5">
              <Picture image={s.image} sizes="(min-width: 1024px) 700px, 100vw" className="aspect-[4/3] w-full object-cover object-top" />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/** Before/after carousel: three stacked pairs per view with arrows. */
export async function CaseCarouselSectionView({ s }: { s: CaseCarouselSection }) {
  const cases = await getCases();
  if (!cases.length) return null;
  return (
    <Section className="bg-warm" id="transformations">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        <div className="mt-12"><CaseCarousel cases={cases} /></div>
        {s.note && <p className="mt-6 text-center text-sm text-grey-600">{s.note}</p>}
      </Container>
    </Section>
  );
}

/** Centred heading, text and a single button. */
export function CenteredCta({ s }: { s: CenteredCtaSection }) {
  return (
    <Section className="bg-white" tight>
      <Container>
        <div className="mx-auto max-w-[44rem] text-center">
          {s.eyebrow && <p className="eyebrow mb-4 justify-center">{s.eyebrow}</p>}
          <h2 className="text-4xl">{s.heading}</h2>
          <p className="lead mt-5">{s.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={s.cta?.href ?? site.bookingUrl} size="lg" arrow>{s.cta?.label ?? "Schedule a consultation"}</Button>
            {s.secondary && <Button href={s.secondary.href} variant="outline" size="lg">{s.secondary.label}</Button>}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** Three full-bleed image panels with numbered steps over a dark gradient. */
export function StepPanels({ s }: { s: StepPanelsSection }) {
  return (
    <section aria-label={s.heading ?? "How it works"} className="grid md:grid-cols-3">
      {s.steps.map((st, i) => (
        <div key={st.title} className={cn("relative isolate flex min-h-[360px] items-end overflow-hidden bg-ink-900 text-white md:min-h-[460px]", !st.image && "dark-section")}>
          {st.image && (
            <div className="absolute inset-0 -z-10">
              <Picture image={st.image} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" quality={70} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-900/40 to-ink-900/10" aria-hidden="true" />
            </div>
          )}
          <div className="p-7 sm:p-9">
            <p className="font-display text-3xl text-bronze-300">{i + 1}.</p>
            <h3 className="mt-2 text-2xl text-white">{st.title}</h3>
            <p className="mt-2 max-w-sm text-[0.95rem] text-white/80">{st.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
