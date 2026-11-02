/* eslint-disable */
// Runs inside the page (Playwright page.evaluate). Plain browser JS, no imports.
// Returns { issues: [...], sections: [...], stats: {...} } for one route at one width.
// Each issue: { check, severity, where, detail, selector }.
(() => {
  const vw = document.documentElement.clientWidth;
  const mobile = vw <= 480;
  const issues = [];
  const add = (check, severity, where, detail, el) => issues.push({ check, severity, where, detail, selector: el ? sel(el) : "" });

  function sel(el) {
    if (!el || el.nodeType !== 1) return "";
    const parts = [];
    let n = el;
    for (let i = 0; n && n.nodeType === 1 && i < 4; i++) {
      let s = n.tagName.toLowerCase();
      if (n.id) { s += "#" + n.id; parts.unshift(s); break; }
      const cls = [...n.classList].filter((c) => !/[:\[\]\/]/.test(c)).slice(0, 2);
      if (cls.length) s += "." + cls.join(".");
      parts.unshift(s);
      n = n.parentElement;
    }
    return parts.join(" > ");
  }
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
      if (n.classList?.contains("sr-only")) return false;
      if (n.tagName === "DETAILS" && !n.open && !el.closest("summary")) return false; // closed accordion content
    }
    return true;
  };
  const abs = (el) => { const r = el.getBoundingClientRect(); return { l: r.left + scrollX, r: r.right + scrollX, t: r.top + scrollY, b: r.bottom + scrollY, w: r.width, h: r.height }; };
  const round = (x) => Math.round(x);
  const isFixed = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === "fixed" || p === "sticky") return true; } return false; };
  const text = (el) => (el.innerText || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 60);

  // ---------- Sections (full-width bands inside <main>) ----------
  const main = document.querySelector("main") || document.body;
  const bands = [];
  const collect = (parent) => {
    for (const c of parent.children) {
      if (!visible(c) || c.tagName === "SCRIPT") continue;
      const r = c.getBoundingClientRect();
      const full = r.width >= vw - 2;
      // Descend into wrappers that only group bands (article, div) when they contain several full-width children.
      const fullKids = [...c.children].filter((k) => visible(k) && k.getBoundingClientRect().width >= vw - 2);
      if (full && fullKids.length >= 2 && !c.querySelector(":scope > .container-x")) collect(c);
      else if (full) bands.push(c);
    }
  };
  collect(main);
  const footer = document.querySelector("body > footer") || [...document.querySelectorAll("footer")].filter((f) => !f.closest("main")).pop();
  if (footer && visible(footer)) bands.push(footer);

  const findContainer = (band) => {
    const cx = band.querySelector(".container-x");
    if (cx && visible(cx)) return cx;
    // widest descendant (depth <= 4) narrower than the band = the de-facto container
    const q = [[band, 0]];
    let best = null, bestW = 0;
    while (q.length) {
      const [n, d] = q.shift();
      for (const k of n.children) {
        if (!visible(k)) continue;
        const w = k.getBoundingClientRect().width;
        if (w < vw - 4 && w > bestW) { best = k; bestW = w; }
        if (d < 4) q.push([k, d + 1]);
      }
    }
    if (best && bestW > vw * 0.5) return best;
    // full-width content: use padding of the band itself
    return band;
  };
  const sections = bands.map((b, i) => {
    const c = findContainer(b);
    const cr = c.getBoundingClientRect();
    const cs = getComputedStyle(c);
    const bcs = getComputedStyle(b);
    const heading = b.querySelector("h1,h2,h3");
    return {
      i, el: b, name: (heading ? text(heading) : b.id || b.tagName.toLowerCase()).slice(0, 48),
      contentL: round(cr.left + parseFloat(cs.paddingLeft)), contentR: round(cr.right - parseFloat(cs.paddingRight)),
      usesContainer: c.classList.contains("container-x"),
      pt: round(parseFloat(bcs.paddingTop)), pb: round(parseFloat(bcs.paddingBottom)),
      top: round(abs(b).t), height: round(cr.height),
    };
  });
  // dominant content edge
  const counts = {};
  for (const s of sections) { const k = s.contentL + ":" + s.contentR; counts[k] = (counts[k] || 0) + 1; }
  const dom = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]?.split(":").map(Number) || [0, vw];
  for (const s of sections) {
    const dl = Math.abs(s.contentL - dom[0]), dr = Math.abs(s.contentR - dom[1]);
    if (dl > 2 || dr > 2) add("section-edge", dl > 24 || dr > 24 ? "High" : "Medium", `Section "${s.name}"`, `content edge ${s.contentL}–${s.contentR}px vs page ${dom[0]}–${dom[1]}px${s.usesContainer ? "" : " (no shared Container)"}`, s.el);
  }

  // ---------- Vertical spacing between sections ----------
  // The site's own spacing tokens when defined (--section-y / --section-y-tight), else the original Tailwind values.
  const rs = getComputedStyle(document.documentElement);
  const tok = [parseFloat(rs.getPropertyValue("--section-y")), parseFloat(rs.getPropertyValue("--section-y-tight"))].filter((x) => x > 0);
  const scaleByWidth = tok.length ? [0, ...tok] : vw >= 1024 ? [0, 64, 96] : vw >= 640 ? [0, 56, 64] : [0, 48, 56];
  for (const s of sections) {
    if (s.el.tagName === "FOOTER" || s.el.hasAttribute("data-hero")) continue;
    for (const [side, v] of [["top", s.pt], ["bottom", s.pb]]) {
      if (!scaleByWidth.some((x) => Math.abs(x - v) <= 1)) add("section-spacing", "Low", `Section "${s.name}"`, `padding-${side} ${v}px is off the spacing scale (${scaleByWidth.filter(Boolean).join("/")}px at this width)`, s.el);
    }
  }

  // ---------- Element left edges vs their column ----------
  const colOf = (el) => {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      const p = n.parentElement && getComputedStyle(n.parentElement);
      if (n.classList.contains("container-x") || (p && (p.display === "grid" || p.display === "inline-grid"))) return n;
    }
    return null;
  };
  const leftChecked = new Set();
  for (const el of main.querySelectorAll("h1,h2,h3,p,a.btn,button.btn")) {
    if (!visible(el) || isFixed(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.textAlign === "center" || cs.marginLeft === "auto" || cs.position === "absolute") continue;
    const par = el.parentElement, pcs = getComputedStyle(par);
    if (pcs.display.includes("flex") && [...par.children].indexOf(el) > 0) continue; // second button in a row etc.
    if (pcs.textAlign === "center" || pcs.display.includes("flex") && (pcs.justifyContent === "center" || pcs.alignItems === "center" && pcs.flexDirection === "column")) continue;
    const col = colOf(el);
    if (!col) continue;
    // skip items laid out beside an icon/avatar (intentional indent)
    let besideIcon = false;
    for (let n = el; n && n !== col; n = n.parentElement) {
      const ps = n.previousElementSibling; if (!ps || !visible(ps)) continue;
      const a = ps.getBoundingClientRect(), b = n.getBoundingClientRect();
      if (a.right <= b.left + 1 && a.bottom > b.top && a.top < b.bottom) { besideIcon = true; break; }
    }
    if (besideIcon) continue;
    const ccs = getComputedStyle(col);
    if (ccs.textAlign === "center") continue;
    const colL = col.getBoundingClientRect().left + parseFloat(ccs.paddingLeft);
    // allow intended insets inside cards/padded boxes: compare to nearest padded ancestor too
    let boxL = colL;
    for (let n = el.parentElement; n && n !== col; n = n.parentElement) { const ns = getComputedStyle(n); const pl = parseFloat(ns.paddingLeft) + parseFloat(ns.borderLeftWidth); if (pl > 0 || ns.display.includes("flex") || ns.display.includes("grid")) { boxL = n.getBoundingClientRect().left + pl; break; } }
    const d = Math.round(el.getBoundingClientRect().left - boxL);
    if (Math.abs(d) > 2 && !leftChecked.has(col)) { leftChecked.add(col); add("left-edge", "Low", `${el.tagName.toLowerCase()} "${text(el)}"`, `left edge is ${d}px off its column`, el); }
  }

  // ---------- Card rows ----------
  const rowSets = [];
  for (const g of main.querySelectorAll("*")) {
    const cs = getComputedStyle(g);
    if (!(cs.display === "grid" || (cs.display === "flex" && cs.flexWrap === "wrap"))) continue;
    const kids = [...g.children].filter(visible);
    if (kids.length < 2) continue;
    const cardLike = kids.filter((k) => k.querySelector("h2,h3,h4,img,dt") );
    if (cardLike.length < 2 || cardLike.length !== kids.length) continue;
    const ws = kids.map((k) => k.getBoundingClientRect().width);
    if (ws[0] > vw * 0.9) continue; // single column stack
    if (Math.max(...ws) / Math.min(...ws) > 1.1) continue; // a layout grid (e.g. 8/4 columns), not a card row
    if (kids.some((k) => k.querySelector("h2"))) continue; // section-level layout
    if (kids.every((k) => { const im = k.querySelector("img"); return im && getComputedStyle(im).objectFit === "contain" && im.getBoundingClientRect().height < 60; })) continue; // logo strips
    rowSets.push([g, kids]);
  }
  for (const [g, kids] of rowSets) {
    const where = `Card group "${text(g.closest("section")?.querySelector("h2") || g).slice(0, 40)}"`;
    const rows = [];
    for (const k of kids) { const r = k.getBoundingClientRect(); const row = rows.find((x) => Math.abs(x.top - r.top) < 3); if (row) row.items.push(k); else rows.push({ top: r.top, items: [k] }); }
    const cols = Math.max(...rows.map((r) => r.items.length));
    if (cols >= 2 && rows.length > 1 && rows[rows.length - 1].items.length === 1) add("orphan-card", "Medium", where, `${kids.length} cards in ${cols} columns leave one card alone on the last row`, g);
    for (const row of rows) {
      if (row.items.length < 2) continue;
      const hs = row.items.map((k) => k.getBoundingClientRect().height);
      if (Math.max(...hs) - Math.min(...hs) > 4) add("card-height", "Medium", where, `unequal card heights in a row: ${hs.map(round).join(" / ")}px`, g);
      const off = (k, q) => { const e = k.querySelector(q); return e && visible(e) ? e.getBoundingClientRect().top - k.getBoundingClientRect().top : null; };
      const t = row.items.map((k) => off(k, "h2,h3,h4,dt")).filter((x) => x !== null);
      if (t.length === row.items.length && Math.max(...t) - Math.min(...t) > 3) add("card-title-align", "Medium", where, `titles start at different heights: ${t.map(round).join(" / ")}px`, g);
      const im = row.items.map((k) => { const e = k.querySelector("img"); return e && visible(e) ? e.getBoundingClientRect() : null; }).filter(Boolean);
      if (im.length === row.items.length) {
        const ih = im.map((r) => r.height);
        if (Math.max(...ih) - Math.min(...ih) > 3) add("card-image-size", "Medium", where, `image heights differ: ${ih.map(round).join(" / ")}px`, g);
      }
      const bt = row.items.map((k) => { const links = [...k.querySelectorAll("a,button")].filter(visible); const last = links[links.length - 1]; return last ? k.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom : null; }).filter((x) => x !== null);
      if (bt.length === row.items.length && bt.length > 1 && Math.max(...bt) - Math.min(...bt) > 4) add("card-action-align", "Low", where, `links/buttons not aligned to the card bottom: ${bt.map(round).join(" / ")}px from bottom`, g);
      const gaps = []; const sorted = [...row.items].sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
      for (let i = 1; i < sorted.length; i++) gaps.push(sorted[i].getBoundingClientRect().left - sorted[i - 1].getBoundingClientRect().right);
      if (gaps.length > 1 && Math.max(...gaps) - Math.min(...gaps) > 2) add("card-gap", "Low", where, `uneven gaps: ${gaps.map(round).join(" / ")}px`, g);
    }
  }

  // ---------- Horizontal overflow ----------
  const sw = document.documentElement.scrollWidth;
  if (sw > vw + 1) {
    let culprit = null;
    for (const el of document.body.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 0) {
        let clipped = false;
        for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) { const o = getComputedStyle(n).overflowX; if (o !== "visible") { clipped = true; break; } }
        if (!clipped) { culprit = el; break; }
      }
    }
    add("overflow", "Critical", "Page", `document is ${sw - vw}px wider than the viewport; first culprit ${culprit ? sel(culprit) : "unknown"}`, culprit);
  }

  // Content that runs past the viewport edge but is hidden by overflow clipping on <html>/<body>
  // (document.scrollWidth stays equal to the viewport, yet text is cut off on screen).
  for (const el of main.querySelectorAll("p,h1,h2,h3,li,table,section,aside,div")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= vw + 1 || isFixed(el)) continue;
    let scroller = false;
    for (let n = el.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) { const o = getComputedStyle(n).overflowX; if (o !== "visible") { scroller = true; break; } }
    if (!scroller) { add("clipped-overflow", "Critical", "Page", `content runs ${Math.round(r.right - vw)}px past the right edge and is cut off: ${sel(el)}`, el); break; }
  }

  // ---------- Text: orphans, wrapping buttons, clipping, overlap ----------
  const lineWords = (el) => {
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const re = /\S+/g; let m;
      while ((m = re.exec(n.data))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const r = rg.getBoundingClientRect(); if (r.width) words.push(Math.round(r.top)); }
    }
    const lines = [];
    for (const t of words) { const L = lines.find((x) => Math.abs(x.t - t) < 6); if (L) L.n++; else lines.push({ t, n: 1 }); }
    return lines;
  };
  for (const h of document.querySelectorAll("h1,h2,h3")) {
    if (!visible(h)) continue;
    const lines = lineWords(h);
    if (lines.length >= 2 && lines[lines.length - 1].n === 1) add("heading-orphan", "Low", `Heading "${text(h)}"`, `last line is a single word (${lines.length} lines)`, h);
  }
  for (const b of document.querySelectorAll("a.btn,button.btn,.btn")) {
    if (!visible(b)) continue;
    const lines = lineWords(b);
    if (lines.length >= 2) add("button-wrap", "Medium", `Button "${text(b)}"`, `label wraps onto ${lines.length} lines`, b);
  }
  for (const el of document.querySelectorAll("h1,h2,h3,h4,p,a,button,li,dt,dd,span")) {
    if (!visible(el) || !el.childNodes.length) continue;
    const cs = getComputedStyle(el);
    if ((cs.overflow === "hidden" || cs.overflowX === "hidden") && cs.textOverflow !== "ellipsis" && el.scrollWidth > el.clientWidth + 2 && el.innerText.trim()) add("text-clipped", "High", `"${text(el)}"`, `text is cut off (${el.scrollWidth}px content in ${el.clientWidth}px box)`, el);
  }
  // overlapping text blocks (not nested, not fixed chrome)
  const blocks = [...main.querySelectorAll("h1,h2,h3,p,a.btn,button.btn")].filter((e) => visible(e) && !isFixed(e) && getComputedStyle(e).position !== "absolute").map((e) => [e, e.getBoundingClientRect()]);
  for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
    const [a, ra] = blocks[i], [b, rb] = blocks[j];
    if (a.contains(b) || b.contains(a)) continue;
    const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
    if (ox > 4 && oy > 4) add("text-overlap", "High", `"${text(a)}" / "${text(b)}"`, `text boxes overlap by ${round(ox)}×${round(oy)}px`, a);
  }

  // ---------- Images ----------
  const imgs = [...document.querySelectorAll("img")].filter(visible);
  for (const im of imgs) {
    const r = im.getBoundingClientRect();
    if (!im.complete || !im.naturalWidth) { add("image-missing", "High", `Image "${im.alt.slice(0, 40)}"`, `did not load (${(im.currentSrc || im.src).slice(-60)})`, im); continue; }
    const fit = getComputedStyle(im).objectFit;
    const ra = r.width / r.height, na = im.naturalWidth / im.naturalHeight;
    if ((fit === "fill" || fit === "") && Math.abs(ra / na - 1) > 0.03) add("image-stretched", "High", `Image "${im.alt.slice(0, 40)}"`, `distorted: box ${round(r.width)}×${round(r.height)} vs file ${im.naturalWidth}×${im.naturalHeight}`, im);
    // effective source pixels per CSS pixel along the covering axis
    const scale = fit === "cover" ? Math.max(r.width / im.naturalWidth, r.height / im.naturalHeight) : Math.min(r.width / im.naturalWidth, r.height / im.naturalHeight);
    if (scale > 1.15 && r.width > 80) add("image-blurry", scale > 1.5 ? "High" : "Medium", `Image "${im.alt.slice(0, 40)}"`, `upscaled ${scale.toFixed(2)}× (file ${im.naturalWidth}px wide shown at ${round(r.width)}px)`, im);
  }
  for (const [g, kids] of rowSets) {
    const ars = kids.map((k) => { const e = k.querySelector("img"); if (!e || !visible(e)) return null; const r = e.getBoundingClientRect(); return r.width / r.height; }).filter(Boolean);
    if (ars.length === kids.length && ars.length > 1 && Math.max(...ars) / Math.min(...ars) > 1.04) add("image-aspect-set", "Medium", `Card group "${text(g.closest("section")?.querySelector("h2") || g).slice(0, 40)}"`, `image aspect ratios differ in one set: ${ars.map((a) => a.toFixed(2)).join(" / ")}`, g);
  }

  // ---------- Tap targets and small text (mobile) ----------
  if (mobile) {
    const small = [];
    for (const el of document.querySelectorAll("a[href],button,input,select,textarea,[role=button],[role=radio],[role=slider],[tabindex='0']")) {
      if (!visible(el) || el.type === "hidden") continue;
      if (el.getBoundingClientRect().right < 0 || el.closest("[aria-hidden=true]")) continue; // off-screen spam traps
      const p = el.closest("p,li,dd,td");
      const inline = el.tagName === "A" && p && p.innerText.trim().length > el.innerText.trim().length + 8; // links inside running text are exempt (WCAG 2.5.8)
      if (inline) continue;
      if (el.type === "checkbox" || el.type === "radio") { const lab = el.closest("label"); if (lab && lab.getBoundingClientRect().height >= 44) continue; }
      const r = el.getBoundingClientRect();
      if (r.width < 44 || r.height < 44) small.push([el, r]);
    }
    for (const [el, r] of small.slice(0, 12)) add("tap-target", r.width < 24 || r.height < 24 ? "High" : "Medium", `"${text(el) || el.tagName.toLowerCase()}"`, `tap target ${round(r.width)}×${round(r.height)}px (min 44×44)`, el);
    if (small.length > 12) add("tap-target", "Medium", "Page", `${small.length - 12} more targets under 44×44px`, null);
    const tiny = [...main.querySelectorAll("p,li")].filter((e) => visible(e) && !e.closest("footer,figcaption,small,label,nav,form") && parseFloat(getComputedStyle(e).fontSize) < 16 && e.innerText.trim().length > 60);
    if (tiny.length) add("small-text", "Medium", "Body copy", `${tiny.length} paragraphs/list items under 16px on mobile, e.g. "${text(tiny[0])}" (${getComputedStyle(tiny[0]).fontSize})`, tiny[0]);
  }

  // ---------- Headings and basic a11y ----------
  const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter((h) => visible(h) || h.classList.contains("sr-only"));
  const h1s = hs.filter((h) => h.tagName === "H1");
  if (h1s.length !== 1) add("h1-count", "High", "Page", `${h1s.length} H1 elements (expected 1)`, h1s[1] || null);
  let prev = 1;
  for (const h of hs) { const lv = +h.tagName[1]; if (lv > prev + 1) add("heading-skip", "Medium", `Heading "${text(h)}"`, `jumps from H${prev} to H${lv}`, h); prev = lv; }
  for (const im of document.querySelectorAll("img:not([alt])")) add("img-alt", "High", "Image", `missing alt attribute (${im.src.slice(-50)})`, im);
  for (const f of document.querySelectorAll("input:not([type=hidden]),select,textarea")) {
    if (f.closest("[aria-hidden=true]")) continue;
    const labelled = f.labels?.length || f.getAttribute("aria-label") || f.getAttribute("aria-labelledby");
    if (!labelled) add("form-label", "High", "Form", `field "${f.name}" has no label`, f);
  }
  const skip = document.querySelector('a[href="#main"]');
  if (!skip) add("skip-link", "High", "Page", "no skip link", null);
  else if (!document.getElementById("main")) add("skip-link", "High", "Page", "skip link target #main missing", skip);

  // ---------- Map placeholder ----------
  for (const el of document.querySelectorAll("main *")) {
    if (el.children.length === 0 && /Map loading/i.test(el.textContent || "") && visible(el)) { add("map-placeholder", "High", "Visit / map", '"Map loading…" still showing after the page settled', el); break; }
  }

  return {
    issues,
    sections: sections.map(({ el, ...s }) => s),
    stats: { vw, scrollWidth: sw, height: document.documentElement.scrollHeight, images: imgs.length, cardGroups: rowSets.length },
  };
})();
