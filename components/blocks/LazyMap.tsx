"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/** The Google Maps iframe loads only when scrolled near (saves ~1MB on first load). */
export function LazyMap({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setLoad(true); return; }
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setLoad(true); io.disconnect(); } }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`relative aspect-[4/3] w-full overflow-hidden rounded-4xl bg-greige-50 shadow-soft ring-1 ring-ink-900/5 lg:aspect-auto lg:h-full lg:min-h-[420px] ${className}`}>
      {load ? (
        <iframe title={`Map showing ${site.name} at ${site.address.street}, ${site.address.city}`} src={site.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-sm text-grey-600"><span>Map loading…</span><a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-olive-600 underline-offset-4 hover:underline">Open in Google Maps</a></div>
      )}
    </div>
  );
}
