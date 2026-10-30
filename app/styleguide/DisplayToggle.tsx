"use client";

import { useSyncExternalStore } from "react";

type Face = "fraunces" | "calsans";
const EVENT = "displayface";

function read(): Face {
  return document.documentElement.dataset.display === "calsans" ? "calsans" : "fraunces";
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
function apply(f: Face) {
  if (f === "calsans") document.documentElement.dataset.display = "calsans";
  else delete document.documentElement.dataset.display;
  window.dispatchEvent(new Event(EVENT));
}

/** Switches the display face for this browser session only (data-display on <html>). */
export function DisplayToggle() {
  const face = useSyncExternalStore(subscribe, read, () => "fraunces" as Face);
  return (
    <div className="mt-8 inline-flex rounded-full border hairline bg-white p-1" role="group" aria-label="Display typeface">
      {(["fraunces", "calsans"] as const).map((f) => (
        <button key={f} type="button" onClick={() => apply(f)} aria-pressed={face === f} className={`min-h-11 rounded-full px-5 text-sm font-semibold ${face === f ? "bg-ink-900 text-white" : "text-ink-900 hover:bg-ink-900/5"}`}>
          {f === "fraunces" ? "Option A · Fraunces + Inter" : "Option B · Cal Sans + Inter"}
        </button>
      ))}
    </div>
  );
}
