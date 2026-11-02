"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Counts up to `value` the first time it scrolls into view (600ms, ease-out).
 * Server render and no-JS show the final value; screen readers always get the
 * final value. Width is reserved (tabular figures, min-width) so no layout shift.
 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const final = `${prefix}${value.toFixed(decimals)}${suffix}`;
  const [shown, setShown] = useState(final);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    // Only animate numbers that start off screen, so nothing visibly jumps on load.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const fmt = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / 600);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(fmt(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setShown(fmt(0));
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", minWidth: `${final.length}ch`, fontVariantNumeric: "tabular-nums" }}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
