export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)) + "…";
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/** A service name as it reads mid-sentence: lowercase, but brand names and acronyms keep their case. */
/** Photos that show the same scene ("implant-model" and "implant-model-2", "denture-consult" and "consult-denture") share a key. */
export const sceneKey = (src: string) => src.replace(/^.*\//, "").replace(/\.[a-z]+$/i, "").replace(/-\d+$/, "").split("-").sort().join("-");

/**
 * One photo per item, never repeating a scene within the set: each item takes its first photo
 * whose scene is not already used, falling back to its first photo.
 */
export function distinctPhotos<T>(items: T[], photosOf: (item: T) => { src: string; alt: string }[], avoid: string[] = []) {
  const used = new Set<string>(avoid.map(sceneKey));
  return items.map((it) => {
    const list = photosOf(it);
    const pick = list.find((p) => !used.has(sceneKey(p.src))) ?? list[0];
    if (pick) used.add(sceneKey(pick.src));
    return pick;
  });
}

export const inSentence = (name: string) => name.split(" ").map((w) => (/^(TMJ|Invisalign|All-on-4)$/.test(w) ? w : w.toLowerCase())).join(" ");

// Literal class names so Tailwind generates them.
const WIDE_COLS: Record<string, string> = { "lg:1": "lg:grid-cols-1", "lg:2": "lg:grid-cols-2", "lg:3": "lg:grid-cols-3", "lg:4": "lg:grid-cols-4", "xl:1": "xl:grid-cols-1", "xl:2": "xl:grid-cols-2", "xl:3": "xl:grid-cols-3", "xl:4": "xl:grid-cols-4" };
const UNSPAN: Record<string, string> = { lg: "lg:col-span-1", xl: "xl:col-span-1" };

/**
 * Column plan for a set of n cards (2 columns on small screens, up to `wideCols` from `wideAt`)
 * so that no card is ever left alone on the last row. With an odd count the first card is
 * "featured" and spans two columns; on wide screens a set that fits one row stays one row.
 */
export function cardGrid(n: number, wideCols: 3 | 4 = 3, wideAt: "lg" | "xl" = "xl") {
  const featured = n % 2 === 1;
  const slots = featured ? n + 1 : n;
  let wide = "";
  let unspan = false;
  if (n > 1 && n <= wideCols) { wide = WIDE_COLS[`${wideAt}:${n}`]; unspan = featured; }
  else if (slots % wideCols === 0) wide = WIDE_COLS[`${wideAt}:${wideCols}`];
  return { ul: cn("grid grid-cols-2", wide), featured, first: featured ? cn("col-span-2", unspan && UNSPAN[wideAt]) : "", unspanAt: unspan ? wideAt : null };
}
