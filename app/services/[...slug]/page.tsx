import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceView } from "@/components/ServiceView";
import { getServiceByPath, getServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string[] }> };

/** true: a page that exists only in Sanity (a new post, or a scratch draft in preview) renders on demand; unknown slugs still 404. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getServices();
  return services.filter((s) => s.path.startsWith("/services/")).map((s) => ({ slug: s.path.replace(/^\/services\/|\/$/g, "").split("/") }));
}

async function load(params: Props["params"]) {
  const { slug } = await params;
  return getServiceByPath(`/services/${slug.join("/")}/`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await load(params);
  if (!s) return {};
  return buildMetadata({ title: s.seo.title, description: s.seo.description, path: s.path, image: s.hero.image.src, noindex: s.seo.noindex });
}

export default async function ServicePage({ params }: Props) {
  const s = await load(params);
  if (!s) notFound();
  return <ServiceView s={s} />;
}
