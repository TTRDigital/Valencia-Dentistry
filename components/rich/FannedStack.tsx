"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { SiteImage } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { prefersReducedMotion } from "@/components/motion/useReducedMotion";

/**
 * Three real photos fanned like prints on a table: the portrait in front (in the arch), two
 * landscape photos tilted behind. On load they spread out from a single pile; with a fine pointer
 * the layers shift by depth as the cursor moves, which gives the hero a quiet 3D feel.
 * Every photo keeps its own proportions (no heads cut) and is shown smaller than its file.
 */
export function FannedStack({ main, side, mainRatio = 2 / 3 }: { main: SiteImage; side: SiteImage[]; mainRatio?: number }) {
  const landscape = mainRatio > 1;
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const layers = [...el.querySelectorAll<HTMLElement>("[data-depth]")];
    const ctx = gsap.context(() => {
      gsap.from(layers.filter((l) => l.dataset.depth !== "front"), { x: (i) => (i ? -90 : 90), rotate: 0, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.25, stagger: 0.08 });
    }, el);
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return () => ctx.revert();
    const movers = layers.map((l) => ({ x: gsap.quickTo(l, "x", { duration: 0.9, ease: "power3" }), y: gsap.quickTo(l, "y", { duration: 0.9, ease: "power3" }), f: Number(l.dataset.factor) }));
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      movers.forEach((m) => { m.x(nx * m.f); m.y(ny * m.f); });
    };
    const onLeave = () => movers.forEach((m) => { m.x(0); m.y(0); });
    const host = el.closest("section") ?? el;
    host.addEventListener("pointermove", onMove as EventListener);
    host.addEventListener("pointerleave", onLeave);
    return () => { host.removeEventListener("pointermove", onMove as EventListener); host.removeEventListener("pointerleave", onLeave); ctx.revert(); };
  }, []);
  const [a, b] = side;
  return (
    <div ref={root} className={landscape ? "relative mx-auto aspect-[6/5] w-full max-w-[560px]" : "relative mx-auto aspect-[5/6] w-full max-w-[540px]"}>
      {a && (
        <div data-depth="back" data-factor="-26" className="absolute left-0 top-[6%] w-[54%] -rotate-[8deg] overflow-hidden rounded-lg shadow-lift ring-1 ring-white/10" style={{ aspectRatio: "3 / 2" }}>
          <Picture image={a} fill sizes="(min-width: 1024px) 330px, 56vw" className="object-cover" />
        </div>
      )}
      {b && (
        <div data-depth="back" data-factor="-18" className="absolute bottom-[10%] right-0 w-[58%] rotate-[7deg] overflow-hidden rounded-lg shadow-lift ring-1 ring-white/10" style={{ aspectRatio: "3 / 2" }}>
          <Picture image={b} fill sizes="(min-width: 1024px) 320px, 54vw" className="object-cover" />
        </div>
      )}
      <div data-depth="front" data-factor="34" className={landscape ? "absolute left-1/2 top-1/2 w-[80%] -translate-x-1/2 -translate-y-1/2" : "absolute left-1/2 top-[2%] w-[62%] -translate-x-1/2"}>
        <div className={(landscape ? "rounded-lg" : "arch") + " relative overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15"} style={{ aspectRatio: landscape ? String(mainRatio) : "2 / 3" }}>
          <Picture image={main} fill priority sizes={landscape ? "(min-width: 1024px) 460px, 80vw" : "(min-width: 1024px) 340px, 60vw"} className="object-cover object-top" />
        </div>
      </div>
    </div>
  );
}
