import type { IntroSplitSection } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { FloatingBadge, PhotoFrame } from "@/components/rich/PhotoFrame";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import manifest from "@/lib/generated/images.json";

export function IntroSplit({ s }: { s: IntroSplitSection }) {
  const left = s.imageSide !== "right";
  // Portrait photos get a portrait frame, anchored to the top so faces are never cropped.
  const meta = (manifest as Record<string, { width: number; height: number }>)[s.image.src];
  const portrait = (s.image.height ?? meta?.height ?? 0) > (s.image.width ?? meta?.width ?? 1);
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className={cn("lg:col-span-6", left ? "lg:order-1" : "lg:order-2")}>
            <PhotoFrame image={s.image} sizes="(min-width: 1024px) 560px, 100vw" arch={portrait} accent={left ? "olive" : "sand"} accentSide={left ? "left" : "right"} className={cn("mx-auto", portrait ? "max-w-[420px]" : "max-w-[560px]")}>
              <FloatingBadge className={cn("bottom-8", left ? "-right-3 sm:-right-8" : "-left-3 sm:-left-8")} icon={<Icon.pin className="h-5 w-5" />} title="Tourney Road, Valencia" text="Suite 240 · free parking" />
            </PhotoFrame>
          </Reveal>
          <Reveal className={cn("lg:col-span-6", left ? "lg:order-2" : "lg:order-1")} delay={80}>
            <SectionHeading eyebrow={s.eyebrow} heading={s.heading} />
            <div className="prose-measure mt-6 space-y-4 text-lg text-grey-700">
              {s.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {s.cta && <Button href={s.cta.href} variant="outline" className="mt-8" arrow>{s.cta.label}</Button>}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
