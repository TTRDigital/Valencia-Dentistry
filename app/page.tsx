import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import { getPage } from "@/lib/content";
import { buildMetadata, dentistNode, personNode, websiteNode } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  if (!page) return {};
  return buildMetadata({ title: page.seo.title ?? page.title, description: page.seo.description ?? "", path: "/", image: "/images/team/dr-lavi.jpg" });
}

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();
  // The home page shows the Google rating and reviews, so aggregateRating is allowed here.
  return <PageView page={page} extraNodes={[websiteNode(), dentistNode(true), personNode()]} />;
}
