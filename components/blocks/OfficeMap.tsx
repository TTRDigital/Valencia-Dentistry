"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";

/**
 * Office map: a static, brand-tinted map (public/images/map, built by scripts/static-map.ts from
 * OpenStreetMap) shows immediately, with the pin at the office and a "Get directions" card.
 * The interactive Google map loads only when asked for, and fades in once it has loaded,
 * so there is never a "Map loading…" state and no third-party script on page load.
 */
export function OfficeMap({ className = "" }: { className?: string }) {
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`office-map relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-greige-50 ring-1 ring-ink-900/10 lg:aspect-auto lg:h-full lg:min-h-[460px] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/map/office-map-800.webp"
        srcSet="/images/map/office-map-800.webp 800w, /images/map/office-map-1600.webp 1600w"
        sizes="(min-width: 1024px) 1000px, 100vw"
        width={800}
        height={600}
        loading="lazy"
        decoding="async"
        alt={`Map: ${site.name} at ${site.address.street}, ${site.address.city}, beside Tourney Road near Magic Mountain Parkway and the I-5`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Pin at the office (the map image is centred on it) */}
      <span className="map-pin pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full" aria-hidden="true">
        <svg viewBox="0 0 32 42" className="h-11 w-auto drop-shadow-[0_6px_8px_rgba(0,0,0,0.25)]"><path d="M16 0C7.2 0 0 7 0 15.7 0 27.4 16 42 16 42s16-14.6 16-26.3C32 7 24.8 0 16 0Z" fill="#4a574a" /><circle cx="16" cy="15.5" r="6" fill="#fff" /></svg>
      </span>
      {live && (
        <iframe
          title={`Interactive map showing ${site.name} at ${site.address.street}, ${site.address.city}`}
          src={site.mapEmbedUrl}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-[var(--dur-std)] ${loaded ? "opacity-100" : "opacity-0"}`}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
      {!live && (
        <>
          <div data-reveal="" className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 p-4 shadow-lift backdrop-blur-sm sm:right-auto sm:max-w-[300px]">
            <p className="font-semibold text-ink-900">{site.name}</p>
            <p className="mt-0.5 text-sm text-grey-700">{site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}</p>
            <div className="mt-3 flex flex-wrap gap-x-4">
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow text-sm"><Icon.directions className="h-4 w-4" /> Get directions</a>
              <button type="button" onClick={() => setLive(true)} className="inline-flex min-h-11 items-center text-sm font-semibold text-grey-700 underline-offset-4 hover:text-ink-900 hover:underline">Interactive map</button>
            </div>
          </div>
          <p className="absolute right-0 top-0 rounded-bl-md bg-white/85 px-2 py-0.5 text-[0.6875rem] text-grey-700">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors</p>
        </>
      )}
    </div>
  );
}
