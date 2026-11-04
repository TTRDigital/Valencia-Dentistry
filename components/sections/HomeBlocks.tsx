import Link from "next/link";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";
import type { FeaturedServicesSection, NewPatientSection, Service, WhyChooseSection } from "@/lib/types";
import { RichHeading } from "@/components/rich/Blocks";
import { PhotoFrame } from "@/components/rich/PhotoFrame";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { distinctPhotos } from "@/lib/utils";
import { servicePhotos } from "./ServicesHub";

const LABEL: Record<string, string> = { surgical: "Oral surgery", cosmetic: "Cosmetic", restorative: "Restorative", holistic: "Holistic", preventive: "Preventive" };

/** The treatments the practice leads with: photo cards with a small category label, a title and one line. */
export async function FeaturedServices({ s }: { s: FeaturedServicesSection }) {
  const all = await getServices();
  const items = s.slugs.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const fixed = Object.values(s.images ?? {}).map((im) => im.src);
  const auto = distinctPhotos(items, servicePhotos, fixed);
  const photos = items.map((it, i) => s.images?.[it.slug] ?? auto[i]);
  return (
    <Section className="bg-white" id="treatments">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
          <Link href="/services/" className="link-arrow shrink-0">View all services <Icon.arrow className="h-4 w-4" /></Link>
        </div>
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-5" data-stagger>
          {items.map((it, i) => (
            <Reveal as="li" key={it.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <Link href={it.path} className="group flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-ink-900/10 transition-shadow hover:shadow-lift">
                <span className="relative block aspect-[4/3] overflow-hidden bg-greige-50">
                  <Picture image={photos[i] ?? it.hero.image} fill cropTo={4 / 3} sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 78vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-bronze-600">{LABEL[it.category] ?? "Treatment"}</span>
                  <span className="mt-1.5 text-xl font-semibold text-ink-900">{it.name}</span>
                  <span className="mt-2 text-[0.9375rem] text-grey-700">{it.shortDescription}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-olive-700">Learn more <Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** New patient visit: a calm sage band with what the first visit includes and one clear button. No price. */
export function NewPatient({ s }: { s: NewPatientSection }) {
  return (
    <Section className="bg-[#eef1ea]" id="new-patients">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.text} />
            <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-ink-900"><span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive-600 text-white"><Icon.check className="h-3.5 w-3.5" /></span>{b}</li>
              ))}
            </ul>
            <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">{s.buttonLabel ?? "Book your first visit"} <Icon.arrow className="h-4 w-4" /></a>
              <Link href="/new-patient-offer/" className="btn btn-lg border border-ink-900/20 text-ink-900">What to expect</Link>
            </div>
            {s.fine && <p className="mt-5 text-sm text-grey-600">{s.fine}</p>}
          </div>
          {s.image && <div className="lg:col-span-6"><PhotoFrame image={s.image} sizes="(min-width: 1024px) 560px, 100vw" frameClassName="rounded-2xl" className="mx-auto max-w-[600px]" /></div>}
        </div>
      </Container>
    </Section>
  );
}

/** Why choose the practice: one photo beside a clean numbered list (no boxes, no icons). */
export function WhyChoose({ s }: { s: WhyChooseSection }) {
  return (
    <Section className="bg-white" id="why-us">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
              <PhotoFrame image={s.image} sizes="(min-width: 1024px) 460px, 100vw" frameClassName="rounded-2xl" className="mt-8 hidden lg:block" />
            </div>
          </div>
          <ol className="lg:col-span-7">
            {s.items.map((it, i) => (
              <Reveal as="li" key={it.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink-900/10 py-6 first:border-t-0 first:pt-0 sm:grid-cols-[4rem_1fr] lg:py-7 lg:first:pt-2">
                <span className="text-sm font-semibold tabular-nums text-olive-600">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-xl font-semibold text-ink-900 sm:text-2xl">{it.title}</span>
                  <span className="mt-2 block text-grey-700">{it.text}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
