"use client";

import { useRef } from "react";
import type { Testimonial } from "@/lib/types";
import { Icon } from "@/components/ui/Icons";

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-400" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => <Icon.star key={i} className={`h-4 w-4 ${i < n ? "" : "opacity-25"}`} />)}
    </span>
  );
}

/** Scroll-snap carousel (native scrolling, keyboard and touch friendly) with prev/next buttons. */
export function ReviewCarousel({ items }: { items: Testimonial[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 20), behavior: "smooth" });
  };
  return (
    <div className="relative">
      <ul ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0" aria-label="Patient reviews">
        {items.map((t) => (
          <li key={t.id} className="card flex w-[85%] shrink-0 snap-start flex-col p-7 sm:w-[46%] lg:w-[31.5%]">
            <div className="flex items-center justify-between">
              <Stars n={t.rating} />
              <Icon.google className="h-5 w-5" />
            </div>
            <blockquote className="mt-4 flex-1 text-[0.98rem] leading-relaxed text-grey-700">“{t.text}”</blockquote>
            <footer className="mt-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-semibold text-steel-700" aria-hidden="true">{t.author.charAt(0)}</span>
              <div>
                <p className="font-semibold text-navy-900">{t.author}</p>
                <p className="text-xs text-grey-600">Google review{t.when ? ` · ${t.when}` : ""}</p>
              </div>
            </footer>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-2">
        <button type="button" onClick={() => scroll(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy-900 hover:bg-navy-900/5" aria-label="Previous reviews"><Icon.arrow className="h-5 w-5 rotate-180" /></button>
        <button type="button" onClick={() => scroll(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy-900 hover:bg-navy-900/5" aria-label="Next reviews"><Icon.arrow className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
