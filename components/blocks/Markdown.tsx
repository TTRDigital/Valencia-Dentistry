import Link from "next/link";
import { parseMarkdown, type Block, type Inline } from "@/lib/markdown";
import { cn } from "@/lib/utils";

function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        if (n.t === "text") return <span key={i}>{n.text}</span>;
        if (n.t === "strong") return <strong key={i}><Inlines nodes={n.children} /></strong>;
        if (n.t === "em") return <em key={i}><Inlines nodes={n.children} /></em>;
        const internal = n.href.startsWith("/") || n.href.startsWith("#");
        return internal ? (
          <Link key={i} href={n.href}><Inlines nodes={n.children} /></Link>
        ) : (
          <a key={i} href={n.href} rel="noopener noreferrer" target="_blank"><Inlines nodes={n.children} /></a>
        );
      })}
    </>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "heading": {
      const Tag = `h${b.level}` as "h2" | "h3" | "h4";
      return <Tag id={b.id}><Inlines nodes={b.children} /></Tag>;
    }
    case "paragraph":
      return <p><Inlines nodes={b.children} /></p>;
    case "quote":
      return <blockquote><Inlines nodes={b.children} /></blockquote>;
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return <Tag>{b.items.map((it, i) => <li key={i}><Inlines nodes={it} /></li>)}</Tag>;
    }
    case "table":
      return (
        <div className="table-wrap">
          <table>
            <thead><tr>{b.rows[0]?.map((c, i) => <th key={i} scope="col"><Inlines nodes={c} /></th>)}</tr></thead>
            <tbody>{b.rows.slice(1).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Inlines nodes={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case "hr":
      return <hr />;
  }
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className={cn("rich", className)}>
      {blocks.map((b, i) => <BlockView key={i} b={b} />)}
    </div>
  );
}
