import Image, { type ImageProps } from "next/image";
import manifest from "@/lib/generated/images.json";
import type { SiteImage } from "@/lib/types";
import { cn } from "@/lib/utils";

type Manifest = Record<string, { width: number; height: number; blurDataURL: string; opt?: number[] }>;
const known = manifest as Manifest;

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height" | "placeholder" | "blurDataURL" | "loader"> & {
  image: SiteImage | string;
  alt?: string;
  /** When true, width/height come from the parent (object-cover). */
  fill?: boolean;
  /**
   * Aspect ratio (width / height) of the box the image is cropped into with object-fit: cover.
   * When the photo is wider than the box, cover scales it by box height, so the browser needs a
   * proportionally wider file than `sizes` alone suggests; the sizes are scaled up to match.
   */
  cropTo?: number;
};

/** Multiply every length in a sizes attribute (not the media conditions) by `f`. */
export function scaleSizes(sizes: string, f: number) {
  if (f <= 1.02) return sizes;
  return sizes.split(",").map((part) => {
    const i = part.lastIndexOf(")");
    const cond = i > -1 ? part.slice(0, i + 1) : "";
    const len = (i > -1 ? part.slice(i + 1) : part).trim();
    const m = len.match(/^(\d+(?:\.\d+)?)(px|vw)$/);
    return `${cond} ${m ? `${Math.round(Number(m[1]) * f)}${m[2]}` : len}`.trim();
  }).join(", ");
}

/**
 * next/image with dimensions and blur placeholders filled in from the
 * generated manifest (public/images) or from Sanity's image metadata.
 * Practice photos with pre-built WebP variants (scripts/images.ts) are
 * printed as a plain <img srcset> of static files, so the LCP hero never
 * waits for on-request optimization.
 */
export function Picture({ image, alt, fill, sizes: sizesIn, className, priority, quality, cropTo, ...rest }: Props) {
  const img: SiteImage = typeof image === "string" ? { src: image, alt: alt ?? "" } : image;
  const meta = known[img.src];
  const width = img.width ?? meta?.width;
  const height = img.height ?? meta?.height;
  const sizes = sizesIn && cropTo && width && height ? scaleSizes(sizesIn, width / height / cropTo) : sizesIn;
  const altText = alt ?? img.alt ?? "";
  // A content-defined focal point wins over the component's default object-position class
  if (img.focus) (rest as { style?: React.CSSProperties }).style = { ...(rest as { style?: React.CSSProperties }).style, objectPosition: img.focus };

  if (meta?.opt?.length) {
    const name = img.src.replace(/^.*\//, "").replace(/\.[a-z0-9]+$/i, "");
    const srcSet = meta.opt.map((w) => `/images/_opt/${name}-${w}.webp ${w}w`).join(", ");
    const largest = meta.opt[meta.opt.length - 1];
    const { style, ...imgRest } = rest as React.ImgHTMLAttributes<HTMLImageElement>;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/images/_opt/${name}-${largest}.webp`}
        srcSet={srcSet}
        sizes={sizes ?? (fill ? "100vw" : `${Math.min(largest, 1280)}px`)}
        alt={altText}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className={cn(fill && "absolute inset-0 h-full w-full", className)}
        style={style}
        {...imgRest}
      />
    );
  }

  // No blurred placeholders: frames show a calm neutral tone until the sharp image arrives.
  const common = { sizes: sizes ?? (fill ? "100vw" : undefined), className, priority, quality: quality ?? 85, ...rest };
  if (fill || !width || !height) return <Image src={img.src} alt={altText} fill {...common} />;
  return <Image src={img.src} alt={altText} width={width} height={height} {...common} />;
}
