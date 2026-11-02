// Builds audit/REPORT.md from audit/data/*.json and the hand-written visual review (audit/visual-review.json).
//   npm run audit:report
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "../..");
const load = (f: string) => (existsSync(join(ROOT, f)) ? JSON.parse(readFileSync(join(ROOT, f), "utf8")) : null);
type Issue = { check: string; severity: string; where: string; detail: string; selector: string; route: string; width: number };
type Manual = { id: string; route: string; issue: string; where: string; severity: string; shot: string; fix: string; status?: string };
const before = load("audit/data/before.json");
const after = load("audit/data/after.json");
const lhBefore = load("audit/data/lighthouse-before.json");
const lhAfter = load("audit/data/lighthouse-after.json");
const manual: Manual[] = load("audit/visual-review.json") ?? [];
if (!before) throw new Error("Run npm run audit:visual -- --phase before first");

const SEV = ["Critical", "High", "Medium", "Low"];
const FIX: Record<string, string> = {
  "section-edge": "Wrap the section in the shared Container (one max-width and side padding)",
  "section-spacing": "Use the Section component's spacing scale instead of ad-hoc padding",
  "left-edge": "Remove the stray margin/padding so it sits on its column edge",
  "orphan-card": "Pick a column count that divides the set, or let the last card span the row",
  "card-height": "Make cards fill the grid row (h-full, flex column) so heights match",
  "card-title-align": "Give images in the set one aspect ratio so titles start at the same height",
  "card-image-size": "Use one fixed aspect ratio for every image in the set",
  "card-action-align": "Pin the link/button to the card bottom (flex column + mt-auto)",
  "card-gap": "Use grid gap instead of per-card margins",
  overflow: "Constrain the element named (max-width: 100%, overflow-x on its own scroller)",
  "heading-orphan": "Apply text-wrap: balance to headings",
  "button-wrap": "Shorten the label or allow the button to grow; keep buttons on one line (whitespace-nowrap)",
  "text-clipped": "Remove the fixed height/overflow so the text can wrap",
  "text-overlap": "Fix the positioning so the blocks stack instead of overlapping",
  "image-missing": "Fix the image path",
  "image-stretched": "Use object-fit: cover with a fixed aspect ratio",
  "image-blurry": "Serve a larger source (srcset/sizes that account for object-fit: cover cropping)",
  "image-aspect-set": "Give every image in the set the same aspect ratio",
  "tap-target": "Give links/buttons at least 44×44px of hit area (padding or min-height)",
  "small-text": "Keep body copy at 16px or more on mobile",
  "h1-count": "Exactly one H1 per page",
  "heading-skip": "Use the next heading level down (no skipped levels)",
  "img-alt": "Add alt text (or alt=\"\" for decorative images)",
  "form-label": "Associate a visible label with the field",
  "skip-link": "Add a working skip link to #main",
  "map-placeholder": "Show a static map image that resolves cleanly instead of the loading text",
  "header-overlap": "Offset the page content by the header height",
  "header-z": "Raise the header's z-index above page content",
  "mega-open": "Make the Services button toggle the panel on Enter/Space",
  "mega-overflow": "Constrain the panel to the viewport",
  "mega-height": "Let the panel scroll or reduce its height",
  "mega-escape": "Close the panel on Escape",
  "mega-focus": "Return focus to the Services button when the panel closes",
  "mobile-menu": "Fix the mobile menu toggle",
  "mobile-bar-covers": "Add bottom padding equal to the bar height so the footer clears it",
  "mobile-bar": "Show the bar once the hero has scrolled out of view",
  "focus-visible": "Add a visible :focus-visible ring",
  "console-error": "Fix the script error",
  "request-failed": "Fix the broken URL",
};
const fixFor = (check: string) => FIX[check] ?? (check.startsWith("axe:") ? "Fix per the axe rule (see detail)" : "See detail");
const norm = (s: string) => s.replace(/-?\d+(\.\d+)?/g, "#");
const posts = new Set(readdirSync(join(ROOT, "content/posts")).filter((f) => f.endsWith(".json")).map((f) => `/${f.replace(/\.json$/, "")}/`));
const groupOf = (route: string) => (posts.has(route) ? "Blog posts (31 pages, one template)" : route);
const shotPath = (phase: string, route: string, width: number) => `${phase === "before" ? "audit/screenshots" : "audit/after/screenshots"}/${route === "/" ? "home" : route.replace(/^\/|\/$/g, "")}/${width}.png`;

function collect(data: any) {
  const issues: Issue[] = [];
  for (const r of data.results) {
    issues.push(...r.issues);
    for (const c of r.console) issues.push({ check: "console-error", severity: "High", where: "Console", detail: c, selector: "", route: r.route, width: r.width });
    for (const f of r.failed) issues.push({ check: "request-failed", severity: "High", where: "Network", detail: f, selector: "", route: r.route, width: r.width });
  }
  // merge the same finding across widths (and across blog posts)
  const map = new Map<string, { group: string; check: string; severity: string; where: string; detail: string; widths: Set<number>; routes: Set<string>; first: Issue }>();
  for (const i of issues) {
    const group = groupOf(i.route);
    const k = `${group}|${i.check}|${norm(i.where)}|${i.check.startsWith("axe:") || i.check === "tap-target" ? "" : norm(i.detail)}`;
    const e = map.get(k);
    if (e) { e.widths.add(i.width); e.routes.add(i.route); if (SEV.indexOf(i.severity) < SEV.indexOf(e.severity)) e.severity = i.severity; }
    else map.set(k, { group, check: i.check, severity: i.severity, where: i.where, detail: i.detail, widths: new Set([i.width]), routes: new Set([i.route]), first: i });
  }
  return map;
}
const B = collect(before);
const A = after ? collect(after) : null;

const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const widthsTxt = (ws: Set<number>) => { const a = [...ws].sort((x, y) => x - y); return a.length === before.widths.length ? "all widths" : a.join(", "); };

let md = `# Valencia Dentistry: visual and layout audit\n\n`;
md += `Generated by \`npm run audit:report\` from \`scripts/audit/\` measurements (${before.routes.length} routes × ${before.widths.length} widths: ${before.widths.join(", ")}px) taken ${before.date.slice(0, 10)} against a production build, plus a manual review of the screenshots.\n`;
md += `Screenshots: \`audit/screenshots/<route>/<width>.png\` (before) and \`audit/after/screenshots/...\` (after). They are git-ignored; regenerate with \`npm run audit:visual\`.\n\n`;

// ---------- Top 10 ----------
const byCheck = new Map<string, { check: string; severity: string; routes: Set<string>; widths: Set<number>; example: string; where: string }>();
for (const e of B.values()) {
  const k = e.check;
  const x = byCheck.get(k) ?? { check: k, severity: e.severity, routes: new Set<string>(), widths: new Set<number>(), example: e.detail, where: e.where };
  e.routes.forEach((r) => x.routes.add(r)); e.widths.forEach((w) => x.widths.add(w));
  if (SEV.indexOf(e.severity) < SEV.indexOf(x.severity)) { x.severity = e.severity; x.example = e.detail; x.where = e.where; }
  byCheck.set(k, x);
}
const top = [
  ...[...byCheck.values()].map((x) => ({ title: `${x.check}: ${x.where}`, severity: x.severity, pages: x.routes.size, detail: x.example, fix: fixFor(x.check), score: (4 - SEV.indexOf(x.severity)) * 1000 + x.routes.size })),
  ...manual.filter((m) => m.severity !== "Low").map((m) => ({ title: `${m.issue}`, severity: m.severity, pages: m.route === "site" ? before.routes.length : 1, detail: m.where, fix: m.fix, score: (4 - SEV.indexOf(m.severity)) * 1000 + (m.route === "site" ? 40 : 1) + 0.5 })),
].sort((a, b) => b.score - a.score).slice(0, 10);
md += `## Top 10 problems across the site\n\nRanked by severity, then by how many pages are affected ("site" findings from the visual review count as site-wide).\n\n| # | Problem | Severity | Pages | Example | Fix |\n|---|---|---|---|---|---|\n`;
top.forEach((t, i) => { md += `| ${i + 1} | ${esc(t.title)} | ${t.severity} | ${t.pages} | ${esc(t.detail).slice(0, 140)} | ${esc(t.fix)} |\n`; });

// ---------- Lighthouse ----------
if (lhBefore) {
  md += `\n## Lighthouse (median of 3 runs; INP measured separately with real interactions at 4× CPU throttle)\n\n| Page | Form | Perf | A11y | BP | SEO | LCP | CLS | TBT | INP |\n|---|---|---|---|---|---|---|---|---|---|\n`;
  for (const r of lhBefore.rows) {
    const a = lhAfter?.rows.find((x: any) => x.page === r.page && x.form === r.form);
    const cell = (k: string) => (a ? `${r[k]} → ${a[k]}` : `${r[k]}`);
    md += `| ${r.page} | ${r.form} | ${cell("performance")} | ${cell("accessibility")} | ${cell("bestPractices")} | ${cell("seo")} | ${cell("lcp")} | ${cell("cls")} | ${cell("tbt")} | ${cell("inp")} |\n`;
  }
}

// ---------- Per page ----------
md += `\n## Findings per page\n\nSeverity: Critical breaks the page, High is clearly visible or blocks some users, Medium is noticeable, Low is polish.\n`;
const groups = [...new Set([...B.values()].map((e) => e.group).concat(manual.map((m) => groupOf(m.route === "site" ? "site" : m.route))))];
const order = (g: string) => (g === "site" ? -1 : before.routes.indexOf(g) === -1 ? 999 : before.routes.indexOf(g));
groups.sort((a, b) => order(a) - order(b));
for (const g of groups) {
  const rows = [...B.values()].filter((e) => e.group === g).sort((a, b) => SEV.indexOf(a.severity) - SEV.indexOf(b.severity));
  const man = manual.filter((m) => groupOf(m.route) === g || (g === "site" && m.route === "site"));
  if (!rows.length && !man.length) continue;
  md += `\n### ${g === "site" ? "Site-wide (visual review)" : g === "/" ? "Home (/)" : g}\n\n| Issue | Where | Severity | Screenshot | Proposed fix${A ? " | After" : ""} |\n|---|---|---|---|---|${A ? "---|" : ""}\n`;
  for (const m of man) md += `| ${esc(m.issue)} | ${esc(m.where)} | ${m.severity} | ${m.shot} | ${esc(m.fix)}${A ? ` | ${m.status ?? "?"}` : ""} |\n`;
  for (const e of rows) {
    const w = [...e.widths].sort((x, y) => x - y)[0];
    const r = [...e.routes][0];
    const where = `${e.where} @ ${widthsTxt(e.widths)}${e.routes.size > 1 ? ` (${e.routes.size} pages)` : ""}`;
    let status = "";
    if (A) {
      const k = [...A.keys()].find((k) => { const x = A.get(k)!; return x.group === e.group && x.check === e.check && norm(x.where) === norm(e.where); });
      status = k ? `Remaining${A.get(k)!.widths.size < e.widths.size ? ` (${widthsTxt(A.get(k)!.widths)})` : ""}` : "Fixed";
    }
    md += `| ${esc(e.check)}: ${esc(e.detail).slice(0, 170)} | ${esc(where)} | ${e.severity} | ${shotPath("before", r, w)} | ${esc(fixFor(e.check))}${A ? ` | ${status}` : ""} |\n`;
  }
}

// ---------- After ----------
if (A) {
  const total = B.size, fixed = [...B.keys()].filter((k) => { const e = B.get(k)!; return ![...A.values()].some((x) => x.group === e.group && x.check === e.check && norm(x.where) === norm(e.where)); }).length;
  const newOnes = [...A.values()].filter((x) => ![...B.values()].some((e) => e.group === x.group && e.check === x.check && norm(x.where) === norm(e.where)));
  const bySev = (m: Map<string, any>) => SEV.map((s) => `${s} ${[...m.values()].filter((e) => e.severity === s).length}`).join(" · ");
  md += `\n## AFTER\n\nMeasured ${after.date.slice(0, 10)} with the same script. ${fixed} of ${total} measured findings fixed; ${total - fixed} remaining (see the After column above).\n\n- Before: ${bySev(B)}\n- After: ${bySev(A)}\n`;
  if (newOnes.length) {
    md += `\nNew findings that appeared after the changes:\n\n| Page | Issue | Where | Severity |\n|---|---|---|---|\n`;
    for (const x of newOnes) md += `| ${x.group} | ${esc(x.check)}: ${esc(x.detail).slice(0, 150)} | ${esc(x.where)} @ ${widthsTxt(x.widths)} | ${x.severity} |\n`;
  }
}
if (existsSync(join(ROOT, "audit/after-notes.md"))) md += "\n" + readFileSync(join(ROOT, "audit/after-notes.md"), "utf8");
writeFileSync(join(ROOT, "audit/REPORT.md"), md);
console.log(`audit/REPORT.md: ${B.size} merged findings${A ? `, after: ${A.size}` : ""}, ${manual.length} manual`);
