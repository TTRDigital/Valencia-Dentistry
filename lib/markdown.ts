/**
 * A small, safe markdown model: parses the subset used by the content files
 * (headings, paragraphs, bullet/numbered lists, tables, blockquotes, bold,
 * italic, links) into blocks. Rendered by components/blocks/Markdown.tsx and
 * converted to/from Portable Text by lib/portable.ts. No raw HTML is ever
 * emitted.
 */
export type Inline = { t: "text"; text: string } | { t: "strong"; children: Inline[] } | { t: "em"; children: Inline[] } | { t: "link"; href: string; children: Inline[] };
export type Block =
  | { t: "heading"; level: 2 | 3 | 4; id: string; children: Inline[] }
  | { t: "paragraph"; children: Inline[] }
  | { t: "list"; ordered: boolean; items: Inline[][] }
  | { t: "table"; rows: Inline[][][] }
  | { t: "quote"; children: Inline[] }
  | { t: "hr" };

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|__([^_]+)__|_([^_]+)_/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ t: "text", text: src.slice(last, m.index) });
    if (m[1] != null) out.push({ t: "link", href: m[2], children: parseInline(m[1]) });
    else if (m[3] != null || m[5] != null) out.push({ t: "strong", children: parseInline(m[3] ?? m[5]) });
    else out.push({ t: "em", children: parseInline(m[4] ?? m[6]) });
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ t: "text", text: src.slice(last) });
  return out;
}

export function inlineText(nodes: Inline[]): string {
  return nodes.map((n) => (n.t === "text" ? n.text : inlineText(n.children))).join("");
}

export function headingId(text: string, used?: Set<string>) {
  let id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "section";
  if (used) {
    let i = 2;
    const base = id;
    while (used.has(id)) id = `${base}-${i++}`;
    used.add(id);
  }
  return id;
}

export function parseMarkdown(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  const used = new Set<string>();
  let i = 0;
  const para: string[] = [];
  const flush = () => {
    if (para.length) {
      blocks.push({ t: "paragraph", children: parseInline(para.join(" ").replace(/\s+/g, " ").trim()) });
      para.length = 0;
    }
  };
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { flush(); i++; continue; }
    const h = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (h) {
      flush();
      const level = Math.min(4, Math.max(2, h[1].length)) as 2 | 3 | 4;
      const text = h[2].replace(/\s*#+$/, "");
      blocks.push({ t: "heading", level, id: headingId(text, used), children: parseInline(text) });
      i++; continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) { flush(); blocks.push({ t: "hr" }); i++; continue; }
    if (/^>\s?/.test(trimmed)) {
      flush();
      const q: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) { q.push(lines[i].trim().replace(/^>\s?/, "")); i++; }
      blocks.push({ t: "quote", children: parseInline(q.join(" ")) });
      continue;
    }
    if (/^\|/.test(trimmed)) {
      flush();
      const rows: Inline[][][] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (!t) { if (i + 1 < lines.length && /^\|/.test(lines[i + 1].trim())) { i++; continue; } break; }
        if (!/^\|/.test(t)) break;
        if (/^\|\s*:?-{2,}/.test(t)) { i++; continue; }
        rows.push(t.replace(/^\||\|$/g, "").split("|").map((c) => parseInline(c.trim())));
        i++;
      }
      if (rows.length) blocks.push({ t: "table", rows });
      continue;
    }
    const li = /^([-*+]|\d+[.)])\s+(.*)$/.exec(trimmed);
    if (li) {
      flush();
      const ordered = /^\d/.test(li[1]);
      const items: Inline[][] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = /^([-*+]|\d+[.)])\s+(.*)$/.exec(t);
        if (m && /^\d/.test(m[1]) === ordered) { items.push(parseInline(m[2])); i++; continue; }
        if (!t && i + 1 < lines.length && /^([-*+]|\d+[.)])\s+/.test(lines[i + 1].trim())) { i++; continue; }
        if (t && !m && items.length && /^\s{2,}/.test(lines[i])) { items[items.length - 1].push({ t: "text", text: " " + t }); i++; continue; }
        break;
      }
      blocks.push({ t: "list", ordered, items });
      continue;
    }
    para.push(trimmed);
    i++;
  }
  flush();
  return blocks;
}

export function plainText(md: string) {
  return parseMarkdown(md)
    .map((b) => (b.t === "heading" || b.t === "paragraph" || b.t === "quote" ? inlineText(b.children) : b.t === "list" ? b.items.map(inlineText).join(" ") : b.t === "table" ? b.rows.flat().map(inlineText).join(" ") : ""))
    .join(" ");
}

export function tableOfContents(md: string) {
  return parseMarkdown(md).filter((b): b is Extract<Block, { t: "heading" }> => b.t === "heading" && b.level === 2).map((b) => ({ id: b.id, text: inlineText(b.children) }));
}
