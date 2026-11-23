import "server-only";
import { draftMode } from "next/headers";
import { cache } from "react";
import { sanityConfigured } from "@/sanity/env";
import type { BeforeAfterCase, LegalPage, Navigation, Page, Person, Post, Service, Testimonial } from "../types";
import { local } from "./local";
import { fromSanity } from "./sanity";

/**
 * Content accessors. When the Sanity project is configured (sanity/env.ts)
 * and reachable, documents come from the CMS; otherwise, and for any
 * collection the CMS does not have yet, the built-in JSON in content/ is used,
 * so the site looks the same until the dataset is seeded.
 *
 * Visitors see published documents only. In draft preview (a signed TTR OS
 * link, app/api/preview) drafts are laid over the published documents, and
 * over the built-in ones by slug/id, so a single scratch draft renders in
 * place without the rest of the collection disappearing before the seed.
 * Every accessor is memoized per request (React cache).
 */
export const isPreview = cache(async (): Promise<boolean> => {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request (generateStaticParams, build)
  }
});

const keyOf = (d: unknown): string | undefined => {
  const o = d as { slug?: unknown; id?: unknown; _id?: unknown };
  const k = o?.slug ?? o?.id ?? o?._id;
  return typeof k === "string" ? k : undefined;
};

/** Sanity documents win; built-in documents the CMS does not have are kept, in their place. */
function overlay<T>(cms: T[], builtIn: T[]): T[] {
  const byKey = new Map(cms.map((d) => [keyOf(d), d] as const).filter(([k]) => k));
  const used = new Set<string>();
  const out = builtIn.map((d) => {
    const k = keyOf(d);
    const hit = k ? byKey.get(k) : undefined;
    if (hit && k) used.add(k);
    return hit ?? d;
  });
  return [...out, ...cms.filter((d) => !used.has(keyOf(d) ?? ""))];
}

async function collection<T>(name: keyof typeof local, fallback: () => T[]): Promise<T[]> {
  if (sanityConfigured) {
    const preview = await isPreview();
    try {
      const docs = await fromSanity<T>(name, preview);
      if (docs && docs.length) return preview ? overlay(docs, fallback()) : docs;
    } catch (err) {
      console.warn(`[content] Sanity unavailable for ${name}, using built-in content:`, (err as Error).message);
    }
  }
  return fallback();
}

export const getServices = cache(() => collection<Service>("services", local.services));
export const getPosts = cache(() => collection<Post>("posts", local.posts));
export const getPages = cache(() => collection<Page>("pages", local.pages));
export const getLegalPages = cache(() => collection<LegalPage>("legal", local.legal));
export const getPeople = cache(() => collection<Person>("people", local.people));
export const getTestimonials = cache(() => collection<Testimonial>("testimonials", local.testimonials));
export const getCases = cache(() => collection<BeforeAfterCase>("cases", local.cases));
export const getNavigation = cache(async (): Promise<Navigation> => (await collection<Navigation>("navigation", () => [local.navigation()]))[0]);

export async function getService(slug: string) {
  return (await getServices()).find((s) => s.slug === slug);
}
export async function getServiceByPath(path: string) {
  return (await getServices()).find((s) => s.path === path);
}
export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug);
}
export async function getPage(slug: string) {
  return (await getPages()).find((p) => p.slug === slug);
}
export async function getLegalPage(slug: string) {
  return (await getLegalPages()).find((p) => p.slug === slug);
}
export async function getDoctor() {
  return (await getPeople())[0];
}
