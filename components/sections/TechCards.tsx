"use client";

import { useState } from "react";
import type { TechExplainerSection } from "@/lib/types";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Technology, explained: each card shows what the tool is, and reveals what it
 * means for the patient on hover or keyboard focus, or when tapped (the toggle
 * button). On touch screens the "for you" line is always shown. Space is
 * reserved, so revealing it never shifts the layout.
 */
export function TechCards({ s }: { s: TechExplainerSection }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <ul
      onPointerMove={(e) => {
        // the light follows the pointer inside the card it is over
        const li = (e.target as HTMLElement).closest<HTMLElement>("li");
        if (!li) return;
        const r = li.getBoundingClientRect();
        li.style.setProperty("--mx", `${e.clientX - r.left}px`);
        li.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn("mt-12 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2", s.dark ? "bg-white/10" : "bg-ink-900/10", s.items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={(i % 3) * 70} className={cn("tech-card spotlight subgrid-card group relative p-7 [--rows:4] sm:p-9", s.dark ? "bg-ink-900" : "bg-white")}>
              <div data-open={open[i] ? "" : undefined} className="tech-inner subgrid-card [--rows:4]">
                <div><FeatureIcon name={it.icon} dark={s.dark} /></div>
                <h3 className={cn("mt-5 text-xl", s.dark && "text-white")}>{it.title}</h3>
                <p className={cn("mt-2 text-base sm:text-[0.95rem]", s.dark ? "text-white/75" : "text-grey-700")}>{it.text}</p>
                <div className="pt-5">
                  <button
                    type="button"
                    className={cn("tech-toggle inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline", s.dark ? "text-bronze-300" : "text-olive-700")}
                    aria-expanded={!!open[i]}
                    aria-controls={`tech-${i}`}
                    onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                  >
                    What this means for you
                  </button>
                  <p id={`tech-${i}`} className={cn("tech-for-you mt-1 border-l-2 pl-3 text-base sm:text-[0.95rem]", s.dark ? "border-bronze-300 text-white" : "border-olive-600 text-ink-900")}>{it.forYou}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
  );
}
