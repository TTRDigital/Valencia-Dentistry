import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("services");
  if (!page) return {};
  return buildMetadata({ title: page.seo.title ?? page.title, description: page.seo.description ?? "", path: "/services/", image: "/images/team/dr-lavi.jpg" });
}

export default async function ServicesPage() {
  const page = await getPage("services");
  if (!page) notFound();
  return <PageView page={page} />;
}
