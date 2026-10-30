"use client";

import { useEffect, useState } from "react";
import { openState, type OpenState } from "@/lib/hours";
import { cn } from "@/lib/utils";

/** Live "Open now / Closed now" badge; renders neutral text until hydrated so it never shows a wrong state in static HTML. */
export function OpenBadge({ className, showNext }: { className?: string; showNext?: boolean }) {
  const [state, setState] = useState<OpenState | null>(null);
  useEffect(() => {
    const tick = () => setState(openState());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)} aria-live="polite">
      <span className={cn("inline-block h-2.5 w-2.5 rounded-full", state ? (state.open ? "bg-emerald-400" : "bg-grey-400") : "bg-grey-300")} aria-hidden="true" />
      <span className="font-semibold">{state ? state.label : "Hours"}</span>
      {showNext && state?.next && <span className="opacity-70">· {state.next}</span>}
    </span>
  );
}
