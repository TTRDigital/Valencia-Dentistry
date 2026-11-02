// Not type-checked by the app build (tsconfig exclude): Playwright comes from the global install in the QA environment.
/**
 * Full-page screenshots at the five review widths.
 *   npm run screenshots -- [http://localhost:3000] [path ...]
 * Output: qa/screenshots/<page>-<width>.png (git-ignored). Also reports
 * horizontal overflow (document wider than the viewport) per page.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const pages = process.argv.slice(3).length ? process.argv.slice(3) : ["/", "/about/", "/services/", "/services/dental-implants/", "/category/blogs/", "/dental-implants-cost/", "/contact/", "/appointment/", "/new-patient-offer/", "/styleguide/"];
const widths = process.env.WIDTHS ? process.env.WIDTHS.split(",").map(Number) : [390, 768, 1024, 1440, 1920];
mkdirSync("qa/screenshots", { recursive: true });
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    // Scroll like a person (wheel events) so lazy images load, then wait until every image is decoded.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 500) { await page.mouse.wheel(0, 500); await page.waitForTimeout(120); }
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => Promise.all([...document.images].map((img) => (img.complete ? img.decode().catch(() => null) : new Promise((r) => { img.onload = img.onerror = r; setTimeout(r, 8000); })))));
    // Full-page captures skip repainting off-screen async-decoded images; decode them synchronously for the capture.
    await page.evaluate(() => { for (const img of document.images) { img.decoding = "sync"; img.style.backgroundImage = "none"; } });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const name = (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "__")) + `-${w}.png`;
    await page.screenshot({ path: `qa/screenshots/${name}`, fullPage: true });
    console.log(`${overflow > 0 ? "OVERFLOW " + overflow + "px" : "ok"}  ${w}  ${p}`);
  }
  await ctx.close();
}
await browser.close();
