import type { TechExplainerSection } from "@/lib/types";
import { PhotoFrame } from "@/components/rich/PhotoFrame";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { TechCards } from "./TechCards";

/** Technology, explained: heading (with a photo when given) above the interactive cards. */
export function TechExplainer({ s }: { s: TechExplainerSection }) {
  return (
    <Section className={s.dark ? "dark-section" : "bg-white"} id="technology">
      <Container>
        {s.image ? (
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} className="lg:col-span-6" />
            <div className="lg:col-span-6"><PhotoFrame image={s.image} sizes="(min-width: 1024px) 560px, 100vw" accent="sand" className="mx-auto max-w-[560px]" /></div>
          </div>
        ) : (
          <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        )}
        <TechCards s={s} />
      </Container>
    </Section>
  );
}
