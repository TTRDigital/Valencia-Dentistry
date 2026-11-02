import type { ReactNode } from "react";
import manifest from "@/lib/generated/images.json";
import type { SiteImage } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils";

const known = manifest as Record<string, { width: number; height: number }>;

/** Width / height of a photo (from the image manifest), so frames can match it and nothing is cropped. */
export function ratioOf(image: SiteImage): number {
  const m = known[image.src];
  const w = image.width ?? m?.width;
  const h = image.height ?? m?.height;
  return w && h ? w / h : 1.5;
}

type Accent = "olive" | "sand" | "ink" | "none";
const ACCENT: Record<Accent, string> = {
  olive: "bg-olive-600/90",
  sand: "bg-sand-100",
  ink: "bg-ink-900",
  none: "",
};

/**
 * A photo in a frame that has the photo's own proportions (3:2 or 2:3), so heads are never cut off.
 * Portrait photos can sit in the brand arch. Optional: a coloured block offset behind the photo
 * for depth, and floating badge cards (children) positioned by the caller.
 */
export function PhotoFrame({
  image,
  sizes,
  priority,
  arch,
  accent = "none",
  accentSide = "right",
  className,
  frameClassName,
  children,
}: {
  image: SiteImage;
  sizes: string;
  priority?: boolean;
  arch?: boolean;
  accent?: Accent;
  accentSide?: "left" | "right";
  className?: string;
  frameClassName?: string;
  children?: ReactNode;
}) {
  const ratio = ratioOf(image);
  return (
    <div data-reveal={priority ? undefined : ""} className={cn("photo-reveal relative", className)}>
      {accent !== "none" && (
        <div
          aria-hidden="true"
          className={cn("absolute inset-0 rounded-lg", arch && ratio < 1 && "arch", ACCENT[accent], accentSide === "right" ? "translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6" : "-translate-x-4 translate-y-4 sm:-translate-x-6 sm:translate-y-6")}
        />
      )}
      <div className={cn("relative overflow-hidden bg-greige-50", arch && ratio < 1 ? "arch" : "rounded-lg", frameClassName)} style={{ aspectRatio: String(ratio) }}>
        <Picture image={image} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
      {children}
    </div>
  );
}

/** Small white card that floats over a photo: an icon, a strong line and a quiet line. */
export function FloatingBadge({ icon, title, text, className }: { icon?: ReactNode; title: ReactNode; text?: ReactNode; className?: string }) {
  return (
    <div className={cn("absolute z-10 flex items-center gap-3 rounded-lg bg-white/95 px-4 py-3 shadow-lift ring-1 ring-ink-900/5 backdrop-blur-sm", className)}>
      {icon && <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-olive-100 text-olive-700">{icon}</span>}
      <span className="leading-tight">
        <span className="block font-semibold text-ink-900">{title}</span>
        {text && <span className="mt-0.5 block text-sm text-grey-700">{text}</span>}
      </span>
    </div>
  );
}

/**
 * Two photos layered: a large one and a smaller one overlapping its lower corner with a white border.
 * Both keep their own proportions, so nothing is cropped.
 */
export function PhotoCollage({ main, second, sizes = "(min-width: 1024px) 560px, 100vw", flip, children, className }: { main: SiteImage; second?: SiteImage; sizes?: string; flip?: boolean; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("relative isolate pb-16 sm:pb-20", className)}>
      {/* portrait photos get a narrower frame so the collage keeps a sensible height */}
      <div className={cn("relative", ratioOf(main) < 1 ? "w-[62%]" : "w-[86%]", flip ? "ml-auto" : "")}>
        <PhotoFrame image={main} sizes={sizes} />
      </div>
      {second && (
        <div className={cn("absolute bottom-0 rounded-lg bg-white p-1.5 shadow-lift sm:p-2", ratioOf(second) < 1 ? "w-[34%]" : "w-[52%]", flip ? "left-0" : "right-0")}>
          <PhotoFrame image={second} sizes="(min-width: 1024px) 280px, 50vw" frameClassName="rounded-md" />
        </div>
      )}
      <div aria-hidden="true" className={cn("dot-grid absolute -z-10 h-32 w-32 sm:h-40 sm:w-40", flip ? "-right-4 top-6" : "-left-4 top-6")} />
      {children}
    </div>
  );
}
