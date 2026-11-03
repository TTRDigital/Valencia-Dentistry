import Link from "next/link";
import type { FocusAreasSection } from "@/lib/types";
import { PhotoFrame } from "@/components/rich/PhotoFrame";
import { RichHeading } from "@/components/rich/Blocks";
import { Icon } from "@/components/ui/Icons";
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
        {/* Stacking cards: each panel sticks a little lower than the last, so they pile up as you scroll */}
        <div className="mt-16 space-y-8">
          {s.areas.map((a, i) => (
            <article key={a.title} className="stack-card" style={{ "--i": i } as React.CSSProperties}>
              <div className={cn("grid items-center gap-10 overflow-hidden rounded-lg p-6 shadow-lift sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14", i % 2 ? "bg-ink-900 text-white" : "bg-white ring-1 ring-ink-900/[0.06]")}>
                <div className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-2")}>
                  <PhotoFrame image={a.image} sizes="(min-width: 1024px) 480px, 100vw" arch accent={i % 2 ? "olive" : "sand"} accentSide={i % 2 ? "left" : "right"} className="mx-auto max-w-[440px]" />
                </div>
                <div className={cn("lg:col-span-7", i % 2 === 1 && "lg:order-1")}>
                  <p className={cn("font-display text-7xl leading-none", i % 2 ? "text-white/15" : "text-ink-900/10")} aria-hidden="true">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className={cn("mt-2 font-display text-5xl font-normal", i % 2 === 1 && "text-white")}>{a.title}</h3>
                  <p className={cn("mt-5 text-lg", i % 2 ? "text-white/80" : "text-grey-700")}>{a.text}</p>
                  {a.points && (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {a.points.map((p) => (
                        <li key={p} className={cn("flex items-center gap-3 rounded-lg p-4", i % 2 ? "bg-white/[0.06] text-white/90 ring-1 ring-white/10" : "bg-warm text-grey-900")}>
                          <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full", i % 2 ? "bg-bronze-300/20 text-bronze-300" : "bg-olive-600 text-white")}><Icon.check className="h-4 w-4" /></span>{p}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href={a.link.href} className={cn("btn btn-lg mt-8", i % 2 ? "btn-light" : "btn-primary")} data-cursor="View">{a.link.label} <Icon.arrow className="h-4 w-4" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
