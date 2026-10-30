/**
 * Publishes the built-in content (content/) to Sanity as documents with the
 * same shape the site reads back (lib/content/sanity.ts).
 *
 *   SANITY_WRITE_TOKEN=... npm run seed              # adds missing documents only
 *   SANITY_WRITE_TOKEN=... npm run seed -- --force   # overwrites (editors' changes are lost)
 *   npm run seed -- --dry-run                        # validates and prints a summary
 *
 * Writes go through the global API host (api.sanity.io/.../projects/<id>/...).
 * Photos stay in /public and are referenced by path (hero.image, post.image,
 * siteImage.src); editors can upload a replacement in /cms, which takes
 * precedence (the `photo` field on services and posts, `asset` on images).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { markdownToPortableText } from "../lib/portable.ts";
import { dataset, projectId, sanityConfigured } from "../sanity/env.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const C = join(ROOT, "content");
const token = process.env.SANITY_WRITE_TOKEN;
const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

if (!sanityConfigured) {
  console.error("Pin the Sanity project ID in sanity/env.ts first (it is still PROJECT_ID_PENDING).");
  if (!dryRun) process.exit(1);
}
if (!token && !dryRun) {
  console.error("Set SANITY_WRITE_TOKEN (an Editor token from sanity.io/manage > API > Tokens).");
  process.exit(1);
}

const readDir = (d: string) => readdirSync(join(C, d)).filter((f) => f.endsWith(".json") && !f.startsWith("_")).map((f) => JSON.parse(readFileSync(join(C, d, f), "utf8")));
const readJson = (f: string) => JSON.parse(readFileSync(join(C, f), "utf8"));
const id = (type: string, slug: string) => `${type}.${slug.replace(/[^a-z0-9-]/gi, "-")}`;

const docs: Record<string, unknown>[] = [];
for (const s of readDir("services")) docs.push({ _id: id("service", s.slug), _type: "service", ...s });
for (const p of readDir("posts")) docs.push({ _id: id("post", p.slug), _type: "post", ...p, body: markdownToPortableText(p.body) });
for (const p of readDir("pages")) docs.push({ _id: id("page", p.slug), _type: "page", ...p, sections: p.sections.map((sec: Record<string, unknown>, i: number) => ({ _key: `s${i}`, ...sec })) });
for (const l of readDir("legal")) docs.push({ _id: id("legalPage", l.slug), _type: "legalPage", ...l });
readJson("people.json").forEach((p: Record<string, unknown>, i: number) => docs.push({ _id: id("person", p.slug as string), _type: "person", order: i, ...p }));
readJson("testimonials.json").forEach((t: Record<string, unknown>, i: number) => docs.push({ _id: id("testimonial", t.id as string), _type: "testimonial", order: i, ...t }));
readJson("cases.json").forEach((c: Record<string, unknown>, i: number) => docs.push({ _id: id("beforeAfterCase", c.id as string), _type: "beforeAfterCase", order: i, ...c }));
docs.push({ _id: "navigation", _type: "navigation", ...readJson("navigation.json") });

// Arrays of objects need _key for the Studio.
function keyed(v: unknown, path = ""): unknown {
  if (Array.isArray(v)) return v.map((x, i) => (x && typeof x === "object" && !Array.isArray(x) ? { _key: (x as { _key?: string })._key ?? `k${i}`, ...(keyed(x, path) as object) } : keyed(x, path)));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, keyed(x, k)]));
  return v;
}
const ready = docs.map((d) => keyed(d) as Record<string, unknown>);

console.log(`${ready.length} documents: ${Object.entries(ready.reduce<Record<string, number>>((a, d) => ((a[d._type as string] = (a[d._type as string] || 0) + 1), a), {})).map(([k, v]) => `${v} ${k}`).join(", ")}`);
if (dryRun && !token) process.exit(0);

const url = `https://api.sanity.io/v2024-01-01/projects/${projectId}/datasets/${dataset}/mutate${dryRun ? "?dryRun=true" : ""}`;
const batches: unknown[][] = [];
let cur: unknown[] = [];
let size = 0;
for (const doc of ready) {
  const m = force ? { createOrReplace: doc } : { createIfNotExists: doc };
  const s = JSON.stringify(m).length;
  if (cur.length && size + s > 1_500_000) { batches.push(cur); cur = []; size = 0; }
  cur.push(m); size += s;
}
if (cur.length) batches.push(cur);
let n = 0;
for (const mutations of batches) {
  const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ mutations }) });
  if (!res.ok) { console.error(`Sanity answered ${res.status}: ${(await res.text()).slice(0, 500)}`); process.exit(1); }
  n += mutations.length;
  console.log(`${dryRun ? "checked" : force ? "wrote" : "added (if missing)"} ${n}/${ready.length}`);
}
console.log(`Done: ${ready.length} documents sent to ${projectId}/${dataset}.`);
