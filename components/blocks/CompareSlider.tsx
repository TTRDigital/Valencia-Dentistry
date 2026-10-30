"use client";

import { useId, useState } from "react";
import type { BeforeAfterCase } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils";

/**
 * Before/after comparison: a range input (keyboard accessible) drives the
 * reveal; thumbnails switch cases. Pure CSS clip, no animation library.
 */
export function CompareSlider({ cases }: { cases: BeforeAfterCase[] }) {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);
  const id = useId();
  const c = cases[active];
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-8">
        <div className="card overflow-hidden p-2 sm:p-3">
          <div className="relative aspect-[13/12] w-full select-none overflow-hidden rounded-2xl bg-grey-100 sm:aspect-[4/3]">
            {/* After (full) */}
            <Picture image={c.after} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
            {/* Before (clipped) */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Picture image={c.before} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" style={{ left: `${pos}%` }} aria-hidden="true">
              <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-900 shadow-lift">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 7-4 5 4 5M15 7l4 5-4 5" /></svg>
              </span>
            </div>
            <span className="absolute left-3 top-3 rounded-full bg-navy-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Before</span>
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-900">After</span>
            <input
              id={id}
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Compare before and after"
              aria-valuetext={`${pos}% before`}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 pt-3 text-sm">
            <p className="font-semibold text-navy-900">{c.title}</p>
            <p className="text-grey-600">{c.treatment}</p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-steel-600">Cases</p>
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-2">
          {cases.map((k, i) => (
            <li key={k.id}>
              <button
                type="button"
                onClick={() => { setActive(i); setPos(50); }}
                aria-pressed={i === active}
                aria-label={`Show case: ${k.title}`}
                className={cn("block w-full overflow-hidden rounded-xl ring-2 transition-[transform,box-shadow] hover:-translate-y-0.5", i === active ? "ring-steel-600 shadow-lift" : "ring-transparent")}
              >
                <Picture image={k.after} sizes="160px" className="aspect-[4/3] w-full object-cover" quality={60} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
