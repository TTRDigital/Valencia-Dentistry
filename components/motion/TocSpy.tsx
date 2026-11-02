"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * "On this page" list for long pages. Highlights the section currently being read
 * (IntersectionObserver, no scroll handlers) so the sticky sidebar doubles as a progress guide.
 */
export function TocSpy({ items, className }: { items: { id: string; label: string }[]; className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = items.map((t) => document.getElementById(t.id)).filter((x): x is HTMLElement => !!x);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target.id, e.isIntersecting);
      const first = items.find((t) => seen.get(t.id));
      if (first) setActive(first.id);
    }, { rootMargin: "-20% 0px -55% 0px" });
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="On this page" className={className}>
      <p className="text-sm font-semibold text-ink-900">On this page</p>
      <ol className="mt-3 space-y-0.5 border-l border-ink-900/10">
        {items.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              aria-current={active === t.id ? "location" : undefined}
              className={cn("toc-link -ml-px block min-h-11 border-l-2 py-2 pl-4 text-[0.95rem]", active === t.id ? "border-olive-600 font-semibold text-ink-900" : "border-transparent text-grey-700 hover:border-ink-900/30 hover:text-ink-900")}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
