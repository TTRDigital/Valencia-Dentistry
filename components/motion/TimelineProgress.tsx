"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Wraps an ordered list of steps (children with `data-step`). As the visitor
 * scrolls, the progress line draws down (scaleY) and each step's marker fills
 * in when the step passes 60% of the viewport height. Server render and
 * reduced motion show the finished state: full line, every marker filled.
 */
export function TimelineProgress({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const steps = [...el.querySelectorAll<HTMLElement>("[data-step]")];
    const line = el.querySelector<HTMLElement>("[data-progress]");
    if (!steps.length || !line) return;
    // Start from the scroll position the visitor is at (no flash: changes only off-screen steps).
    const done = new Set<number>();
    const update = () => {
      steps.forEach((s, i) => s.toggleAttribute("data-active", done.has(i)));
      const last = Math.max(-1, ...done);
      el.dataset.current = String(Math.max(0, last)); // lets a section swap its photo per step
      line.style.transform = `scaleY(${(last + 1) / steps.length})`;
    };
    steps.forEach((s, i) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.6) done.add(i); });
    el.setAttribute("data-animated", "");
    update();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = steps.indexOf(e.target as HTMLElement);
          if (e.isIntersecting) done.add(i);
          else if (e.boundingClientRect.top > 0) done.delete(i); // scrolled back above it
        }
        update();
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return <div ref={root} className={className}>{children}</div>;
}
