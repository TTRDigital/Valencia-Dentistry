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
const widths = [390, 768, 1024, 1440, 1920];
mkdirSync("qa/screenshots", { recursive: true });
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const name = (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "__")) + `-${w}.png`;
    await page.screenshot({ path: `qa/screenshots/${name}`, fullPage: true });
    console.log(`${overflow > 0 ? "OVERFLOW " + overflow + "px" : "ok"}  ${w}  ${p}`);
  }
  await ctx.close();
}
await browser.close();
