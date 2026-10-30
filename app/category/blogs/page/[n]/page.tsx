import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_PER_PAGE, BlogIndexPage } from "@/components/BlogIndexPage";
import { getPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ n: string }> };
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  const total = Math.ceil(posts.length / BLOG_PER_PAGE);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return buildMetadata({ title: `Dental Blog, page ${n} | Valencia Dentistry`, description: "More guides on implants, crowns, bridges, extractions and oral health from Valencia Dentistry in Santa Clarita, CA.", path: `/category/blogs/page/${n}/`, image: "/images/team/dr-lavi.jpg" });
}

export default async function BlogPaged({ params }: Props) {
  const { n } = await params;
  const page = Number(n);
  if (!Number.isInteger(page) || page < 2) notFound();
  return <BlogIndexPage page={page} />;
}
