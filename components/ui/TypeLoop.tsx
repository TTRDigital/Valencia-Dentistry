"use client";

import { useEffect, useState } from "react";

/**
 * Types a line out letter by letter, holds it, clears it and types it again (like the
 * Agoura Hills banner). Screen readers get the full text once; under reduced motion it is static.
 */
export function TypeLoop({ text, className }: { text: string; className?: string }) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0; // first tick sets 0, so the line starts empty
    let t: number;
    const step = () => {
      if (i <= text.length) { setN(i); i += 1; t = window.setTimeout(step, 70); }
      else { t = window.setTimeout(() => { i = 0; setN(0); t = window.setTimeout(step, 500); }, 3000); }
    };
    t = window.setTimeout(step, 400);
    return () => window.clearTimeout(t);
  }, [text]);
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {/* the full line reserves its space, so the banner never jumps while typing */}
      <span aria-hidden="true" className="relative inline-block">
        <span className="invisible">{text}|</span>
        <span className="absolute inset-0">{text.slice(0, n)}<span className="type-caret">|</span></span>
      </span>
    </span>
  );
}
