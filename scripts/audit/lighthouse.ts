// Lighthouse (mobile + desktop) for the home page and three service pages, plus a lab INP probe.
//   npm run audit:lighthouse -- [--base http://localhost:3000] [--phase before|after]
// next start serves HTTP/1.1 without compression headers a CDN would add, so pages are fetched through a small
// local HTTPS/HTTP2 proxy (self-signed, generated into audit/.cache) to resemble the Vercel edge.
// Lighthouse has no INP in navigation mode; INP is measured separately with Playwright: real clicks/keys on
// the menu, treatment picker, slider and FAQ under 4x CPU throttling, reporting the slowest interaction.
// Output: audit/data/lighthouse-<phase>.json
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import http from "node:http";
import http2 from "node:http2";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const arg = (name: string, def?: string) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : def; };
const BASE = new URL(arg("base", "http://localhost:3000") as string);
const PHASE = arg("phase", "before") as string;
const ROOT = join(dirname(new URL(import.meta.url).pathname), "../..");
const CACHE = join(ROOT, "audit/.cache");
const CHROME = process.env.CHROME_PATH || "/opt/pw-browsers/chromium";
const PAGES = ["/", "/services/dental-implants/", "/services/oral-surgery/all-on-4-implants/", "/services/cosmetic-dentistry/veneers/"];
const PORT = 3443;

mkdirSync(CACHE, { recursive: true });
const key = join(CACHE, "key.pem"), cert = join(CACHE, "cert.pem");
if (!existsSync(key)) execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", key, "-out", cert, "-days", "30", "-subj", "/CN=localhost"], { stdio: "ignore" });

const proxy = http2.createSecureServer({ key: readFileSync(key), cert: readFileSync(cert), allowHTTP1: true }, (req, res) => {
  const up = http.request({ host: BASE.hostname, port: BASE.port || 80, path: req.url, method: req.method, headers: { host: `localhost:${PORT}`, "accept-encoding": String(req.headers["accept-encoding"] ?? ""), accept: String(req.headers.accept ?? "*/*"), "user-agent": String(req.headers["user-agent"] ?? "") } }, (r) => {
    const h = { ...r.headers };
    for (const k of ["connection", "keep-alive", "transfer-encoding", "strict-transport-security"]) delete h[k];
    res.writeHead(r.statusCode ?? 502, h);
    r.pipe(res);
  });
  up.on("error", () => { res.writeHead(502); res.end(); });
  req.pipe(up);
});
await new Promise<void>((r) => proxy.listen(PORT, r));

type Row = { page: string; form: "mobile" | "desktop"; performance: number; accessibility: number; bestPractices: number; seo: number; lcp: string; cls: string; tbt: string; inp?: string };
const rows: Row[] = [];
for (const p of PAGES) {
  for (const form of ["mobile", "desktop"] as const) {
    const out = join(CACHE, `lh-${form}-${p.replace(/\W+/g, "_")}.json`);
    const args = ["-y", "lighthouse", `https://localhost:${PORT}${p}`, "--quiet", `--chrome-flags=--headless --no-sandbox --ignore-certificate-errors`, "--only-categories=performance,accessibility,best-practices,seo", "--output=json", `--output-path=${out}`];
    if (form === "desktop") args.push("--preset=desktop");
    // Lighthouse varies run to run; take the median performance of three runs.
    const runs: { score: number; r: any }[] = [];
    for (let i = 0; i < 3; i++) {
      // async spawn: the proxy runs in this process and must keep serving while Lighthouse loads pages
      await new Promise<void>((resolve) => spawn("npx", args, { env: { ...process.env, CHROME_PATH: CHROME }, stdio: "ignore" }).on("exit", () => resolve()));
      const r = JSON.parse(readFileSync(out, "utf8"));
      if (r.runtimeError) { console.log(p, form, r.runtimeError.code); continue; }
      runs.push({ score: r.categories.performance.score, r });
    }
    if (!runs.length) continue;
    runs.sort((a, b) => a.score - b.score);
    const r = runs[Math.floor(runs.length / 2)].r;
    const c = r.categories, a = r.audits;
    rows.push({ page: p, form, performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100), bestPractices: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100), lcp: a["largest-contentful-paint"].displayValue, cls: a["cumulative-layout-shift"].displayValue, tbt: a["total-blocking-time"].displayValue });
    console.log(JSON.stringify(rows[rows.length - 1]));
  }
}

// ---- Lab INP: slowest interaction under 4x CPU throttling ----
const browser = await chromium.launch({ args: ["--ignore-certificate-errors"] });
for (const p of PAGES) {
  for (const form of ["mobile", "desktop"] as const) {
    const ctx = await browser.newContext(form === "mobile" ? { viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true } : { viewport: { width: 1350, height: 940 }, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      (window as any).__inp = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries() as any[]) if (e.interactionId) (window as any).__inp = Math.max((window as any).__inp, e.duration); })
        .observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
    });
    await page.goto(`https://localhost:${PORT}${p}`, { waitUntil: "networkidle" });
    const tap = async (sel: string) => { const l = page.locator(sel).first(); if (await l.count() && await l.isVisible()) { await l.scrollIntoViewIfNeeded(); await l.click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(250); } };
    if (form === "mobile") { await tap('header button[aria-controls="mobile-menu"]'); await page.keyboard.press("Escape"); await page.waitForTimeout(250); }
    else { await tap("header button[aria-controls]"); await page.keyboard.press("Escape"); }
    await tap('[role="radiogroup"] [role="radio"]:nth-child(2)');
    const slider = page.locator('[role="slider"]').first();
    if (await slider.count()) { await slider.scrollIntoViewIfNeeded(); await slider.focus(); await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(250); }
    await tap("details summary");
    await tap("details summary");
    const inp = await page.evaluate(() => (window as any).__inp as number);
    const row = rows.find((x) => x.page === p && x.form === form);
    if (row) row.inp = `${Math.round(inp)} ms`;
    await ctx.close();
  }
}
await browser.close();
proxy.close();
const file = join(ROOT, "audit/data", `lighthouse-${PHASE}.json`);
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify({ date: new Date().toISOString(), rows }, null, 1));
console.table(rows);
process.exit(0);
