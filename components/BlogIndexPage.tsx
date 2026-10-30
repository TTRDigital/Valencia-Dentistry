import { notFound } from "next/navigation";
import { getPosts } from "@/lib/content";
import { breadcrumbNode, graph, JsonLd, webPageNode } from "@/lib/seo";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { BlogIndex } from "@/components/blocks/BlogIndex";

export const BLOG_PER_PAGE = 9;

export async function BlogIndexPage({ page }: { page: number }) {
  const posts = await getPosts();
  const total = Math.max(1, Math.ceil(posts.length / BLOG_PER_PAGE));
  if (page < 1 || page > total) notFound();
  const categories = [...new Set(posts.map((p) => p.category))];
  const path = page === 1 ? "/category/blogs/" : `/category/blogs/page/${page}/`;
  return (
    <>
      <Section className="border-b hairline bg-warm" tight>
        <Container>
          <SectionHeading as="h1" eyebrow="Blog" heading={page > 1 ? `Dental advice from Valencia, page ${page}` : "Dental advice from Dr. Moezzi"} lead="Plain-English guides on implants, crowns, bridges, extractions and everyday oral health, written for Santa Clarita patients." />
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <BlogIndex posts={posts.map((p) => ({ slug: p.slug, path: p.path, title: p.title, excerpt: p.excerpt, category: p.category, tags: p.tags, datePublished: p.datePublished, image: p.image, imageAlt: p.imageAlt }))} page={page} categories={categories} />
        </Container>
      </Section>
      <JsonLd data={graph([webPageNode(path, "Blog | Valencia Dentistry", "Dental advice from Dr. Neda Moezzi"), breadcrumbNode([{ name: "Home", path: "/" }, { name: "Blog", path: "/category/blogs/" }])])} />
    </>
  );
}
