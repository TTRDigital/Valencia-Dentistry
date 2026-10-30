import { cn } from "@/lib/utils";

/**
 * Placeholder wordmark until the new SVG logo arrives (swap this component's
 * markup for the supplied SVG; keep the accessible name). The old logo is
 * deliberately not used.
 */
export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <circle cx="20" cy="20" r="19" className={inverted ? "fill-white/10" : "fill-sky-50"} />
        <path d="M13 11.5c-2.6 0-4.3 2-4.3 4.6 0 2 1 3.3 1.4 5.2.5 2.6.8 8.2 2.6 8.2 1.5 0 1.6-3.9 2.5-5.4.5-.8 1-1 2-1s1.5.2 2 1c.9 1.5 1 5.4 2.5 5.4 1.8 0 2.1-5.6 2.6-8.2.4-1.9 1.4-3.2 1.4-5.2 0-2.6-1.7-4.6-4.3-4.6-2 0-3 1-4.5 1s-2.5-1-4.5-1z" className={inverted ? "fill-champagne-300" : "fill-steel-600"} />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[1.05rem] tracking-[0.02em]", inverted ? "text-white" : "text-navy-900")}>Valencia</span>
        <span className={cn("mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.26em]", inverted ? "text-champagne-300" : "text-steel-600")}>Smile Expert</span>
      </span>
    </span>
  );
}
