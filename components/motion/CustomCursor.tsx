"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Desktop cursor: a small dot and a trailing ring. Over links and buttons the ring grows; over
 * elements with data-cursor="View" / "Drag" it becomes a filled disc with that word.
 * Only with a fine pointer and motion allowed; the system cursor stays visible underneath.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const d = dot.current!, r = ring.current!, l = label.current!;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(d, "x", { duration: 0.08 }), dy = gsap.quickTo(d, "y", { duration: 0.08 });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });
    let mode = "";
    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target as Element | null;
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      const next = tagged ? `label:${tagged.dataset.cursor}` : t?.closest("a, button, [role=slider], summary, input, select, textarea, label") ? "hover" : "";
      if (next === mode) return;
      mode = next;
      r.dataset.mode = next.startsWith("label") ? "label" : next;
      l.textContent = next.startsWith("label:") ? next.slice(6) : "";
    };
    const leave = () => { r.dataset.mode = "hidden"; d.dataset.mode = "hidden"; };
    const enter = () => { r.dataset.mode = mode.startsWith("label") ? "label" : mode; d.dataset.mode = ""; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true"><span ref={label} /></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
