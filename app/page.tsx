import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import { getPage } from "@/lib/content";
import { buildMetadata, dentistNode, personNode, websiteNode } from "@/lib/seo";
import { CLIENT } from "@/lib/clientPhotos";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  if (!page) return {};
  return buildMetadata({ title: page.seo?.title || page.title, description: page.seo?.description ?? "", path: "/", image: CLIENT.reception.src });
}

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();
  // No rating or review structured data (TTR rule); the visible reviews section is unchanged.
  return <PageView page={page} extraNodes={[websiteNode(), dentistNode(), personNode()]} />;
}
