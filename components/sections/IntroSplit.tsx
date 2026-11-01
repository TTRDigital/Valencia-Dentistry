import type { IntroSplitSection } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
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
    <Section>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className={cn("lg:col-span-6", left ? "lg:order-1" : "lg:order-2")}>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-4xl bg-sand-100" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-4xl shadow-lift">
                <Picture image={s.image} sizes="(min-width: 1024px) 560px, 100vw" className={cn("w-full object-cover object-top", portrait ? "aspect-[4/5]" : "aspect-[5/4]")} />
              </div>
            </div>
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
