import { headingId, parseMarkdown, type Block, type Inline } from "./markdown.ts";

/**
 * Markdown model <-> Portable Text, so blog bodies can be edited in /cms as
 * rich text (block content + a `table` block) and still render through the
 * same markdown renderer.
 */
export type PtSpan = { _type: "span"; _key: string; text: string; marks: string[] };
export type PtBlock =
  | { _type: "block"; _key: string; style: string; listItem?: "bullet" | "number"; level?: number; markDefs: { _type: "link"; _key: string; href: string }[]; children: PtSpan[] }
  | { _type: "table"; _key: string; rows: { _type: "row"; _key: string; cells: string[] }[] };

let n = 0;
const key = () => `k${(n++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function spans(nodes: Inline[], marks: string[], defs: { _type: "link"; _key: string; href: string }[]): PtSpan[] {
  const out: PtSpan[] = [];
  for (const node of nodes) {
    if (node.t === "text") out.push({ _type: "span", _key: key(), text: node.text, marks });
    else if (node.t === "link") { const k = key(); defs.push({ _type: "link", _key: k, href: node.href }); out.push(...spans(node.children, [...marks, k], defs)); }
    else out.push(...spans(node.children, [...marks, node.t], defs));
  }
  return out;
}

function textBlock(style: string, nodes: Inline[], list?: "bullet" | "number"): PtBlock {
  const markDefs: { _type: "link"; _key: string; href: string }[] = [];
  const children = spans(nodes, [], markDefs);
  return { _type: "block", _key: key(), style, markDefs, children, ...(list ? { listItem: list, level: 1 } : {}) };
}

export function markdownToPortableText(md: string): PtBlock[] {
  const out: PtBlock[] = [];
  for (const b of parseMarkdown(md)) {
    if (b.t === "heading") out.push(textBlock(`h${b.level}`, b.children));
    else if (b.t === "paragraph") out.push(textBlock("normal", b.children));
    else if (b.t === "quote") out.push(textBlock("blockquote", b.children));
    else if (b.t === "list") for (const item of b.items) out.push(textBlock("normal", item, b.ordered ? "number" : "bullet"));
    else if (b.t === "table") out.push({ _type: "table", _key: key(), rows: b.rows.map((r) => ({ _type: "row", _key: key(), cells: r.map(inlineMd) })) });
  }
  return out;
}

function inlineMd(nodes: Inline[]): string {
  return nodes.map((x) => (x.t === "text" ? x.text : x.t === "strong" ? `**${inlineMd(x.children)}**` : x.t === "em" ? `*${inlineMd(x.children)}*` : `[${inlineMd(x.children)}](${x.href})`)).join("");
}

function spanMd(block: Extract<PtBlock, { _type: "block" }>): string {
  const defs = new Map(block.markDefs?.map((d) => [d._key, d.href]));
  return (block.children || [])
    .map((s) => {
      let t = s.text;
      for (const m of s.marks || []) {
        if (m === "strong") t = `**${t}**`;
        else if (m === "em") t = `*${t}*`;
        else if (defs.has(m)) t = `[${t}](${defs.get(m)})`;
      }
      return t;
    })
    .join("");
}

export function toMarkdown(blocks: PtBlock[]): string {
  const lines: string[] = [];
  let i = 0;
  for (const b of blocks) {
    if (b._type === "table") {
      lines.push(`| ${b.rows[0]?.cells.join(" | ")} |`, `| ${b.rows[0]?.cells.map(() => "---").join(" | ")} |`, ...b.rows.slice(1).map((r) => `| ${r.cells.join(" | ")} |`), "");
      continue;
    }
    const text = spanMd(b);
    if (b.listItem) { lines.push(`${b.listItem === "number" ? `${++i}.` : "-"} ${text}`); continue; }
    i = 0;
    if (/^h[1-6]$/.test(b.style)) lines.push("", `${"#".repeat(Number(b.style[1]))} ${text}`, "");
    else if (b.style === "blockquote") lines.push(`> ${text}`, "");
    else lines.push(text, "");
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export { headingId, parseMarkdown, type Block };
