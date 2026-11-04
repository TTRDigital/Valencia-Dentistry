import Link from "next/link";
import { getServices } from "@/lib/content";
import type { Service, ServiceShowcaseSection } from "@/lib/types";
import { RichHeading } from "@/components/rich/Blocks";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Container, Section } from "@/components/ui/Section";
import { distinctPhotos } from "@/lib/utils";
import { servicePhotos } from "./ServicesHub";

const LABEL: Record<string, string> = { surgical: "Oral surgery", cosmetic: "Cosmetic", restorative: "Restorative", holistic: "Holistic", preventive: "Jaw & comfort" };

/**
 * Treatments gallery. On desktop with motion on, the section pins and the cards slide sideways as
 * you scroll (MotionProvider, [data-hscroll]); on phones, or without motion, it is a swipeable row.
 * Square photo cards (photos anchored near the top, shown no larger than their files) keep it sharp.
 */
export async function ServiceShowcase({ s }: { s: ServiceShowcaseSection }) {
  const all = await getServices();
  const items = s.slugs.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const photos = distinctPhotos(items, servicePhotos);
  return (
    <Section className="overflow-hidden bg-warm" id="services">
      <div data-hscroll className="lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
            <Link href="/services/" className="link-arrow shrink-0">All {all.length} treatments <Icon.arrow className="h-4 w-4" /></Link>
          </div>
        </Container>
        <div className="container-x mt-10 hidden items-center gap-5 lg:flex" aria-hidden="true">
          <span className="font-display text-2xl text-ink-900"><span data-hscroll-count>01</span><span className="text-grey-400"> / {String(items.length).padStart(2, "0")}</span></span>
          <span className="h-px flex-1 bg-ink-900/10"><span data-hscroll-progress className="block h-full origin-left scale-x-0 bg-olive-600" /></span>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-grey-600">Scroll to explore</span>
        </div>
        <div className="container-x mt-8">
          <ul data-hscroll-track className="no-scrollbar -mx-4 flex gap-5 px-4 pb-2 sm:mx-0 sm:px-0">
            {items.map((it, i) => (
              <li key={it.slug} className="w-[min(80vw,420px)] shrink-0 snap-start">
                <Link href={it.path} className="group block no-underline">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-olive-900">
                    <Picture image={photos[i] ?? it.hero.image} fill cropTo={1} sizes="(min-width: 1024px) 420px, 80vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-olive-900/80 via-olive-900/10 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink-900">{LABEL[it.category] ?? "Care"}</span>
                    <span aria-hidden="true" className="absolute right-5 top-5 text-xl font-semibold tabular-nums text-white/80">{String(i + 1).padStart(2, "0")}</span>
                    <div className="absolute inset-x-5 bottom-5 text-white">
                      <h3 className="text-2xl text-white">{it.name}</h3>
                    </div>
                  </div>
                  {it.shortDescription && <p className="mt-4 text-grey-700">{it.shortDescription}</p>}
                  <span className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold text-olive-700">Learn more <Icon.arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
            <li className="w-[min(80vw,420px)] shrink-0 snap-start">
              <Link href="/services/" className="group flex aspect-square flex-col justify-between rounded-lg bg-olive-700 p-8 text-white no-underline">
                <Icon.tooth className="h-10 w-10 text-bronze-300" />
                <span>
                  <span className="block text-3xl font-semibold">See all {all.length} treatments</span>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold">Browse services <Icon.arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
