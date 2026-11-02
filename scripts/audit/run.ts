// Visual + layout audit for every route at seven widths.
//   npm run audit:visual -- [--base http://localhost:3000] [--phase before|after] [--routes /,/about/] [--widths 375,1440] [--no-shots] [--merge]
// Output:
//   audit/screenshots/<route>/<width>.png          (phase "before")
//   audit/after/screenshots/<route>/<width>.png    (phase "after")
//   audit/data/<phase>.json                        (all measurements; read by report.ts)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const arg = (name: string, def?: string) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : def; };
const BASE = (arg("base", "http://localhost:3000") as string).replace(/\/$/, "");
const PHASE = arg("phase", "before") as string;
const WIDTHS = (arg("widths", "375,414,768,1024,1280,1440,1920") as string).split(",").map(Number);
const SHOTS = !process.argv.includes("--no-shots");
const CONCURRENCY = Number(arg("concurrency", "4"));
const ROOT = join(dirname(new URL(import.meta.url).pathname), "../..");
const SHOT_DIR = join(ROOT, "audit", PHASE === "before" ? "screenshots" : "after/screenshots");
const MEASURE = readFileSync(join(dirname(new URL(import.meta.url).pathname), "measure.js"), "utf8");
const AXE = readFileSync(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");

async function routes(): Promise<string[]> {
  const given = arg("routes");
  if (given) return given.split(",");
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const list = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  // pages that are linked but not in the sitemap
  list.push("/sitemap/", "/category/blogs/page/2/");
  return [...new Set(list)];
}
const routeDir = (r: string) => (r === "/" ? "home" : r.replace(/^\/|\/$/g, ""));

type Issue = { check: string; severity: string; where: string; detail: string; selector: string; route?: string; width?: number };
type Result = { route: string; width: number; issues: Issue[]; sections: unknown[]; stats: Record<string, unknown>; console: string[]; failed: string[]; shot?: string };

async function settle(page: Page) {
  // Scroll like a person so lazy images and scroll-triggered content load.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) { await page.mouse.wheel(0, 450); await page.waitForTimeout(90); }
  await page.waitForTimeout(500);
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => Promise.all([...document.images].map((img) => (img.complete ? img.decode().catch(() => null) : new Promise((r) => { img.onload = img.onerror = r; setTimeout(r, 6000); })))));
  await page.waitForTimeout(700); // let reveals and count-ups finish
}

/** Header, mega menu, mobile menu, mobile action bar and footer. */
async function chromeChecks(page: Page, width: number): Promise<Issue[]> {
  const out: Issue[] = [];
  const add = (check: string, severity: string, where: string, detail: string) => out.push({ check, severity, where, detail, selector: "" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const top = await page.evaluate(() => {
    const h = document.querySelector("header")!.getBoundingClientRect();
    const first = document.querySelector("main h1");
    const f = first?.getBoundingClientRect();
    return { hb: h.bottom, h: h.height, firstTop: f ? f.top : null };
  });
  if (top.firstTop !== null && top.firstTop < top.hb) add("header-overlap", "High", "Header", `page H1 starts ${Math.round(top.hb - top.firstTop)}px under the fixed header`);
  // z-index: after scrolling, the header must be on top of content at its centre
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(400);
  const onTop = await page.evaluate(() => { const h = document.querySelector("header")!; const r = h.getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!el && h.contains(el); });
  if (!onTop) add("header-z", "High", "Header", "content paints over the header after scrolling");

  if (width >= 1024) {
    const trigger = page.locator("header button[aria-controls]").first();
    if (await trigger.count()) {
      await trigger.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(350);
      const id = await trigger.getAttribute("aria-controls");
      const st = await page.evaluate((id) => { const m = document.getElementById(id!); if (!m) return null; const r = m.getBoundingClientRect(); const cs = getComputedStyle(m); return { vis: cs.visibility !== "hidden" && cs.opacity !== "0" && r.height > 0, l: r.left, r: r.right, b: r.bottom, vw: innerWidth, vh: innerHeight }; }, id);
      if (!st?.vis) add("mega-open", "High", "Mega menu", "does not open from the keyboard (Enter on Services)");
      else {
        if (st.l < 0 || st.r > st.vw + 1) add("mega-overflow", "High", "Mega menu", `panel runs off-screen (${Math.round(st.l)}–${Math.round(st.r)}px)`);
        if (st.b > st.vh) add("mega-height", "Medium", "Mega menu", `panel is taller than the viewport (${Math.round(st.b)}px)`);
        await page.keyboard.press("Escape");
        await page.waitForTimeout(350);
        const closed = await page.evaluate((id) => { const m = document.getElementById(id!)!; const cs = getComputedStyle(m); return cs.visibility === "hidden" || cs.opacity === "0" || m.getBoundingClientRect().height === 0; }, id);
        if (!closed) add("mega-escape", "High", "Mega menu", "Escape does not close it");
        const back = await page.evaluate(() => document.activeElement?.getAttribute("aria-controls"));
        if (back !== id) add("mega-focus", "Medium", "Mega menu", "focus does not return to the Services button after Escape");
      }
    }
  } else {
    const btn = page.locator('header button[aria-controls="mobile-menu"]');
    if (await btn.count()) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await btn.click();
      await page.waitForTimeout(350);
      const st = await page.evaluate(() => { const m = document.getElementById("mobile-menu")!; const cs = getComputedStyle(m); const r = m.getBoundingClientRect(); return { vis: cs.visibility !== "hidden" && cs.opacity !== "0", w: r.width, links: m.querySelectorAll("a").length, sw: document.documentElement.scrollWidth, vw: innerWidth }; });
      if (!st.vis) add("mobile-menu", "Critical", "Mobile menu", "does not open");
      if (st.sw > st.vw + 1) add("mobile-menu", "High", "Mobile menu", "opening the menu causes horizontal scroll");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(350);
      const closed = await page.evaluate(() => getComputedStyle(document.getElementById("mobile-menu")!).visibility === "hidden");
      if (!closed) add("mobile-menu", "High", "Mobile menu", "Escape does not close it");
    }
    // Mobile action bar must not cover the end of the footer
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(600);
    const bar = await page.evaluate(() => {
      const b = document.querySelector(".mobile-bar"); if (!b) return null;
      const r = b.getBoundingClientRect(); const cs = getComputedStyle(b);
      if (cs.display === "none" || cs.visibility === "hidden") return null;
      const items = [...document.querySelectorAll("footer a, footer p")].filter((e) => e.getBoundingClientRect().height > 0);
      const last = Math.max(...items.map((e) => e.getBoundingClientRect().bottom));
      return { top: r.top, last, shown: b.hasAttribute("data-show") };
    });
    if (bar && bar.shown && bar.last > bar.top + 1) add("mobile-bar-covers", "High", "Mobile action bar", `covers the last ${Math.round(bar.last - bar.top)}px of the footer at the bottom of the page`);
    if (bar && !bar.shown) add("mobile-bar", "Medium", "Mobile action bar", "not shown after scrolling past the hero");
  }
  return out;
}

async function focusCheck(page: Page): Promise<Issue[]> {
  await page.evaluate(() => { window.scrollTo(0, 0); (document.activeElement as HTMLElement | null)?.blur(); });
  const missing: string[] = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null; if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== "none");
      return { ring, label: (el.innerText || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 30) };
    });
    if (r && !r.ring) missing.push(r.label);
  }
  return missing.length ? [{ check: "focus-visible", severity: "High", where: "Keyboard focus", detail: `no visible focus style on: ${[...new Set(missing)].join(", ")}`, selector: "" }] : [];
}

async function axeCheck(page: Page): Promise<Issue[]> {
  await page.addScriptTag({ content: AXE });
  const res = await page.evaluate(async () => {
    // @ts-expect-error injected
    const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] }, resultTypes: ["violations"] });
    return r.violations.map((v: { id: string; impact: string; help: string; nodes: { target: string[]; failureSummary: string }[] }) => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, target: v.nodes[0]?.target.join(" "), summary: v.nodes[0]?.failureSummary?.split("\n").slice(1, 2).join(" ").slice(0, 160) }));
  });
  const sev: Record<string, string> = { critical: "Critical", serious: "High", moderate: "Medium", minor: "Low" };
  return res.map((v: { id: string; impact: string; help: string; n: number; target: string; summary: string }) => ({ check: `axe:${v.id}`, severity: sev[v.impact] ?? "Medium", where: v.target, detail: `${v.help} (${v.n} element${v.n > 1 ? "s" : ""}). ${v.summary}`, selector: v.target }));
}

async function runOne(browser: Browser, route: string, width: number): Promise<Result> {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 812 : 900 }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 1024 });
  const page = await ctx.newPage();
  const consoleMsgs: string[] = [];
  const failed: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") consoleMsgs.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => consoleMsgs.push("pageerror: " + e.message.slice(0, 200)));
  page.on("response", (r) => { const u = r.url(); if (r.status() >= 400 && u.startsWith(BASE)) failed.push(`${r.status()} ${u.replace(BASE, "")}`); });
  page.on("requestfailed", (r) => { const u = r.url(); if (u.startsWith(BASE) && !/_rsc=/.test(u)) failed.push(`failed ${u.replace(BASE, "")} ${r.failure()?.errorText ?? ""}`); });
  const res = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
  if (!res || res.status() >= 400) failed.push(`${res?.status()} ${route} (page)`);
  await settle(page);
  const m = await page.evaluate(MEASURE) as { issues: Issue[]; sections: unknown[]; stats: Record<string, unknown> };
  let shot: string | undefined;
  if (SHOTS) {
    shot = join(SHOT_DIR, routeDir(route), `${width}.png`);
    mkdirSync(dirname(shot), { recursive: true });
    await page.evaluate(() => { for (const img of document.images) { img.decoding = "sync"; } window.scrollTo(0, 0); });
    await page.waitForTimeout(400);
    await page.screenshot({ path: shot, fullPage: true });
  }
  const chromeRoutes = ["/", "/services/dental-implants/", "/contact/", "/dental-implants-cost/"];
  if (chromeRoutes.includes(route)) m.issues.push(...(await chromeChecks(page, width)));
  if (width === 375 || width === 1440) {
    // let the header finish its 300ms fade back to transparent at the top before measuring contrast
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    m.issues.push(...(await axeCheck(page)));
  }
  if (width === 1440) m.issues.push(...(await focusCheck(page)));
  await ctx.close();
  for (const i of m.issues) { i.route = route; i.width = width; }
  return { route, width, ...m, console: [...new Set(consoleMsgs)], failed: [...new Set(failed)], shot: shot?.replace(ROOT + "/", "") };
}

const list = await routes();
const tasks = list.flatMap((r) => WIDTHS.map((w) => [r, w] as const));
console.log(`Auditing ${list.length} routes × ${WIDTHS.length} widths = ${tasks.length} runs (${PHASE})`);
const browser = await chromium.launch();
const results: Result[] = [];
let done = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (tasks.length) {
    const [r, w] = tasks.shift()!;
    try { results.push(await runOne(browser, r, w)); }
    catch (e) { results.push({ route: r, width: w, issues: [{ check: "run-error", severity: "High", where: "Audit", detail: String(e).slice(0, 200), selector: "", route: r, width: w }], sections: [], stats: {}, console: [], failed: [] }); }
    if (++done % 20 === 0) console.log(`  ${done} done`);
  }
}));
await browser.close();
mkdirSync(join(ROOT, "audit/data"), { recursive: true });
const file = join(ROOT, "audit/data", `${PHASE}.json`);
// --merge: re-measure only the given routes and replace their results in an existing run
if (process.argv.includes("--merge") && existsSync(file)) {
  const prev = JSON.parse(readFileSync(file, "utf8"));
  const redone = new Set(results.map((r) => `${r.route}|${r.width}`));
  const merged = [...prev.results.filter((r: Result) => !redone.has(`${r.route}|${r.width}`)), ...results];
  merged.sort((a: Result, b: Result) => prev.routes.indexOf(a.route) - prev.routes.indexOf(b.route) || a.width - b.width);
  writeFileSync(file, JSON.stringify({ ...prev, date: new Date().toISOString(), results: merged }, null, 1));
} else {
  results.sort((a, b) => list.indexOf(a.route) - list.indexOf(b.route) || a.width - b.width);
  writeFileSync(file, JSON.stringify({ base: BASE, date: new Date().toISOString(), widths: WIDTHS, routes: list, results }, null, 1));
}
const n = results.reduce((s, r) => s + r.issues.length, 0);
console.log(`Wrote ${file}: ${n} raw findings, ${results.filter((r) => r.console.length).length} runs with console errors, ${results.filter((r) => r.failed.length).length} with failed requests`);
