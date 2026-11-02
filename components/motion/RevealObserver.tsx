"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Scroll reveal for elements marked `data-reveal` (see components/ui/Reveal.tsx):
 * fade + 16px rise, 500ms ease-out, staggered with `--reveal-delay`.
 *
 * Content is visible by default. Only elements that start below the fold are
 * hidden, and only after hydration, so nothing is ever stuck at opacity 0
 * without JavaScript, and nothing above the fold flashes. Reduced motion: no-op.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.reveal-in)")];
    const below = els.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
    if (!below.length) return;
    for (const el of below) el.classList.add("reveal-pending");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.remove("reveal-pending");
          el.classList.add("reveal-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of below) io.observe(el);
    return () => {
      io.disconnect();
      for (const el of below) el.classList.remove("reveal-pending");
    };
  }, [pathname]);
  return null;
}
