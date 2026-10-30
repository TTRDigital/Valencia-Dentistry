"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import type { Post } from "@/lib/types";

export type PostSummary = Pick<Post, "slug" | "path" | "title" | "excerpt" | "category" | "tags" | "datePublished" | "image" | "imageAlt">;
import { Icon } from "@/components/ui/Icons";
import { PostCard } from "./PostCard";
import { cn } from "@/lib/utils";

const PER_PAGE = 9;

/** Category chips + instant search over titles, excerpts and tags; paginated list for crawlers (page/N/). */
export function BlogIndex({ posts, page = 1, categories }: { posts: PostSummary[]; page?: number; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const dq = useDeferredValue(q.trim().toLowerCase());
  const filtering = dq.length > 0 || cat !== "All";

  const list = useMemo(() => {
    let out = posts;
    if (cat !== "All") out = out.filter((p) => p.category === cat);
    if (dq) out = out.filter((p) => `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.category}`.toLowerCase().includes(dq));
    return out;
  }, [posts, cat, dq]);

  const total = Math.ceil(posts.length / PER_PAGE);
  const shown = filtering ? list : list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" aria-label="Categories">
          {["All", ...categories].map((c) => (
            <li key={c}>
              <button type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={cn("inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors", cat === c ? "border-navy-900 bg-navy-900 text-white" : "hairline bg-white text-navy-900 hover:border-steel-600")}>
                {c}
              </button>
            </li>
          ))}
        </ul>
        <label className="relative block md:w-72">
          <span className="sr-only">Search articles</span>
          <Icon.search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="block min-h-12 w-full rounded-full border border-grey-300 bg-white pl-11 pr-4 text-navy-900 placeholder:text-grey-400 focus:border-steel-600 focus:ring-2 focus:ring-steel-600/25" />
        </label>
      </div>
      <p className="mt-6 text-sm text-grey-600" aria-live="polite">
        {filtering ? `${list.length} article${list.length === 1 ? "" : "s"}${dq ? ` for “${q.trim()}”` : ""}${cat !== "All" ? ` in ${cat}` : ""}` : `${posts.length} articles`}
      </p>
      {shown.length ? (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map((p, i) => <PostCard key={p.slug} post={p} priority={i < 3 && page === 1} />)}</ul>
      ) : (
        <p className="mt-10 rounded-3xl bg-sky-50 p-8 text-center text-grey-700">Nothing matches yet. Try another word, or <Link href="/contact/" className="font-semibold text-steel-600 underline-offset-4 hover:underline">ask us directly</Link>.</p>
      )}
      {!filtering && total > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={n === 1 ? "/category/blogs/" : `/category/blogs/page/${n}/`} aria-current={n === page ? "page" : undefined} className={cn("inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold", n === page ? "border-navy-900 bg-navy-900 text-white" : "hairline bg-white text-navy-900 hover:border-steel-600")}>
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
