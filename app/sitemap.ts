import type { MetadataRoute } from "next";
import { getLegalPages, getPages, getPosts, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

const STATIC: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/services/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/category/blogs/", priority: 0.7, changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, pages, legal] = await Promise.all([getServices(), getPosts(), getPages(), getLegalPages()]);
  const now = new Date();
  const rows: MetadataRoute.Sitemap = STATIC.map((s) => ({ url: absoluteUrl(s.path), lastModified: now, priority: s.priority, changeFrequency: s.changeFrequency }));
  for (const p of pages) if (p.path !== "/" && !p.seo.noindex) rows.push({ url: absoluteUrl(p.path), lastModified: now, priority: 0.8, changeFrequency: "monthly" });
  for (const s of services) rows.push({ url: absoluteUrl(s.path), lastModified: now, priority: 0.8, changeFrequency: "monthly" });
  for (const l of legal) if (!l.seo.noindex) rows.push({ url: absoluteUrl(l.path), lastModified: now, priority: 0.3, changeFrequency: "yearly" });
  for (const p of posts) rows.push({ url: absoluteUrl(p.path), lastModified: new Date(p.dateModified || p.datePublished), priority: 0.6, changeFrequency: "monthly" });
  return rows;
}
