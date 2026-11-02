"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import type { Testimonial } from "@/lib/types";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-400" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => <Icon.star key={i} className={`h-4 w-4 ${i < n ? "" : "opacity-25"}`} />)}
    </span>
  );
}

const ADVANCE_MS = 6000;

function ReviewCard({ t, className }: { t: Testimonial; className?: string }) {
  return (
          <li className={cn("card flex flex-col p-7", className)}>
            <div className="flex items-center justify-between">
              <Stars n={t.rating} />
              <Icon.google className="h-5 w-5" />
            </div>
            <blockquote className="mt-4 flex-1 text-base leading-relaxed text-grey-700">“{t.text}”</blockquote>
            <footer className="mt-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-greige-100 font-semibold text-olive-700" aria-hidden="true">{t.author.charAt(0)}</span>
              <div>
                <p className="font-semibold text-ink-900">{t.author}</p>
                <p className="text-xs text-grey-600">Google review{t.when ? ` · ${t.when}` : ""}</p>
              </div>
            </footer>
          </li>
  );
}

/**
 * Scroll-snap carousel (native scrolling, keyboard and touch friendly) with prev/next buttons.
 * Auto-advances every 6s, one card at a time, looping back to the start. It pauses while the
 * pointer is over it, while anything inside has focus, while it is off-screen or the tab is hidden,
 * and when the visitor presses Pause (WCAG 2.2.2). Reduced motion: it never starts. A thin line
 * under the cards fills over the 6s so the movement is never a surprise.
 */
export function ReviewCarousel({ items }: { items: Testimonial[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // With three reviews or fewer there is nothing to scroll: show them as a plain grid, no arrows, no autoplay.
  const fewItems = items.length <= 3;
  const [userPaused, setUserPaused] = useState(false);
  const playing = !reduced && !userPaused && !fewItems;
  const [hold, setHold] = useState({ hover: false, focus: false, offscreen: true });
  const [tick, setTick] = useState(0);
  const paused = !playing || hold.hover || hold.focus || hold.offscreen;

  const scroll = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = (card?.clientWidth ?? 320) + 20;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * step, behavior: "smooth" });
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHold((h) => ({ ...h, offscreen: !e.isIntersecting })), { threshold: 0.4 });
    io.observe(el);
    const vis = () => setHold((h) => ({ ...h, offscreen: document.hidden || h.offscreen }));
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => scroll(1), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [paused, tick, scroll]);

  if (fewItems) {
    return (
      <ul className={cn("grid gap-5", items.length === 2 && "sm:grid-cols-2", items.length === 3 && "md:grid-cols-3", items.length === 1 && "max-w-2xl")} aria-label="Patient reviews">
        {items.map((t) => <ReviewCard key={t.id} t={t} className="h-full" />)}
      </ul>
    );
  }
  return (
    <div
      ref={wrap}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHold((h) => ({ ...h, hover: true }))}
      onPointerLeave={() => setHold((h) => ({ ...h, hover: false }))}
      onFocus={() => setHold((h) => ({ ...h, focus: true }))}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold((h) => ({ ...h, focus: false })); }}
    >
      <ul ref={ref} tabIndex={0} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0" aria-label="Patient reviews (scroll sideways for more)">
        {items.map((t) => <ReviewCard key={t.id} t={t} className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]" />)}
      </ul>
      <div className="mt-6 flex items-center gap-2">
        <button type="button" onClick={() => scroll(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline text-ink-900 hover:bg-ink-900/5" aria-label="Previous reviews"><Icon.arrow className="h-5 w-5 rotate-180" /></button>
        <button type="button" onClick={() => scroll(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline text-ink-900 hover:bg-ink-900/5" aria-label="Next reviews"><Icon.arrow className="h-5 w-5" /></button>
        {items.length > 1 && (
          <button type="button" onClick={() => setUserPaused((p) => !p)} className="ml-1 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-grey-700 hover:bg-ink-900/5 hover:text-ink-900" aria-label={playing ? "Pause automatic scrolling of reviews" : "Play automatic scrolling of reviews"}>
            {playing ? <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true"><path d="M6 4h3v12H6zM11 4h3v12h-3z" fill="currentColor" /></svg> : <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>}
            {playing ? "Pause" : "Play"}
          </button>
        )}
        {playing && (
          <span className="ml-auto h-0.5 w-24 overflow-hidden rounded-full bg-ink-900/10" aria-hidden="true">
            <span key={tick} className="review-progress block h-full origin-left bg-olive-600" style={{ animationPlayState: paused ? "paused" : "running", animationDuration: `${ADVANCE_MS}ms` }} />
          </span>
        )}
      </div>
    </div>
  );
}
