import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";
import { toMarkdown } from "../portable.ts";

/**
 * Reads from Sanity. Documents are stored in the same shape as the built-in
 * JSON (see sanity/schemaTypes), except images (Sanity assets, resolved to
 * URLs here) and post bodies (Portable Text, converted back to the same
 * markdown model the renderer uses).
 */
export const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published", token: process.env.SANITY_READ_TOKEN || undefined })
  : null;

const IMG = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "blurDataURL": asset->metadata.lqip, alt }`;

const QUERIES: Record<string, string> = {
  services: `*[_type == "service" && !(_id in path("drafts.**"))] | order(name asc) { ..., "hero": hero { ..., "image": coalesce(photo.asset->url, image) } }`,
  posts: `*[_type == "post" && !(_id in path("drafts.**"))] | order(datePublished desc) { ..., "image": coalesce(photo.asset->url, image), "imageAlt": coalesce(photo.alt, imageAlt), "bodyPT": body, "body": "" }`,
  pages: `*[_type == "page" && !(_id in path("drafts.**"))] { ..., sections[] { ..., image ${IMG}, images[] ${IMG} } }`,
  legal: `*[_type == "legalPage" && !(_id in path("drafts.**"))] { ... }`,
  people: `*[_type == "person" && !(_id in path("drafts.**"))] | order(order asc) { ..., image ${IMG} }`,
  testimonials: `*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(order asc) { ..., "id": coalesce(id, _id), avatar ${IMG} }`,
  cases: `*[_type == "beforeAfterCase" && !(_id in path("drafts.**"))] | order(order asc) { ..., "id": coalesce(id, _id), before ${IMG}, after ${IMG} }`,
  navigation: `*[_type == "navigation" && _id == "navigation"] { ... }`,
};

export async function fromSanity<T>(name: string): Promise<T[] | null> {
  if (!client) return null;
  const q = QUERIES[name];
  if (!q) return null;
  const docs = await client.fetch<Record<string, unknown>[]>(q, {}, { next: { revalidate: 300, tags: ["sanity", name] } });
  if (name === "posts") {
    for (const d of docs) if (Array.isArray(d.bodyPT)) d.body = toMarkdown(d.bodyPT as never);
  }
  return docs as T[];
}
