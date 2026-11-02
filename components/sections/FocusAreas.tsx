import Link from "next/link";
import type { FocusAreasSection } from "@/lib/types";
import { PhotoFrame } from "@/components/rich/PhotoFrame";
import { RichHeading } from "@/components/rich/Blocks";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * Two things the practice is known for, as alternating feature rows: the photo whole in its own
 * proportions with an offset colour block, beside the text, a checklist and a link.
 */
export function FocusAreas({ s }: { s: FocusAreasSection }) {
  return (
    <Section className="bg-warm" id="holistic-tmj">
      <Container>
        <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        <div className="mt-16 space-y-20 lg:space-y-28">
          {s.areas.map((a, i) => (
            <article key={a.title} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal className={cn("lg:col-span-6", i % 2 === 1 && "lg:order-2")}>
                <PhotoFrame image={a.image} sizes="(min-width: 1024px) 560px, 100vw" arch accent={i % 2 ? "sand" : "olive"} accentSide={i % 2 ? "left" : "right"} className="mx-auto max-w-[520px]" />
              </Reveal>
              <div className={cn("lg:col-span-6", i % 2 === 1 && "lg:order-1")}>
                <p className="eyebrow mb-4">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-4xl">{a.title}</h3>
                <p className="mt-4 text-lg text-grey-700">{a.text}</p>
                {a.points && (
                  <ul data-stagger className="mt-6 grid gap-3">
                    {a.points.map((p) => (
                      <Reveal as="li" key={p} className="flex items-center gap-3 rounded-lg bg-white p-4 text-grey-900 ring-1 ring-ink-900/[0.07]">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-olive-100 text-olive-700"><Icon.check className="h-4 w-4" /></span>{p}
                      </Reveal>
                    ))}
                  </ul>
                )}
                <Link href={a.link.href} className="btn btn-primary mt-8">{a.link.label} <Icon.arrow className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
