"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { TreatmentPickerSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * "What's bringing you in?" A radio group of concerns (roving tab index,
 * arrow keys move and select) and an answer panel that points to the right
 * service pages. The answer fades and rises in on change (300ms); reduced
 * motion shows it instantly. Without JavaScript the first answer shows and
 * every service is still linked in the noscript list.
 */
export function TreatmentPicker({ s }: { s: TreatmentPickerSection }) {
  const [sel, setSel] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const groupId = useId();
  const opt = s.options[sel];

  const move = (to: number) => {
    const n = (to + s.options.length) % s.options.length;
    setSel(n);
    refs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); move(i + 1); }
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); move(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); move(0); }
    else if (e.key === "End") { e.preventDefault(); move(s.options.length - 1); }
  };

  return (
    <Section className="bg-warm" id="find-treatment">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={s.eyebrow} heading={<span id={groupId}>{s.heading}</span>} lead={s.lead} />
            <div role="radiogroup" aria-labelledby={groupId} className="mt-8 grid border-t border-ink-900/10">
              {s.options.map((o, i) => (
                <button
                  key={o.id}
                  ref={(el) => { refs.current[i] = el; }}
                  type="button"
                  role="radio"
                  aria-checked={i === sel}
                  tabIndex={i === sel ? 0 : -1}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "group relative flex min-h-14 w-full items-center gap-4 border-b border-ink-900/10 py-3 text-left font-display text-2xl transition-[color,transform] duration-300 ease-out hover:translate-x-2 sm:text-3xl",
                    i === sel ? "italic text-olive-700" : "text-ink-900/70 hover:text-ink-900",
                  )}
                >
                  <span className={cn("font-sans text-sm font-semibold not-italic tabular-nums", i === sel ? "text-olive-600" : "text-grey-400")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{o.label}</span>
                  <Icon.arrow className={cn("h-5 w-5 shrink-0 transition-transform duration-300", i === sel ? "translate-x-0 text-olive-600" : "-translate-x-2 text-transparent group-hover:translate-x-0 group-hover:text-grey-400")} />
                  <span aria-hidden="true" className={cn("absolute bottom-[-1px] left-0 h-0.5 bg-olive-600 transition-[width] duration-500 ease-out", i === sel ? "w-full" : "w-0")} />
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div aria-live="polite" className="h-full">
              <div key={opt.id} className="picker-answer flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lift ring-1 ring-ink-900/[0.06]">
                {opt.image && (
                  <div className="relative overflow-hidden bg-greige-50" style={{ aspectRatio: "3 / 2" }}>
                    <Picture image={opt.image} fill sizes="(min-width: 1024px) 680px, 100vw" className="picker-photo object-cover" />
                    <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink-900">{opt.label}</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-7 sm:p-10">
                <h3 className="font-display text-4xl font-normal">{opt.title}</h3>
                <p className="mt-4 max-w-xl text-lg text-grey-700">{opt.text}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {opt.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group flex min-h-14 items-center justify-between gap-3 rounded-lg border border-ink-900/15 px-4 py-3 font-semibold text-ink-900 transition-transform duration-200 hover:-translate-y-0.5 hover:border-olive-600">
                        <span>{l.label}{l.description && <span className="block text-sm font-normal text-grey-600">{l.description}</span>}</span>
                        <Icon.arrow className="h-4 w-4 shrink-0 text-olive-600 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-8 text-base text-grey-600 sm:text-sm">
                  Not sure? Call <a href={`tel:${site.phone.tel}`} className="font-semibold text-olive-700 underline underline-offset-4">{site.phone.display}</a> and talk it through, or <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-olive-700 underline underline-offset-4">book online</a>.
                </p>
                </div>
              </div>
            </div>
            <noscript>
              <ul className="mt-6 space-y-2 text-sm">
                {s.options.flatMap((o) => o.links).map((l) => <li key={l.href + l.label}><a href={l.href} className="underline">{l.label}</a></li>)}
              </ul>
            </noscript>
          </div>
        </div>
      </Container>
    </Section>
  );
}
