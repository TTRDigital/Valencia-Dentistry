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

