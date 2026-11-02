"use client";

import { useEffect, useState, type ReactNode } from "react";

let firstLoad = true;

/**
 * Subtle fade between routes (app/template.tsx re-mounts this on every navigation).
 * The first page load is never animated, so the LCP and the hero are not delayed;
 * only client-side navigations after it fade in (opacity only, --dur-std).
 * Reduced motion: the global rule in globals.css makes the animation instant.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const [animate] = useState(() => !firstLoad);
  useEffect(() => { firstLoad = false; }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
