"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky in-page navigation for long pages: a bar of section links under the header that
 * highlights the section being read and keeps the active link scrolled into view on phones.
 */
export function SectionNav({ items, label = "On this page", className }: { items: { id: string; label: string }[]; label?: string; className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const bar = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const els = items.map((t) => document.getElementById(t.id)).filter((x): x is HTMLElement => !!x);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target.id, e.isIntersecting);
      const first = items.find((t) => seen.get(t.id));
      setActive(first ? first.id : null);
    }, { rootMargin: "-140px 0px -55% 0px" });
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [items]);
  useEffect(() => {
    const a = active && bar.current?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (a && bar.current) bar.current.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
  }, [active]);
  return (
    <nav aria-label={label} className={cn("sticky top-16 z-30 border-y border-ink-900/10 bg-warm/95 backdrop-blur-md", className)}>
      <div className="container-x">
        <ul ref={bar} className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 py-2 sm:mx-0 sm:px-0">
          {items.map((t) => (
            <li key={t.id} className="shrink-0">
              <a
                href={`#${t.id}`}
                aria-current={active === t.id ? "location" : undefined}
                className={cn("inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-[var(--dur-micro)]", active === t.id ? "bg-ink-900 text-white" : "text-grey-700 hover:bg-ink-900/5 hover:text-ink-900")}
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
