"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { prefersReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

let lenis: Lenis | null = null;
/** The smooth-scroll instance (null under reduced motion), for other components that need to scroll. */
export const getLenis = () => lenis;

/**
 * Site-wide motion, mounted once in the root layout:
 * - Lenis smooth scrolling driven by the GSAP ticker (native touch scrolling on phones).
 * - Per page (re-run on route change, reverted on leave):
 *   headings rise line by line from masks; photos wipe up into their frames and settle from a
 *   zoom (ending at their natural size so they stay sharp), then drift with a gentle parallax on
 *   desktop; heroes recede as you scroll; horizontal galleries pin and slide on desktop; the
 *   ticker speeds up with scroll velocity; primary buttons are magnetic under a fine pointer.
 * Reduced motion: none of this runs. Without JavaScript everything is simply visible.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95, anchors: { offset: -96 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("motion-on");
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      document.documentElement.classList.remove("motion-on");
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
    const mm = gsap.matchMedia();
    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      // 2. Photos: wipe up into the frame, image settles from 1.25x to its natural size
      document.querySelectorAll<HTMLElement>("main .pf").forEach((root) => {
        const frame = root.querySelector<HTMLElement>(".pf-frame");
        const img = frame?.querySelector("img");
        if (!frame || !img) return;
        const inHero = !!root.closest("[data-hero]");
        const tl = gsap.timeline({ scrollTrigger: inHero ? undefined : { trigger: root, start: "top 88%", once: true } });
        tl.fromTo(frame, { clipPath: inHero ? "inset(6% 6% 6% 6% round 24px)" : "inset(100% 0% 0% 0% round 12px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: inHero ? 1.4 : 1.3, ease: "expo.out", clearProps: "clipPath" })
          .fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out", clearProps: "transform" }, 0);
      });

      mm.add({ desktop: "(min-width: 1024px)", phone: "(max-width: 1023.98px)" }, (mq) => {
        const k = mq.conditions?.desktop ? 1 : 0.55; // phones move a little less
        // 3. Gentle parallax: whole frames drift (no image scaling, so nothing softens)
        document.querySelectorAll<HTMLElement>("main .pf").forEach((root) => {
          if (root.closest("[data-hero]")) return;
          gsap.fromTo(root, { y: 36 * k }, { y: -36 * k, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
        // 4. Heroes recede: copy lifts and fades a little, media drifts down
        document.querySelectorAll<HTMLElement>("main [data-hero]").forEach((hero) => {
          const copy = hero.querySelector(".hero-stage");
          const media = hero.querySelector("[data-hero-media]");
          const st = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 };
          if (copy) gsap.to(copy, { y: -90 * k, opacity: 0.35, ease: "none", scrollTrigger: st });
          if (media) gsap.to(media, { y: 70 * k, scale: 0.94, ease: "none", scrollTrigger: st });
        });
        // 5. Horizontal galleries pin and slide
        document.querySelectorAll<HTMLElement>("[data-hscroll]").forEach((section) => {
          const track = section.querySelector<HTMLElement>("[data-hscroll-track]");
          if (!track) return;
          const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
          const bar = section.querySelector<HTMLElement>("[data-hscroll-progress]");
          const count = section.querySelector<HTMLElement>("[data-hscroll-count]");
          const n = track.querySelectorAll(":scope > li").length - 1;
          gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: 0.8, pin: true, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (st) => {
              if (bar) bar.style.transform = `scaleX(${st.progress})`;
              if (count) count.textContent = String(Math.min(n, Math.floor(st.progress * n) + 1)).padStart(2, "0");
            } } });
        });
        // 6b. Giant outline type drifts sideways with scroll
        document.querySelectorAll<HTMLElement>("main [data-drift]").forEach((el) => {
          gsap.fromTo(el, { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        });
        // 6. Watermarks drift slowly
        document.querySelectorAll<SVGElement>("main svg.watermark").forEach((w) => {
          gsap.fromTo(w, { yPercent: -10, rotate: -4 }, { yPercent: 10, rotate: 4, ease: "none", scrollTrigger: { trigger: w.parentElement, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
      });

      // 7. Ticker: endless loop whose speed follows scroll velocity
      document.querySelectorAll<HTMLElement>(".marquee-track").forEach((track) => {
        track.style.animation = "none";
        const rev = track.dataset.reverse !== undefined;
        const loop = rev ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 52, ease: "none", repeat: -1 }) : gsap.to(track, { xPercent: -50, duration: 46, ease: "none", repeat: -1 });
        const host = track.closest(".marquee");
        const pause = () => loop.pause();
        const play = () => loop.play();
        host?.addEventListener("pointerenter", pause);
        host?.addEventListener("pointerleave", play);
        cleanups.push(() => { host?.removeEventListener("pointerenter", pause); host?.removeEventListener("pointerleave", play); });
        const onScroll = ({ velocity }: { velocity: number }) => {
          gsap.to(loop, { timeScale: (velocity < 0 ? -1 : 1) * (1 + Math.min(Math.abs(velocity) * 0.35, 6)), duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: velocity < 0 ? -1 : 1, duration: 1.2, delay: 0.25, overwrite: false });
        };
        lenis?.on("scroll", onScroll);
        cleanups.push(() => lenis?.off("scroll", onScroll));
      });

      // 8. Magnetic primary buttons (fine pointers only)
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const off: (() => void)[] = [];
        document.querySelectorAll<HTMLElement>(".btn-primary, .btn-light").forEach((btn) => {
          const move = (e: PointerEvent) => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: "power3.out" });
          };
          const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
          btn.addEventListener("pointermove", move);
          btn.addEventListener("pointerleave", leave);
          off.push(() => { btn.removeEventListener("pointermove", move); btn.removeEventListener("pointerleave", leave); });
        });
        return () => off.forEach((f) => f());
      });
    });

    // Recalculate once fonts and images have settled
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 600);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      cleanups.forEach((c) => c());
      mm.revert();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
