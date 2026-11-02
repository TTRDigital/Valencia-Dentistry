"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

const STAGGER = 70; // ms between siblings in a group
const MAX_DELAY = 420;

/**
 * Scroll reveal for elements marked `data-reveal` (components/ui/Reveal.tsx, SectionHeading):
 * fade + rise (--rise), --dur-large, ease-out, once only.
 *
 * - Content is visible by default. Only elements that start below the fold are hidden,
 *   and only after hydration, so nothing is stuck at opacity 0 without JavaScript and
 *   nothing above the fold flashes. Reduced motion: no-op.
 * - Groups: inside an element marked `data-stagger`, revealed siblings get an automatic
 *   60–90ms cascade (explicit --reveal-delay wins). Items that enter together cascade;
 *   items that enter later reveal on their own without waiting.
 * - When the reveal has finished the classes are removed, so hover transforms and
 *   transitions on the element work normally afterwards.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.reveal-in)")];
    const below = els.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
    if (!below.length) return;
    for (const el of below) el.classList.add("reveal-pending");
    const finish = (el: HTMLElement) => {
      el.classList.remove("reveal-in");
      el.style.removeProperty("--reveal-auto");
    };
    const io = new IntersectionObserver(
      (entries) => {
        // entries arriving in the same callback are revealed as one cascade
        const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        const groupCount = new Map<Element, number>();
        for (const el of batch) {
          const group = el.parentElement?.closest("[data-stagger]");
          if (group && !el.style.getPropertyValue("--reveal-delay")) {
            const i = groupCount.get(group) ?? 0;
            groupCount.set(group, i + 1);
            el.style.setProperty("--reveal-auto", `${Math.min(i * STAGGER, MAX_DELAY)}ms`);
          }
          el.classList.remove("reveal-pending");
          el.classList.add("reveal-in");
          io.unobserve(el);
          const done = (ev: TransitionEvent) => { if (ev.target === el && ev.propertyName === "opacity") { finish(el); el.removeEventListener("transitionend", done); } };
          el.addEventListener("transitionend", done);
          window.setTimeout(() => finish(el), 1600); // safety net if transitionend never fires
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
