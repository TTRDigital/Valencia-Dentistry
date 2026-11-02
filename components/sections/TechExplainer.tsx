"use client";

import { useState } from "react";
import type { TechExplainerSection } from "@/lib/types";
import { FeatureIcon } from "@/components/sections/FeatureGrid";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * Technology, explained: each card shows what the tool is, and reveals what it
 * means for the patient on hover or keyboard focus, or when tapped (the toggle
 * button). On touch screens the "for you" line is always shown. Space is
 * reserved, so revealing it never shifts the layout.
 */
export function TechExplainer({ s }: { s: TechExplainerSection }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <Section className={s.dark ? "dark-section" : "bg-white"} id="technology">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[4px] bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={(i % 3) * 70} className={cn("tech-card group relative flex flex-col p-7", s.dark ? "bg-ink-900" : "bg-white")}>
              <div data-open={open[i] ? "" : undefined} className="tech-inner flex h-full flex-col">
                <FeatureIcon name={it.icon} dark={s.dark} />
                <h3 className={cn("mt-5 text-xl", s.dark && "text-white")}>{it.title}</h3>
                <p className={cn("mt-2 text-[0.95rem]", s.dark ? "text-white/75" : "text-grey-700")}>{it.text}</p>
                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    className={cn("tech-toggle inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline", s.dark ? "text-bronze-300" : "text-olive-700")}
                    aria-expanded={!!open[i]}
                    aria-controls={`tech-${i}`}
                    onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                  >
                    What this means for you
                  </button>
                  <p id={`tech-${i}`} className={cn("tech-for-you mt-1 border-l-2 pl-3 text-[0.95rem]", s.dark ? "border-bronze-300 text-white" : "border-olive-600 text-ink-900")}>{it.forYou}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
