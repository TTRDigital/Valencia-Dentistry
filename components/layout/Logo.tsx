import { cn } from "@/lib/utils";
import { MARK, WORD } from "./logo-paths";

/**
 * Valencia Dentistry lockup: the V + tooth mark with the VALENCIA / DENTISTRY
 * wordmark (vector paths in logo-paths.ts; master files in public/brand).
 * `inverted` renders the V and wordmark in white on dark surfaces; the tooth
 * and "DENTISTRY" stay bronze in both.
 */
export function Logo({ className, inverted, markOnly }: { className?: string; inverted?: boolean; markOnly?: boolean }) {
  const ink = inverted ? "#FFFFFF" : "#2E2E2E";
  const bronze = inverted ? "#C9BA9C" : "#9A8B72";
  const bronzeText = inverted ? "#C9BA9C" : "#7A6B52";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg viewBox={`0 0 ${MARK.width} ${MARK.height}`} className="h-10 w-auto shrink-0" aria-hidden="true" focusable="false">
        <path fill={ink} d={MARK.v} />
        <path fill={bronze} d={MARK.tooth} />
      </svg>
      {!markOnly && (
        <svg viewBox={`0 0 ${WORD.width} ${WORD.height}`} className="h-[1.55rem] w-auto" role="img" aria-label="Valencia Dentistry">
          <path fill={ink} d={WORD.valencia} />
          <path fill={bronzeText} d={WORD.dentistry} />
        </svg>
      )}
    </span>
  );
}
