import type { Feature, FeatureGridSection, ValuesSection } from "@/lib/types";
import { RichHeading } from "@/components/rich/Blocks";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export { FeatureIcon } from "@/components/ui/FeatureIcon";

/**
 * Editorial feature list: heading on the left with the lead beside it, then a numbered grid with no
 * boxes. Each item has a hairline on top whose olive accent grows on hover, a number, a title and a line.
 */
function Points({ items, dark, cols = 3 }: { items: Feature[]; dark?: boolean; cols?: number }) {
  return (
    <ol data-stagger className={cn("mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-16", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {items.map((f, i) => (
        <Reveal as="li" key={f.title} className={cn("group relative border-t pt-6", dark ? "border-white/15" : "border-ink-900/15")}>
          <span aria-hidden="true" className={cn("absolute -top-px left-0 h-0.5 w-10 transition-[width] duration-500 group-hover:w-full", dark ? "bg-bronze-300" : "bg-olive-600")} />
          <span className={cn("text-sm font-semibold tabular-nums", dark ? "text-bronze-300" : "text-olive-600")}>{String(i + 1).padStart(2, "0")}</span>
          <h3 className={cn("mt-3 text-2xl", dark && "text-white")}>{f.title}</h3>
          <p className={cn("mt-3", dark ? "text-white/75" : "text-grey-700")}>{f.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

function Header({ eyebrow, heading, lead, dark }: { eyebrow?: string; heading: string; lead?: string; dark?: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
      <RichHeading eyebrow={eyebrow} heading={heading} dark={dark} className="lg:col-span-7" />
      {lead && <p className={cn("text-lg lg:col-span-5", dark ? "text-white/75" : "text-grey-700")}>{lead}</p>}
    </div>
  );
}

export function FeatureGrid({ s }: { s: FeatureGridSection }) {
  return (
    <Section dark={s.dark} className={s.dark ? undefined : "bg-warm"}>
      <Container>
        <Header eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} dark={s.dark} />
        <Points items={s.items} dark={s.dark} cols={s.columns === 4 ? 4 : 3} />
      </Container>
    </Section>
  );
}

export function Values({ s }: { s: ValuesSection }) {
  return (
    <Section className="bg-warm">
      <Container>
        <Header eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        <Points items={s.items} cols={s.items.length === 4 ? 4 : 3} />
      </Container>
    </Section>
  );
}
