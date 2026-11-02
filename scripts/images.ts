/**
 * Image manifest + pre-optimized hero variants.
 *
 * 1. Scans public/images and writes lib/generated/images.json with width,
 *    height and a tiny blur placeholder for every image, so next/image gets
 *    exact dimensions and placeholder="blur" for images referenced by path.
 * 2. For the photos used as page heroes (public/images/team and /real) it also
 *    writes static WebP variants to public/images/_opt/<name>-<width>.webp.
 *    Hero images are the LCP element, and serving a pre-built file (instead
 *    of optimizing on the first request for each size) keeps LCP low.
 *
 *   npm run images
 */
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const DIR = join(ROOT, "public/images");
const OPT = join(DIR, "_opt");
const WIDTHS = [480, 768, 1080, 1440];
const out: Record<string, { width: number; height: number; blurDataURL: string; opt?: number[] }> = {};
mkdirSync(OPT, { recursive: true });

async function walk(dir: string) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (basename(p) !== "_opt") await walk(p); continue; }
    if (!/\.(png|jpe?g|webp|avif)$/i.test(f)) continue;
    const img = sharp(p);
    const meta = await img.metadata();
    const blur = await img.clone().resize(12, 12, { fit: "inside" }).blur(1).toFormat("webp", { quality: 40 }).toBuffer();
    const key = "/" + relative(join(ROOT, "public"), p).replace(/\\/g, "/");
    const entry: (typeof out)[string] = { width: meta.width!, height: meta.height!, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` };
    if (dir.endsWith("/team") || dir.endsWith("/real")) {
      const name = basename(f, extname(f));
      const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width!), meta.width!])];
      for (const w of widths) await sharp(p).resize(w).webp({ quality: 74, alphaQuality: 80 }).toFile(join(OPT, `${name}-${w}.webp`));
      entry.opt = widths;
    }
    out[key] = entry;
  }
}
await walk(DIR);
writeFileSync(join(ROOT, "lib/generated/images.json"), JSON.stringify(out, null, 1));
console.log(`${Object.keys(out).length} images → lib/generated/images.json; ${readdirSync(OPT).length} hero variants in public/images/_opt`);
