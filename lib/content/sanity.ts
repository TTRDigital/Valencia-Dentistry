import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";
import { toMarkdown } from "../portable.ts";

/**
 * Reads from Sanity. Documents are stored in the same shape as the built-in
 * JSON (see sanity/schemaTypes), except images (Sanity assets, resolved to
 * URLs here) and post bodies (Portable Text, converted back to the same
 * markdown model the renderer uses).
 *
 * Visitors get published content only: the public dataset through the CDN,
 * cached for 5 minutes and refreshed at once by the publish webhook
 * (/api/revalidate, tag "sanity"). Drafts are read only in draft preview
 * (/api/preview, a signed TTR OS link), with SANITY_READ_TOKEN, uncached.
 */
export const client = sanityConfigured ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" }) : null;

let draftClient: SanityClient | null = null;
function previewClient(): SanityClient | null {
  const token = process.env.SANITY_READ_TOKEN;
  if (!client || !token) return null;
  return (draftClient ??= client.withConfig({ useCdn: false, token, perspective: "drafts" }));
}

const IMG = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "blurDataURL": asset->metadata.lqip, alt }`;

const QUERIES: Record<string, string> = {
  services: `*[_type == "service" && !(_id in path("drafts.**"))] | order(name asc) { ..., hero { ..., image ${IMG} }, understanding { ..., image ${IMG} }, why { ..., cards[] { ..., image ${IMG} } }, candidate { ..., image ${IMG} } }`,
  posts: `*[_type == "post" && !(_id in path("drafts.**"))] | order(datePublished desc) { ..., "image": coalesce(photo.asset->url, image), "imageAlt": coalesce(photo.alt, imageAlt), "bodyPT": body, "body": "" }`,
  pages: `*[_type == "page" && !(_id in path("drafts.**"))] { ..., sections[] { ..., image ${IMG}, images[] ${IMG} } }`,
  legal: `*[_type == "legalPage" && !(_id in path("drafts.**"))] { ... }`,
  people: `*[_type == "person" && !(_id in path("drafts.**"))] | order(order asc) { ..., image ${IMG} }`,
  testimonials: `*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(order asc) { ..., "id": coalesce(id, _id), avatar ${IMG} }`,
  cases: `*[_type == "beforeAfterCase" && !(_id in path("drafts.**"))] | order(order asc) { ..., "id": coalesce(id, _id), before ${IMG}, after ${IMG} }`,
  navigation: `*[_type == "navigation" && _id == "navigation"] { ... }`,
};

export async function fromSanity<T>(name: string, drafts = false): Promise<T[] | null> {
  const q = QUERIES[name];
  if (!client || !q) return null;
  const preview = drafts ? previewClient() : null;
  const docs = preview
    ? await preview.fetch<Record<string, unknown>[]>(q, {}, { cache: "no-store" })
    : await client.fetch<Record<string, unknown>[]>(q, {}, { next: { revalidate: 300, tags: ["sanity", name] } });
  if (name === "posts") {
    for (const d of docs) if (Array.isArray(d.bodyPT)) d.body = toMarkdown(d.bodyPT as never);
  }
  return docs as T[];
}
