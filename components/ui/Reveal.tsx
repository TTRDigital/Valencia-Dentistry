import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade/slide-in on scroll, done entirely in CSS with scroll-driven
 * animations (animation-timeline: view()). Browsers without support simply
 * show the content; prefers-reduced-motion disables it. No JavaScript, so it
 * adds nothing to hydration. See `.reveal` in app/globals.css.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article" | "section" }) {
  return (
    <Tag className={cn("reveal", className)} style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
