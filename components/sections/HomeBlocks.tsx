import Link from "next/link";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";
import type { FeaturedServicesSection, NewPatientSection, Service, WhyChooseSection } from "@/lib/types";
import { RichHeading } from "@/components/rich/Blocks";
import { PhotoFrame } from "@/components/rich/PhotoFrame";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

/**
 * Services as a clean numbered grid: the first treatment is a large dark "Featured" card, the rest are
 * light text cards (number, name, one line, Explore). A "Not sure where to start?" strip follows.
 */
export async function FeaturedServices({ s }: { s: FeaturedServicesSection }) {
  const all = await getServices();
  const items = s.slugs.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const [first, ...rest] = items;
  const num = (i: number) => String(i + 1).padStart(2, "0");
  return (
    <Section className="bg-warm" id="services">
      <Container>
        <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        <ul data-stagger className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {first && (
            <Reveal as="li" className="sm:col-span-2">
              <Link href={first.path} className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-olive-900 p-6 text-white sm:min-h-64 sm:p-8">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Featured · {num(0)}</span>
                <span className="mt-2 text-2xl font-semibold text-white sm:mt-3 sm:text-3xl">{first.name}</span>
                <span className="mt-3 max-w-md text-white/75">{first.shortDescription}</span>
                <span className="mt-auto pt-5 sm:pt-6">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-white">Explore {first.name.toLowerCase()} <Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  {s.featuredTags && <span className="mt-4 hidden flex-wrap gap-2 sm:flex">{s.featuredTags.map((t) => <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/15">{t}</span>)}</span>}
                </span>
              </Link>
            </Reveal>
          )}
          {rest.map((it, i) => (
            <Reveal as="li" key={it.slug}>
              <Link href={it.path} className="group flex h-full items-center gap-4 rounded-xl bg-white px-5 py-4 ring-1 ring-ink-900/10 transition-shadow hover:shadow-lift sm:min-h-56 sm:flex-col sm:items-stretch sm:gap-0 sm:p-6">
                <span className="text-xs font-semibold tabular-nums text-grey-400">{num(i + 1)}</span>
                <span className="flex-1 text-lg font-semibold text-ink-900 sm:mt-3 sm:flex-none sm:text-xl">{it.name}</span>
                <span className="mt-2 hidden text-[0.9375rem] text-grey-700 sm:block">{it.shortDescription}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-ink-900 group-hover:text-olive-700 sm:mt-auto sm:pt-5"><span className="sr-only sm:not-sr-only">Explore</span> <Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
        {s.consult && (
          <div className="mt-6 flex flex-col gap-4 rounded-xl bg-white p-6 ring-1 ring-ink-900/10 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-grey-600">Not sure where to start?</p>
              <p className="mt-1 text-xl font-semibold text-ink-900">{s.consult.heading}</p>
              <p className="mt-1 hidden text-grey-700 sm:block">{s.consult.text}</p>
            </div>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary shrink-0">{s.consult.buttonLabel} <Icon.arrow className="h-4 w-4" /></a>
          </div>
        )}
        <p className="mt-8 text-center"><Link href="/services/" className="link-arrow">View all services <Icon.arrow className="h-4 w-4" /></Link></p>
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
            <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-y-3">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-ink-900"><span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive-600 text-white"><Icon.check className="h-3.5 w-3.5" /></span>{b}</li>
              ))}
            </ul>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:items-center">
              <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg px-4">{s.buttonLabel ?? "Book your first visit"} <Icon.arrow className="h-4 w-4" /></a>
              <Link href="/new-patient-offer/" className="btn btn-lg border border-ink-900/20 px-4 text-ink-900">What to expect</Link>
            </div>
            {s.fine && <p className="mt-5 text-sm text-grey-600">{s.fine}</p>}
          </div>
          {s.image && <div className="hidden lg:col-span-6 lg:block"><PhotoFrame image={s.image} sizes="(min-width: 1024px) 560px, 100vw" frameClassName="rounded-2xl" className="mx-auto max-w-[600px]" /></div>}
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
