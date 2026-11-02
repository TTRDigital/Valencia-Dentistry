"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { BeforeAfterCase } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/**
 * Drag-to-compare before/after slider.
 * - Pointer: drag anywhere on the image (mouse, touch, pen).
 * - Keyboard: the handle is a focusable role="slider" with aria-valuenow;
 *   Arrow keys move 2%, Page Up/Down 10%, Home/End jump to the ends.
 * - Only transforms move (the before layer and the handle), so no layout work.
 * - Without JavaScript the images show split at 50%.
 */
export function CompareSlider({ cases }: { cases: BeforeAfterCase[] }) {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const c = cases[active];

  const fromClientX = useCallback((x: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(clamp(((x - r.left) / r.width) * 100));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    fromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => { if (dragging) fromClientX(e.clientX); };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -2, ArrowDown: -2, ArrowRight: 2, ArrowUp: 2, PageDown: -10, PageUp: 10 }[e.key];
    if (step !== undefined) { e.preventDefault(); setPos((p) => clamp(p + step)); }
    else if (e.key === "Home") { e.preventDefault(); setPos(0); }
    else if (e.key === "End") { e.preventDefault(); setPos(100); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <figure className="lg:col-span-8">
        <div
          ref={frame}
          className="relative aspect-[13/12] w-full touch-pan-y select-none overflow-hidden rounded-[4px] bg-grey-100 sm:aspect-[4/3]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ cursor: dragging ? "grabbing" : "ew-resize" }}
        >
          {/* After: full frame */}
          <Picture key={`a-${c.id}`} image={c.after} fill sizes="(min-width: 1024px) 820px, 100vw" className="compare-fade object-cover" />
          {/* Before: a full-size layer clipped by an overflow window that slides with transforms */}
          <div className="absolute inset-0 overflow-hidden" style={{ transform: `translateX(${pos - 100}%)` }} aria-hidden="true">
            <div className="absolute inset-0" style={{ transform: `translateX(${100 - pos}%)` }}>
              <Picture key={`b-${c.id}`} image={c.before} fill sizes="(min-width: 1024px) 820px, 100vw" className="compare-fade object-cover" alt="" />
            </div>
          </div>
          <span className="pointer-events-none absolute left-3 top-3 rounded-[2px] bg-ink-900/85 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-white">Before</span>
          <span className="pointer-events-none absolute right-3 top-3 rounded-[2px] bg-white/90 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-ink-900">After</span>
          {/* Handle: a full-width track moved with translateX, line and knob at its left edge */}
          <div className="pointer-events-none absolute inset-0" style={{ transform: `translateX(${pos}%)` }}>
            <div className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.15)]" />
            <div
              role="slider"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)}% of the before photo shown`}
              aria-labelledby={labelId}
              onKeyDown={onKeyDown}
              className="pointer-events-auto absolute left-0 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-white text-ink-900 shadow-lift outline-offset-4 focus-visible:outline-3 focus-visible:outline-olive-600"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 7-4 5 4 5M15 7l4 5-4 5" /></svg>
            </div>
          </div>
        </div>
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span id={labelId} className="font-semibold text-ink-900">Compare before and after: {c.title}</span>
          <span className="text-grey-600">{c.treatment}</span>
        </figcaption>
        <p className="sr-only">{c.before.alt}. {c.after.alt}.</p>
      </figure>
      <div className="lg:col-span-4">
        <p className="text-sm font-semibold text-ink-900">More cases</p>
        <ul className="mt-3 grid grid-cols-4 gap-2 lg:grid-cols-2">
          {cases.map((k, i) => (
            <li key={k.id}>
              <button
                type="button"
                onClick={() => { setActive(i); setPos(50); }}
                aria-pressed={i === active}
                aria-label={`Show case: ${k.title}, ${k.treatment}`}
                className={cn("block w-full overflow-hidden rounded-[4px] ring-2 ring-offset-2 ring-offset-warm transition-transform duration-200 hover:-translate-y-0.5", i === active ? "ring-olive-600" : "ring-transparent")}
              >
                <Picture image={k.after} sizes="160px" className="aspect-[4/3] w-full object-cover" quality={60} alt="" />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-grey-600">Drag the handle, or focus it and use the arrow keys.</p>
      </div>
    </div>
  );
}
