"use client";

import { useState, type ReactNode } from "react";

/** One technology card: the description opens on hover (fine pointers) or on tap (the whole card is a button). */
export function TechCard({ label, title, text, children }: { label?: string; title: string; text: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="tech-card" data-open={open || undefined}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="block w-full text-left">
        <span className="relative block aspect-[4/3] overflow-hidden bg-greige-50">{children}</span>
        <span className="block p-6 sm:p-7">
          {label && <span className="block text-xs font-bold uppercase tracking-[0.14em] text-bronze-600">{label}</span>}
          <span className="mt-2 flex items-center justify-between gap-3 text-2xl font-semibold text-ink-900">{title}<span aria-hidden="true" className="tech-plus text-olive-600">+</span></span>
          <span className="tech-desc block text-grey-700">{text}</span>
        </span>
      </button>
    </li>
  );
}
