import type { Page } from "@/lib/types";
import { breadcrumbNode, graph, JsonLd, webPageNode } from "@/lib/seo";
import { Sections } from "@/components/sections";

/** Renders a flexible Page document plus its WebPage/Breadcrumb JSON-LD. */
export function PageView({ page, extraNodes = [] }: { page: Page; extraNodes?: Record<string, unknown>[] }) {
  const crumbs = page.path === "/" ? [{ name: "Home", path: "/" }] : [{ name: "Home", path: "/" }, { name: page.breadcrumb ?? page.title, path: page.path }];
  return (
    <>
      {/* The home page uses one heading voice throughout, taken from the "A New Standard" band (APA Aesthetic) */}
      <div className={page.path === "/" ? "home-apa" : undefined}>
        <Sections sections={page.sections} crumbs={page.path === "/" ? undefined : crumbs} />
      </div>
      <JsonLd data={graph([webPageNode(page.path, page.seo.title ?? page.title, page.seo.description ?? ""), breadcrumbNode(crumbs), ...extraNodes])} />
    </>
  );
}
