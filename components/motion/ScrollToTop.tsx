"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Every page opens at its start:
 * - on a route change (link click) the window jumps to the top instantly, never smooth-scrolling
 *   from the previous page's position (links to an #anchor are left alone);
 * - on a reload the browser's restored mid-page position is replaced by the top.
 * Back/forward navigation keeps the browser's own scroll restoration.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "reload" && !location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
