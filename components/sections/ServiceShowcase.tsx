import Link from "next/link";
import { getServices } from "@/lib/content";
import type { Service, ServiceShowcaseSection } from "@/lib/types";
import { RichHeading } from "@/components/rich/Blocks";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * Photo-led services overview: one large feature card and four smaller ones in a bento grid.
 * Photos are anchored near the top so faces stay in frame; text sits on a soft gradient.
 */
export async function ServiceShowcase({ s }: { s: ServiceShowcaseSection }) {
  const all = await getServices();
  const items = s.slugs.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x).slice(0, 5);
  return (
    <Section className="bg-white" id="services">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
          <Link href="/services/" className="link-arrow shrink-0">All {all.length} treatments <Icon.arrow className="h-4 w-4" /></Link>
        </div>
        <ul data-stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {items.map((it, i) => (
            <Reveal as="li" key={it.slug} className={cn(i === 0 && "sm:col-span-2 lg:row-span-2")}>
              <Link href={it.path} className={cn("group relative isolate flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-lg bg-ink-900 p-6 text-white no-underline card-hover", i === 0 ? "sm:min-h-[26rem] lg:min-h-[34rem] lg:p-9" : "sm:min-h-80")}>
                <Picture image={it.hero.image} fill sizes={i === 0 ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"} className="-z-10 object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/90 via-ink-900/35 to-transparent" />
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-bronze-300">{it.category === "surgical" ? "Oral surgery" : it.category === "cosmetic" ? "Cosmetic" : it.category === "restorative" ? "Restorative" : "Care"}</p>
                <h3 className={cn("mt-2 text-white", i === 0 ? "text-4xl" : "text-2xl")}>{it.name}</h3>
                {it.shortDescription && <p className={cn("mt-2 text-white/80", i === 0 ? "max-w-md text-lg" : "text-base")}>{it.shortDescription}</p>}
                <span className="mt-4 inline-flex items-center gap-2 font-semibold text-white">Learn more <Icon.arrow className="arrow-nudge h-4 w-4" /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
