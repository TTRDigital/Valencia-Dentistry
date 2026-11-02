import type { FeatureGridSection, ValuesSection } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function FeatureIcon({ name, dark }: { name?: string; dark?: boolean }) {
  const I = (name && (Icon as Record<string, (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element>)[name]) || Icon.sparkle;
  return (
    <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl", dark ? "bg-white/10 text-bronze-300" : "bg-greige-50 text-olive-600")}>
      <I className="h-6 w-6" />
    </span>
  );
}

export function FeatureGrid({ s }: { s: FeatureGridSection }) {
  const cols = s.columns ?? 3;
  return (
    <Section dark={s.dark}>
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        {/* Three items sit in one row from tablet up; other odd counts let the last card span the row below lg (no orphan). */}
        <ul data-stagger className={cn("mt-12 grid gap-5", s.items.length === 3 && cols === 3 ? "md:grid-cols-3" : "sm:grid-cols-2", s.items.length % 2 === 1 && s.items.length !== 3 && "fill-odd-until-lg", cols === 3 && "lg:grid-cols-3", cols === 4 && "lg:grid-cols-4")}>
          {s.items.map((f) => (
            <Reveal as="li" key={f.title} className={cn("card p-7", s.dark && "bg-white/[0.06] shadow-none ring-white/10")}>
              <FeatureIcon name={f.icon as IconName} dark={s.dark} />
              <h3 className="mt-5 text-xl">{f.title}</h3>
              <p className={cn("mt-2 text-base leading-relaxed sm:text-[0.95rem]", s.dark ? "text-white/70" : "text-grey-600")}>{f.text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function Values({ s }: { s: ValuesSection }) {
  return (
    <Section className="bg-greige-50/60">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((f, i) => (
            <Reveal as="li" key={f.title} delay={(i % 4) * 60} className="border-t-2 border-bronze-300 pt-5">
              <h3 className="text-lg font-semibold font-sans">{f.title}</h3>
              <p className="mt-2 text-base text-grey-600 sm:text-[0.95rem]">{f.text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
