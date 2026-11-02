import localFont from "next/font/local";

/**
 * Urbanist (OFL, app/fonts) for headings and body, the typeface of the Ideal
 * Dental Solutions design the client asked to follow. Variable weight axis,
 * Latin subset, self-hosted and preloaded by next/font.
 */
export const urbanist = localFont({
  src: "../app/fonts/urbanist-latin-wght.woff2",
  variable: "--font-urbanist",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

/**
 * Fraunces (OFL, app/fonts) for display headings: a soft, high-contrast serif that gives
 * headlines a premium, editorial voice next to Urbanist body text. Variable weight, roman + italic.
 */
export const fraunces = localFont({
  src: [
    { path: "../app/fonts/fraunces-latin-wght.woff2", style: "normal" },
    { path: "../app/fonts/fraunces-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});
