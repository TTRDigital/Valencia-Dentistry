import "server-only";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { BeforeAfterCase, LegalPage, Navigation, Page, Person, Post, Service, Testimonial } from "../types";

/** Built-in content: the JSON files in content/ (also the source for `npm run seed`). */
const ROOT = join(process.cwd(), "content");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(ROOT, file), "utf8")) as T;
}

function readDir<T>(dir: string): T[] {
  const d = join(ROOT, dir);
  if (!existsSync(d)) return [];
  return readdirSync(d)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(d, f), "utf8")) as T);
}

export const local = {
  services: (): Service[] => readDir<Service>("services"),
  posts: (): Post[] => readDir<Post>("posts").sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1)),
  pages: (): Page[] => readDir<Page>("pages"),
  legal: (): LegalPage[] => readDir<LegalPage>("legal"),
  people: (): Person[] => readJson<Person[]>("people.json"),
  testimonials: (): Testimonial[] => readJson<Testimonial[]>("testimonials.json"),
  cases: (): BeforeAfterCase[] => readJson<BeforeAfterCase[]>("cases.json"),
  navigation: (): Navigation => readJson<Navigation>("navigation.json"),
};
