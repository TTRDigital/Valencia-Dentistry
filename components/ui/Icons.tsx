import type { SVGProps } from "react";

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true };

export const Icon = {
  phone: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>,
  calendar: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  pin: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>,
  mail: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></svg>,
  clock: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  star: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...p}><path d="M10 1.6l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 15l-5.3 2.8 1.1-5.9L1.5 7.8l5.9-.8z" /></svg>,
  check: (p: SVGProps<SVGSVGElement>) => <svg {...base} strokeWidth={2} {...p}><path d="m5 12 4.5 4.5L19 7" /></svg>,
  chevron: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>,
  arrow: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M4 12h16m0 0-6-6m6 6-6 6" /></svg>,
  close: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>,
  menu: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>,
  shield: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></svg>,
  user: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
  tech: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4M7 10h4M7 13h7" /></svg>,
  tooth: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M7.5 3C5 3 3.5 5 3.5 7.5c0 2 1 3.2 1.4 5 .5 2.5.8 8.5 2.6 8.5 1.5 0 1.6-4 2.5-5.5.5-.8 1-1 2-1s1.5.2 2 1c.9 1.5 1 5.5 2.5 5.5 1.8 0 2.1-6 2.6-8.5.4-1.8 1.4-3 1.4-5C20.5 5 19 3 16.5 3c-2 0-3 1-4.5 1S9.5 3 7.5 3z" /></svg>,
  sparkle: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8" /></svg>,
  heart: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>,
  tag: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M3 12V4h8l9 9-8 8z" /><circle cx="7.5" cy="8.5" r="1.5" /></svg>,
  bolt: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>,
  leaf: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M4 20c0-9 6-15 16-16-1 10-7 16-16 16z" /><path d="M4 20c4-5 8-8 12-10" /></svg>,
  smile: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01" /></svg>,
  directions: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><path d="M12 3 3 12l9 9 9-9z" /><path d="M9.5 13v-2.5h4l-1.5-1.5m1.5 1.5-1.5 1.5" /></svg>,
  search: (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>,
  quote: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M7.2 6C4.6 6 3 8 3 10.6c0 2.1 1.4 3.6 3.4 3.6.4 0 .7 0 1-.1-.5 1.6-1.9 2.6-3.6 3L4.5 19C8.7 18.3 11 15.5 11 11.4 11 8.2 9.5 6 7.2 6zm10 0C14.6 6 13 8 13 10.6c0 2.1 1.4 3.6 3.4 3.6.4 0 .7 0 1-.1-.5 1.6-1.9 2.6-3.6 3l.7 1.9c4.2-.7 6.5-3.5 6.5-7.6C21 8.2 19.5 6 17.2 6z" /></svg>,
  google: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" aria-hidden="true" {...p}><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z" /><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" /><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z" /><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5L6.4 10c.8-2.3 3-4.1 5.6-4.1z" /></svg>,
  facebook: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.4V5.1c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7z" /></svg>,
  instagram: (p: SVGProps<SVGSVGElement>) => <svg {...base} strokeWidth={1.8} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" /></svg>,
  linkedin: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M6.5 8.5H3.6V20h2.9zM5 3.8a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20.4 13c0-3.2-1.7-4.7-4-4.7-1.8 0-2.7 1-3.1 1.7V8.5h-2.9V20h2.9v-5.7c0-1.5.3-3 2.2-3 1.8 0 1.9 1.7 1.9 3.1V20h2.9z" /></svg>,
  x: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.6L4.6 21h-3l7.5-8.6L1.3 3h6.6l4.5 6z" /></svg>,
};

export type IconName = keyof typeof Icon;
