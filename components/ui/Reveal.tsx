import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marks an element for the scroll reveal (fade + 16px rise) handled by
 * components/motion/RevealObserver.tsx. `delay` staggers items within a
 * group (e.g. index × 70ms). Server-rendered; visible without JavaScript.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article" | "section" }) {
  return (
    <Tag data-reveal="" className={cn(className)} style={delay ? ({ "--reveal-delay": `${Math.min(delay, 400)}ms` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
