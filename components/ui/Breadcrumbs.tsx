import Link from "next/link";

/** Page path shown at the top of every inner page (Home / Section / Page). The last item is the current page. */
export function Breadcrumbs({ items, light }: { items: { name: string; path: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${light ? "text-white/80" : "text-grey-600"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={it.path} className={`flex items-center gap-2${i === items.length - 1 ? " min-w-0 flex-1 sm:flex-none" : ""}`}>
            {i > 0 && <span aria-hidden="true" className="opacity-50">/</span>}
            {i === items.length - 1 ? <span aria-current="page" className={`truncate ${light ? "text-white" : "text-ink-900"}`}>{it.name}</span> : <Link href={it.path} className="inline-flex min-h-11 min-w-11 items-center hover:underline">{it.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
