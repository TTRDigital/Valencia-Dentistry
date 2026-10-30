/**
 * Launch checks on a running site (local or the Vercel preview):
 *
 *   npm run audit -- https://<deployment>
 *
 * For every URL in the sitemap plus the noindex pages and the 404 page:
 * status, doctype, <html lang>, <meta charset> first in <head>, exactly one
 * H1, title (≤60) and meta description (≤155) on indexable pages, canonical,
 * 1200×630 og:image that loads, valid JSON-LD (every @id reference resolves),
 * alt attributes on every image, and no internal link that redirects or 404s.
 * Also checks that the 56 URLs of the previous site answer 200, favicons,
 * robots.txt and the sitemap.
 */
import * as cheerio from "cheerio";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const ROOT = new URL("..", import.meta.url).pathname;
const problems: string[] = [];
const bad = (p: string, m: string) => problems.push(`${p}: ${m}`);
const get = (url: string, redirect: RequestRedirect = "manual") => fetch(url, { redirect, headers: { "User-Agent": "launch-audit" } });
const local = (u: string) => u.replace(/^https?:\/\/[^/]+/, BASE);

const sitemapXml = await (await get(`${BASE}/sitemap.xml`, "follow")).text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const extra = ["/thank-you/", "/styleguide/"];
const paths = [...new Set([...sitemapUrls, ...extra])];

const linkStatus = new Map<string, number>();
async function status(path: string) {
  if (!linkStatus.has(path)) linkStatus.set(path, (await get(BASE + path)).status);
  return linkStatus.get(path)!;
}

let checkedLinks = 0;
for (const path of paths) {
  const res = await get(BASE + path);
  if (res.status !== 200) { bad(path, `status ${res.status}`); continue; }
  const html = await res.text();
  const $ = cheerio.load(html);
  if (!/^\s*<!doctype html>/i.test(html)) bad(path, "no doctype");
  if ($("html").attr("lang") !== "en") bad(path, "<html lang> is not en");
  const first = $("head").children().first();
  if (first.attr("charset")?.toLowerCase() !== "utf-8") bad(path, "<meta charset> is not first in <head>");
  const robots = $('meta[name="robots"]').attr("content") || "";
  const indexable = !/noindex/.test(robots);
  if (sitemapUrls.includes(path) && !indexable) bad(path, "noindex page in sitemap");
  const h1 = $("h1");
  if (h1.length !== 1) bad(path, `${h1.length} H1s`);
  const title = $("title").text().trim();
  if (!title) bad(path, "no title");
  else if (indexable && title.length > 60) bad(path, `title is ${title.length} chars: ${title}`);
  const desc = $('meta[name="description"]').attr("content") || "";
  if (indexable && !desc) bad(path, "no meta description");
  else if (indexable && desc.length > 155) bad(path, `description is ${desc.length} chars`);
  if (indexable && !$('link[rel="canonical"]').attr("href")) bad(path, "no canonical");
  const og = $('meta[property="og:image"]').attr("content");
  if (indexable) {
    if (!og) bad(path, "no og:image");
    else {
      if ($('meta[property="og:image:width"]').attr("content") !== "1200" || $('meta[property="og:image:height"]').attr("content") !== "630") bad(path, "og:image is not declared 1200x630");
      const r = await get(local(og), "follow");
      if (!r.ok || !/image\//.test(r.headers.get("content-type") || "")) bad(path, `og:image ${og} answers ${r.status}`);
    }
  }
  const ld = $('script[type="application/ld+json"]');
  if (indexable && !ld.length) bad(path, "no JSON-LD");
  const ids = new Set<string>();
  const refs: string[] = [];
  ld.each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "");
      const nodes: Record<string, unknown>[] = json["@graph"] || [json];
      for (const n of nodes) {
        if (n["@id"]) ids.add(String(n["@id"]));
        const walk = (v: unknown) => {
          if (Array.isArray(v)) v.forEach(walk);
          else if (v && typeof v === "object") {
            const o = v as Record<string, unknown>;
            if (Object.keys(o).length === 1 && typeof o["@id"] === "string") refs.push(o["@id"]);
            else Object.values(o).forEach(walk);
          }
        };
        Object.values(n).forEach(walk);
      }
    } catch (e) {
      bad(path, `invalid JSON-LD: ${String(e).slice(0, 80)}`);
    }
  });
  for (const r of refs) if (!ids.has(r)) bad(path, `JSON-LD reference to missing node ${r}`);
  $("img").each((_, el) => {
    const alt = $(el).attr("alt");
    const src = $(el).attr("src") || "";
    if (alt == null) bad(path, `img without alt: ${src.slice(0, 80)}`);
  });
  for (const el of $("a[href]").toArray()) {
    const href = $(el).attr("href")!;
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/_next") || href.startsWith("/api/")) continue;
    const p = href.split("#")[0].split("?")[0];
    if (!p) continue;
    checkedLinks++;
    const s = await status(p);
    if (s !== 200) bad(path, `link ${href} answers ${s}`);
  }
}

// Every URL of the previous site must still answer 200 (or one 301 to a 200).
const old = readFileSync(join(ROOT, "docs/live-urls.txt"), "utf8").trim().split("\n").map((u) => new URL(u).pathname);
for (const p of old) {
  const r = await get(BASE + p);
  if (r.status === 200) continue;
  if (r.status === 301 || r.status === 308) {
    const loc = r.headers.get("location") || "";
    const r2 = await get(local(loc));
    if (r2.status !== 200) bad(p, `redirects to ${loc} which answers ${r2.status}`);
    continue;
  }
  bad(p, `old URL answers ${r.status}`);
}

for (const f of ["/favicon.ico", "/icon-32.png", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/site.webmanifest", "/robots.txt", "/sitemap.xml"]) {
  const r = await get(BASE + f, "follow");
  if (!r.ok) bad(f, `answers ${r.status}`);
}
const nf = await get(`${BASE}/this-page-does-not-exist-xyz/`);
if (nf.status !== 404) bad("/this-page-does-not-exist-xyz/", `answers ${nf.status} instead of 404`);

console.log(problems.join("\n") || "No problems found.");
console.log(`\nChecked ${paths.length} pages, ${checkedLinks} internal links (${linkStatus.size} unique), ${old.length} old URLs, sitemap ${sitemapUrls.length} URLs.`);
process.exitCode = problems.length ? 1 : 0;
