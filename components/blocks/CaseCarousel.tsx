"use client";

import { useRef } from "react";
import type { BeforeAfterCase } from "@/lib/types";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";

/** Scroll-snap carousel of stacked before/after pairs (three per view on desktop). */
export function CaseCarousel({ cases }: { cases: BeforeAfterCase[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 20), behavior: "smooth" });
  };
  return (
    <div className="relative">
      <ul ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0" aria-label="Before and after cases">
        {cases.map((c) => (
          <li key={c.id} className="card w-[85%] shrink-0 snap-start overflow-hidden sm:w-[48%] lg:w-[31.5%]">
            <figure>
              <div className="relative aspect-[5/4]">
                <Picture image={c.before} fill sizes="(min-width: 1024px) 400px, 85vw" className="object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Before</span>
              </div>
              <div className="relative aspect-[5/4] border-t-2 border-bronze-300">
                <Picture image={c.after} fill sizes="(min-width: 1024px) 400px, 85vw" className="object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-900">After</span>
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-5 py-4 text-sm"><span className="font-semibold text-ink-900">{c.title}</span><span className="text-grey-600">{c.treatment}</span></figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center gap-2">
        <button type="button" onClick={() => scroll(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline bg-white text-ink-900 hover:bg-ink-900/5" aria-label="Previous cases"><Icon.arrow className="h-5 w-5 rotate-180" /></button>
        <button type="button" onClick={() => scroll(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline bg-white text-ink-900 hover:bg-ink-900/5" aria-label="Next cases"><Icon.arrow className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
