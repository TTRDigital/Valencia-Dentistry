import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalView } from "@/components/LegalView";
import { PageView } from "@/components/PageView";
import { PostView } from "@/components/PostView";
import { getLegalPage, getLegalPages, getPage, getPages, getPost, getPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

/**
 * Root-level URLs: flexible pages (/about/, /contact/ …), legal pages and the
 * blog posts, which live at the site root on the current site (/dental-implants-cost/).
 */
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export async function generateStaticParams() {
  const [pages, legal, posts] = await Promise.all([getPages(), getLegalPages(), getPosts()]);
  const slugs = [...pages.filter((p) => /^\/[^/]+\/$/.test(p.path)).map((p) => p.slug), ...legal.map((l) => l.slug), ...posts.map((p) => p.slug)];
  return slugs.map((slug) => ({ slug }));
}

async function resolve(slug: string) {
  const page = await getPage(slug);
  if (page && page.path === `/${slug}/`) return { kind: "page" as const, page };
  const legal = await getLegalPage(slug);
  if (legal) return { kind: "legal" as const, legal };
  const post = await getPost(slug);
  if (post) return { kind: "post" as const, post };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) return {};
  if (r.kind === "page") return buildMetadata({ title: r.page.seo.title ?? r.page.title, description: r.page.seo.description ?? "", path: r.page.path, noindex: r.page.seo.noindex, image: r.page.seo.ogImage?.src });
  if (r.kind === "legal") return buildMetadata({ title: r.legal.seo.title ?? r.legal.title, description: r.legal.seo.description ?? "", path: r.legal.path, noindex: r.legal.seo.noindex });
  return buildMetadata({ title: r.post.seoTitle, description: r.post.description, path: r.post.path, image: r.post.image, type: "article", publishedTime: r.post.datePublished, modifiedTime: r.post.dateModified });
}

export default async function RootSlugPage({ params }: Props) {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) notFound();
  if (r.kind === "page") return <PageView page={r.page} />;
  if (r.kind === "legal") return <LegalView page={r.legal} />;
  return <PostView post={r.post} />;
}
