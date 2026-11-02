import type { FeatureGridSection, ValuesSection } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { IconCard } from "@/components/rich/Blocks";

const VALUE_ICONS: IconName[] = ["user", "leaf", "shield", "heart", "sparkle", "smile", "pin", "calendar"];

export { FeatureIcon } from "@/components/ui/FeatureIcon";

export function FeatureGrid({ s }: { s: FeatureGridSection }) {
  const cols = s.columns ?? 3;
  return (
    <Section dark={s.dark}>
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        {/* Three items sit in one row from tablet up; other odd counts let the last card span the row below lg (no orphan). */}
        <ul data-stagger className={cn("mt-12 grid gap-5", s.items.length === 3 && cols === 3 ? "md:grid-cols-3" : "sm:grid-cols-2", s.items.length % 2 === 1 && s.items.length !== 3 && "fill-odd-until-lg", cols === 3 && "lg:grid-cols-3", cols === 4 && "lg:grid-cols-4")}>
          {s.items.map((f) => (
            <Reveal as="li" key={f.title}>
              <IconCard icon={(f.icon as IconName) in Icon ? (f.icon as IconName) : "sparkle"} title={f.title} text={f.text} dark={s.dark} />
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
        <ul data-stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((f, i) => (
            <Reveal as="li" key={f.title}><IconCard icon={VALUE_ICONS[i % VALUE_ICONS.length]} number={i + 1} title={f.title} text={f.text} /></Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
