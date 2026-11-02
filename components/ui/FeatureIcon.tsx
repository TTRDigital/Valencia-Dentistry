import { Icon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/** Icon in a soft tile, light or dark. */
export function FeatureIcon({ name, dark }: { name?: string; dark?: boolean }) {
  const I = (name && (Icon as Record<string, (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element>)[name]) || Icon.sparkle;
  return (
    <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl", dark ? "bg-white/10 text-bronze-300" : "bg-greige-50 text-olive-600")}>
      <I className="h-6 w-6" />
    </span>
  );
}
