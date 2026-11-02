// Every image referenced by every page must load, and none may come from the removed
// stock/AI/placeholder folders.   node scripts/check-images.mjs [http://localhost:3000]
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const xml = await (await fetch(base + "/sitemap.xml")).text();
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).concat(["/thank-you/"]);
const seen = new Map(); const bad = []; const kinds = {};
for (const p of paths) {
  const html = (await (await fetch(base + p)).text()).replace(/&amp;/g, "&");
  const srcs = new Set([...html.matchAll(/(?:src|srcSet|srcset|imageSrcSet)="([^"]+)"/g)].flatMap((m) => m[1].split(",").map((s) => s.trim().split(" ")[0])).filter((s) => /^\/(images|_next\/image)/.test(s)));
  for (const s of srcs) {
    const local = s.startsWith("/_next/image") ? decodeURIComponent(new URL(base + s).searchParams.get("url")) : s;
    const k = local.split("/").slice(0, 3).join("/"); kinds[k] = (kinds[k] || 0) + 1;
    if (/\/images\/(stock|blog|brand)\//.test(local)) bad.push(`${p} uses ${local}`);
    if (!seen.has(s)) seen.set(s, (await fetch(base + s)).status);
    if (seen.get(s) !== 200) bad.push(`${p} broken ${s} ${seen.get(s)}`);
  }
}
console.log(`pages ${paths.length}, image URLs ${seen.size}, references by folder`, kinds);
console.log(bad.length ? bad.slice(0, 20).join("\n") : "All images load. No stock, AI or placeholder images.");
process.exitCode = bad.length ? 1 : 0;
