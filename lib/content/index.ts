import "server-only";
import { cache } from "react";
import { sanityConfigured } from "@/sanity/env";
import type { BeforeAfterCase, LegalPage, Navigation, Page, Person, Post, Service, Testimonial } from "../types";
import { local } from "./local";
import { fromSanity } from "./sanity";

/**
 * Content accessors. When the Sanity project is configured (sanity/env.ts)
 * and reachable, documents come from the CMS; otherwise, and for any
 * collection the CMS does not have yet, the built-in JSON in content/ is used.
 * Every accessor is memoized per request (React cache).
 */
async function collection<T>(name: keyof typeof local, fallback: () => T[]): Promise<T[]> {
  if (sanityConfigured) {
    try {
      const docs = await fromSanity<T>(name);
      if (docs && docs.length) return docs;
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
