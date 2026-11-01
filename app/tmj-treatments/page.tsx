import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceView } from "@/components/ServiceView";
import { getService } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getService("tmj-treatments");
  if (!s) return {};
  return buildMetadata({ title: s.seo.title, description: s.seo.description, path: s.path, image: s.hero.image.src });
}

export default async function TmjPage() {
  const s = await getService("tmj-treatments");
  if (!s) notFound();
  return <ServiceView s={s} />;
}
