import Link from "next/link";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";
import type { FeaturedServicesSection, NewPatientSection, Service, WhyChooseSection } from "@/lib/types";
import { RichHeading } from "@/components/rich/Blocks";
import { PhotoFrame } from "@/components/rich/PhotoFrame";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { distinctPhotos } from "@/lib/utils";
import { servicePhotos } from "./ServicesHub";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

/**
 * Services as a photo bento: the first treatment is a large photo card (olive fade, name, line, tags),
 * the next four are photo cards around it. Phones: the big card, then a two-column grid of compact
 * photo cards (photo + name). A "Not sure where to start?" strip follows.
 */
export async function FeaturedServices({ s }: { s: FeaturedServicesSection }) {
  const all = await getServices();
  const items = s.slugs.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const fixed = Object.values(s.images ?? {}).map((im) => im.src);
  const auto = distinctPhotos(items, servicePhotos, fixed);
  const photo = (i: number) => s.images?.[items[i].slug] ?? auto[i] ?? items[i].hero.image;
  const [first, ...rest] = items;
  return (
    <Section className="bg-warm" id="services">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
          <Link href="/services/" className="link-arrow hidden shrink-0 sm:inline-flex">View all services <Icon.arrow className="h-4 w-4" /></Link>
        </div>
        <ul data-stagger className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4 lg:grid-rows-2">
          {first && (
            <Reveal as="li" className="col-span-2 lg:row-span-2">
              <Link href={first.path} className="group relative flex aspect-[4/3] h-full flex-col justify-end overflow-hidden rounded-2xl text-white sm:aspect-[16/10] lg:aspect-auto lg:min-h-[560px]">
                <Picture image={photo(0)} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-olive-900 via-olive-900/55 to-transparent" />
                <span className="relative p-6 sm:p-9">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze-300">Featured treatment</span>
                  <span className="mt-2 block text-3xl font-semibold text-white sm:text-4xl">{first.name}</span>
                  <span className="mt-2 block max-w-md text-white/85 sm:text-lg">{first.shortDescription}</span>
                  {s.featuredTags && <span className="mt-5 hidden flex-wrap gap-2 sm:flex">{s.featuredTags.map((t) => <span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-sm">{t}</span>)}</span>}
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-olive-900">Explore {first.name.toLowerCase()} <Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </span>
              </Link>
            </Reveal>
          )}
          {rest.map((it, i) => (
            <Reveal as="li" key={it.slug}>
              <Link href={it.path} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-offwhite ring-1 ring-ink-900/5 transition-shadow hover:shadow-lift">
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Picture image={photo(i + 1)} fill cropTo={4 / 3} sizes="(min-width: 1024px) 300px, 50vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]" />
                </span>
                <span className="flex flex-1 items-start justify-between gap-2 p-4 sm:p-5">
                  <span>
                    <span className="block font-semibold text-ink-900 sm:text-lg">{it.name}</span>
                    <span className="mt-1 hidden text-sm text-grey-700 sm:block">{it.shortDescription}</span>
                  </span>
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive-900 text-white transition-transform group-hover:translate-x-0.5"><Icon.arrow className="h-4 w-4" /></span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        {s.consult && (
          <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-olive-900 p-6 text-white sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze-300">Not sure where to start?</p>
              <p className="mt-1 text-xl font-semibold text-white">{s.consult.heading}</p>
              <p className="mt-1 hidden text-white/80 sm:block">{s.consult.text}</p>
            </div>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light shrink-0">{s.consult.buttonLabel} <Icon.arrow className="h-4 w-4" /></a>
          </div>
        )}
        <p className="mt-6 text-center sm:hidden"><Link href="/services/" className="link-arrow">View all services <Icon.arrow className="h-4 w-4" /></Link></p>
      </Container>
    </Section>
  );
}

/** New patient visit: a calm sage band with what the first visit includes and one clear button. No price. */
export function NewPatient({ s }: { s: NewPatientSection }) {
  return (
    <Section className="bg-warm" id="new-patients">
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
    <Section className="bg-warm" id="why-us">
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
