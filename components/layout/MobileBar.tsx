"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";

/**
 * Sticky bottom bar on phones: Call / Book / Directions (≥44px targets).
 * It slides in (transform, 300ms) once the page hero has scrolled away, so it
 * never covers the hero's own call to action. Pages without a hero show it
 * at once; without JavaScript it is always shown (see .js in globals.css).
 */
export function MobileBar() {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const setShown = (on: boolean) => { el.toggleAttribute("data-show", on); el.inert = !on; };
    const hero = document.querySelector("[data-hero]");
    if (!hero || !("IntersectionObserver" in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { threshold: 0, rootMargin: "-120px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);
  const items = [
    { label: "Call", href: `tel:${site.phone.tel}`, I: Icon.phone, external: false },
    { label: "Text", href: site.sms, I: Icon.mail, external: false },
    { label: "Book", href: site.bookingUrl, I: Icon.calendar, external: true, primary: true },
    { label: "Directions", href: site.directionsUrl, I: Icon.directions, external: true },
  ];
  return (
    <nav ref={bar} aria-label="Quick actions" className="mobile-bar fixed inset-x-3 bottom-3 z-40 rounded-full bg-olive-900/95 p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-xl mb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid grid-cols-[1fr_1fr_1.5fr_1fr] items-center">
        {items.map(({ label, href, I, external, primary }) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={primary ? "flex min-h-12 items-center justify-center gap-2 rounded-full bg-white font-semibold text-olive-900 active:scale-95 transition-transform" : "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[0.75rem] font-semibold text-white/90 active:scale-95 transition-transform"}
            >
              <I className={primary ? "h-4 w-4" : "h-5 w-5 text-bronze-300"} />
              {primary ? "Book a visit" : label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
