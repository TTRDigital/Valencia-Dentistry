import type { Metadata } from "next";
import Link from "next/link";
import { getLegalPages, getPages, getPosts, getServices } from "@/lib/content";
import { breadcrumbNode, buildMetadata, graph, JsonLd, webPageNode } from "@/lib/seo";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = buildMetadata({ title: "Sitemap | Valencia Dentistry", description: "Every page on the Valencia Dentistry website: services, about, blog articles, contact and legal pages.", path: "/sitemap/" });

export default async function SitemapPage() {
  const [services, posts, pages, legal] = await Promise.all([getServices(), getPosts(), getPages(), getLegalPages()]);
  const groups = [
    { title: "Pages", items: [{ label: "Home", href: "/" }, ...pages.filter((p) => p.path !== "/" && !p.seo.noindex).map((p) => ({ label: p.title, href: p.path })), { label: "Blog", href: "/category/blogs/" }, ...legal.map((l) => ({ label: l.title, href: l.path }))] },
    { title: "Services", items: [{ label: "All services", href: "/services/" }, ...services.map((s) => ({ label: s.name, href: s.path }))] },
    { title: "Blog articles", items: posts.map((p) => ({ label: p.title, href: p.path })) },
  ];
  return (
    <>
      <Section className="border-b hairline bg-warm" tight>
        <Container><SectionHeading as="h1" eyebrow="Sitemap" heading="Everything on this site" lead="A full list of our pages, services and articles." /></Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 md:grid-cols-3">
            {groups.map((g) => (
              <nav key={g.title} aria-labelledby={`sm-${g.title}`}>
                <h2 id={`sm-${g.title}`} className="text-2xl">{g.title}</h2>
                <ul className="mt-5 space-y-2.5">{g.items.map((it) => <li key={it.href}><Link href={it.href} className="text-grey-700 underline-offset-4 hover:text-ink-900 hover:underline">{it.label}</Link></li>)}</ul>
              </nav>
            ))}
          </div>
        </Container>
      </Section>
      <JsonLd data={graph([webPageNode("/sitemap/", "Sitemap", "All pages on the site"), breadcrumbNode([{ name: "Home", path: "/" }, { name: "Sitemap", path: "/sitemap/" }])])} />
    </>
  );
}
