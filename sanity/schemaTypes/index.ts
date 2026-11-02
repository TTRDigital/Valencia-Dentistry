import { defineArrayMember, defineField, defineType } from "sanity";
import { sections, sectionTypes } from "./sections";

/**
 * Document types. Field names match the built-in JSON content in content/
 * (lib/types.ts) so the site renders either source with the same code.
 */
const seoFields = [
  defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
];

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "Title tag", validation: (r) => r.max(60).warning("Keep titles at 60 characters or fewer") }),
    defineField({ name: "description", type: "text", rows: 3, title: "Meta description", validation: (r) => r.max(155).warning("Keep descriptions at 155 characters or fewer") }),
    defineField({ name: "ogImage", type: "siteImage", title: "Social share image (1200×630)" }),
    defineField({ name: "noindex", type: "boolean", title: "Hide from search engines", initialValue: false }),
    defineField({ name: "canonical", type: "url", title: "Canonical URL (leave empty unless this page duplicates another)" }),
  ],
});

export const siteImage = defineType({
  name: "siteImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", type: "string", title: "Alt text (describe the picture)", validation: (r) => r.required() }),
    defineField({ name: "focus", type: "string", title: "Focal point for cropping (CSS object-position, e.g. \"center 20%\")" }),
  ],
});

export const faqItem = defineType({ name: "faqItem", title: "FAQ", type: "object", fields: [defineField({ name: "q", type: "string", title: "Question", validation: (r) => r.required() }), defineField({ name: "a", type: "text", rows: 3, title: "Answer", validation: (r) => r.required() })], preview: { select: { title: "q" } } });
export const link = defineType({ name: "link", title: "Link", type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "string", title: "URL or path" }), defineField({ name: "description", type: "string" })], preview: { select: { title: "label", subtitle: "href" } } });
export const feature = defineType({ name: "feature", title: "Feature", type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "text", rows: 2 }), defineField({ name: "icon", type: "string", options: { list: ["bolt", "user", "tech", "tooth", "heart", "tag", "shield", "sparkle", "leaf", "smile", "calendar", "pin"] } })], preview: { select: { title: "title", subtitle: "text" } } });
export const step = defineType({ name: "step", title: "Step", type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "text", rows: 3 })] });
export const tableBlock = defineType({
  name: "table",
  title: "Table",
  type: "object",
  fields: [defineField({ name: "rows", type: "array", of: [defineArrayMember({ type: "object", name: "row", fields: [defineField({ name: "cells", type: "array", of: [{ type: "string" }] })] })] })],
  preview: { prepare: () => ({ title: "Table" }) },
});

export const richBody = defineType({
  name: "richBody",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({ type: "block", styles: [{ title: "Paragraph", value: "normal" }, { title: "Heading 2", value: "h2" }, { title: "Heading 3", value: "h3" }, { title: "Heading 4", value: "h4" }, { title: "Quote", value: "blockquote" }], lists: [{ title: "Bullets", value: "bullet" }, { title: "Numbered", value: "number" }], marks: { decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }], annotations: [{ name: "link", type: "object", title: "Link", fields: [{ name: "href", type: "string", title: "URL or path" }] }] } }),
    defineArrayMember({ type: "table" }),
  ],
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [{ name: "practice", title: "Practice", default: true }, { name: "offer", title: "Offer & booking" }, { name: "schema", title: "Business schema" }],
  fields: [
    defineField({ name: "name", type: "string", group: "practice", initialValue: "Valencia Dentistry" }),
    defineField({ name: "phone", type: "string", group: "practice", title: "Phone (display)" }),
    defineField({ name: "email", type: "string", group: "practice" }),
    defineField({ name: "address", type: "object", group: "practice", fields: [defineField({ name: "street", type: "string" }), defineField({ name: "city", type: "string" }), defineField({ name: "state", type: "string" }), defineField({ name: "zip", type: "string" })] }),
    defineField({ name: "hours", type: "array", group: "practice", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "days", type: "string" }), defineField({ name: "label", type: "string", title: "Hours (e.g. 8am – 5pm or Closed)" })] })] }),
    defineField({ name: "offer", type: "object", group: "offer", fields: [defineField({ name: "headline", type: "string" }), defineField({ name: "detail", type: "string" }), defineField({ name: "enabled", type: "boolean", initialValue: true })] }),
    defineField({ name: "bookingUrl", type: "url", group: "offer", title: "Online booking URL" }),
    defineField({ name: "social", type: "object", group: "practice", fields: [defineField({ name: "facebook", type: "url" }), defineField({ name: "instagram", type: "url" }), defineField({ name: "linkedin", type: "url" }), defineField({ name: "x", type: "url" })] }),
    defineField({ name: "rating", type: "object", group: "schema", title: "Google rating (keep in sync with Google)", fields: [defineField({ name: "value", type: "number" }), defineField({ name: "count", type: "number" })] }),
    defineField({ name: "areas", type: "array", group: "schema", of: [{ type: "string" }], title: "Areas served" }),
    defineField({ name: "priceRange", type: "string", group: "schema", initialValue: "$$" }),
  ],
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "header", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "string" }), defineField({ name: "mega", type: "boolean", title: "Opens the services mega menu" })] })] }),
    defineField({ name: "serviceGroups", title: "Services mega menu", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "href", type: "string" }), defineField({ name: "description", type: "string" }), defineField({ name: "items", type: "array", of: [{ type: "link" }] })] })] }),
    defineField({ name: "footer", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "items", type: "array", of: [{ type: "link" }] })] })] }),
    defineField({ name: "legal", type: "array", of: [{ type: "link" }] }),
  ],
});

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "string", group: "content", description: "home, about, contact…", validation: (r) => r.required() }),
    defineField({ name: "path", type: "string", group: "content", description: "URL, e.g. /about/", validation: (r) => r.required() }),
    defineField({ name: "breadcrumb", type: "string", group: "content" }),
    defineField({ name: "sections", type: "array", group: "content", of: sections.map((s) => defineArrayMember({ type: s })) }),
    ...seoFields,
  ],
  preview: { select: { title: "title", subtitle: "path" } },
});

const cardList = (name: string, title: string) => defineField({ name, title, type: "array", group: "content", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "text", rows: 3 }), defineField({ name: "image", type: "siteImage" })] })] });

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "name", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "path", type: "string", group: "content", description: "URL, e.g. /services/dental-implants/", validation: (r) => r.required() }),
    defineField({ name: "parentPath", type: "string", group: "content", initialValue: "/services/" }),
    defineField({ name: "category", type: "string", group: "content", options: { list: ["cosmetic", "restorative", "surgical", "holistic", "preventive"] } }),
    defineField({ name: "shortDescription", type: "string", group: "content", validation: (r) => r.max(90) }),
    defineField({ name: "hero", type: "object", group: "content", fields: [defineField({ name: "h1", type: "string" }), defineField({ name: "subtitle", type: "string" }), defineField({ name: "text", type: "text", rows: 3 }), defineField({ name: "image", type: "siteImage" })] }),
    defineField({ name: "intro", type: "object", group: "content", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] })] }),
    defineField({ name: "understanding", type: "object", group: "content", title: "Understanding (dark section with accordion)", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "intro", type: "text", rows: 3 }), defineField({ name: "image", type: "siteImage" }), defineField({ name: "bullets", type: "array", of: [{ type: "string" }] }), defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "text", rows: 3 })] })] })] }),
    defineField({ name: "why", type: "object", group: "content", title: "Why choose us", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "intro", type: "text", rows: 2 }), defineField({ name: "cards", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "text", rows: 3 }), defineField({ name: "image", type: "siteImage" })] })] })] }),
    defineField({ name: "process", type: "object", group: "content", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "intro", type: "text", rows: 2 }), defineField({ name: "steps", type: "array", of: [{ type: "step" }] })] }),
    defineField({ name: "candidate", type: "object", group: "content", title: "Good candidate banner", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "text", type: "text", rows: 3 }), defineField({ name: "bullets", type: "array", of: [{ type: "string" }] }), defineField({ name: "image", type: "siteImage" })] }),
    defineField({ name: "care", type: "object", group: "content", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "intro", type: "text", rows: 2 }), defineField({ name: "before", type: "array", of: [{ type: "string" }] }), defineField({ name: "after", type: "array", of: [{ type: "string" }] })] }),
    cardList("extraCards", "Additional cards"),
    defineField({ name: "extra", type: "array", group: "content", title: "Additional sections", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }] }), defineField({ name: "bullets", type: "array", of: [{ type: "string" }] })] })] }),
    defineField({ name: "faqs", type: "array", group: "content", of: [{ type: "faqItem" }] }),
    defineField({ name: "related", type: "array", group: "content", of: [{ type: "string" }], description: "Slugs of related services" }),
    defineField({ name: "cta", type: "object", group: "content", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "text", type: "text", rows: 2 }), defineField({ name: "buttonLabel", type: "string" })] }),
    defineField({ name: "seo", title: "SEO", type: "object", group: "seo", fields: [defineField({ name: "title", type: "string", validation: (r) => r.max(60).warning() }), defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.max(155).warning() }), defineField({ name: "noindex", type: "boolean" })] }),
  ],
  preview: { select: { title: "name", subtitle: "path" } },
});

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "path", type: "string", group: "content", description: "URL, e.g. /dental-implants-cost/" }),
    defineField({ name: "category", type: "string", group: "content", options: { list: ["Dental Implants", "Oral Surgery", "Restorative Dentistry", "Cosmetic Dentistry", "Preventive Care", "Patient Guides"] } }),
    defineField({ name: "tags", type: "array", group: "content", of: [{ type: "string" }] }),
    defineField({ name: "author", type: "string", group: "content", initialValue: "Dr. Neda Moezzi, DDS" }),
    defineField({ name: "datePublished", type: "datetime", group: "content" }),
    defineField({ name: "dateModified", type: "datetime", group: "content" }),
    defineField({ name: "photo", type: "siteImage", group: "content", title: "Hero image" }),
    defineField({ name: "image", type: "string", group: "content", title: "Built-in image path (used when no hero image is uploaded)" }),
    defineField({ name: "imageAlt", type: "string", group: "content" }),
    defineField({ name: "excerpt", type: "text", rows: 2, group: "content" }),
    defineField({ name: "keyTakeaways", type: "array", group: "content", of: [{ type: "string" }] }),
    defineField({ name: "body", type: "richBody", group: "content" }),
    defineField({ name: "faq", type: "array", group: "content", of: [{ type: "faqItem" }] }),
    defineField({ name: "relatedServices", type: "array", group: "content", of: [{ type: "string" }], description: "Service slugs" }),
    defineField({ name: "relatedPosts", type: "array", group: "content", of: [{ type: "string" }], description: "Post slugs" }),
    defineField({ name: "seoTitle", type: "string", group: "seo", validation: (r) => r.max(60).warning() }),
    defineField({ name: "description", type: "text", rows: 3, group: "seo", validation: (r) => r.max(155).warning() }),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});

export const person = defineType({
  name: "person",
  title: "Doctor / team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "slug", type: "string" }),
    defineField({ name: "credentials", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "image", type: "siteImage" }),
    defineField({ name: "bio", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "highlights", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "sameAs", type: "array", of: [{ type: "url" }], title: "Profile links" }),
    defineField({ name: "order", type: "number" }),
  ],
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "id", type: "string", title: "ID (slug)" }),
    defineField({ name: "author", type: "string" }),
    defineField({ name: "text", type: "text", rows: 5, description: "Copy the review exactly as written. Never invent reviews." }),
    defineField({ name: "rating", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "source", type: "string", initialValue: "Google", options: { list: ["Google"] } }),
    defineField({ name: "when", type: "string" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "author", subtitle: "text" } },
});

export const beforeAfterCase = defineType({
  name: "beforeAfterCase",
  title: "Before / after case",
  type: "document",
  fields: [
    defineField({ name: "id", type: "string", title: "ID (slug)" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "treatment", type: "string" }),
    defineField({ name: "before", type: "siteImage" }),
    defineField({ name: "after", type: "siteImage" }),
    defineField({ name: "note", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

export const faq = defineType({ name: "faq", title: "FAQ", type: "document", fields: [defineField({ name: "q", type: "string" }), defineField({ name: "a", type: "text" }), defineField({ name: "topic", type: "string" })], preview: { select: { title: "q" } } });

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", type: "string", group: "content" }),
    defineField({ name: "slug", type: "string", group: "content" }),
    defineField({ name: "path", type: "string", group: "content" }),
    defineField({ name: "updated", type: "date", group: "content" }),
    defineField({ name: "body", type: "text", rows: 30, group: "content", description: "Markdown" }),
    ...seoFields,
  ],
});

export const schemaTypes = [seo, siteImage, faqItem, link, feature, step, tableBlock, richBody, ...sectionTypes, siteSettings, navigation, page, service, post, person, testimonial, beforeAfterCase, faq, legalPage];
export const singletonTypes = new Set(["siteSettings", "navigation"]);
