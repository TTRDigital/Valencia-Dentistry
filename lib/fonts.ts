import localFont from "next/font/local";

/**
 * Self-hosted fonts (OFL licenses in app/fonts). Inter (body) and Fraunces
 * (display, option A) are preloaded through next/font. Cal Sans (option B) is
 * declared in globals.css as a plain @font-face (public/fonts), so the browser
 * only downloads it when the display face is switched to it (lib/design.ts).
 */
export const inter = localFont({
  src: "../app/fonts/inter-wght-latin.woff2", // Inter variable (wght axis), Latin subset built with fontTools
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

/**
 * Fraunces as a single static instance (weight 500, optical size 144, Latin
 * subset, ~17kB) built from the variable font with fontTools. display:
 * "optional" keeps the first paint as the LCP: the browser waits ~100ms for
 * the preloaded file, uses the metrics-matched fallback if it is slower, and
 * has it cached for every page after. Change to "swap" if the brand font must
 * always show on the very first slow-network visit.
 */
export const fraunces = localFont({
  src: "../app/fonts/fraunces-500-opsz144-latin.woff2",
  variable: "--font-fraunces",
  weight: "500",
  display: "optional",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});
