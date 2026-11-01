import type { Metadata } from "next";
import { absoluteUrl, SITE_URL, site } from "./site";
import type { Faq, Post, Service } from "./types";

/* ---------- Metadata ---------- */

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string; // absolute or site path; defaults to the generated OG image for the page
  noindex?: boolean;
  canonical?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function ogImageFor(path: string, title: string, subtitle?: string) {
  const q = new URLSearchParams({ title, ...(subtitle ? { subtitle } : {}) });
  return `/og/?${q.toString()}&p=${encodeURIComponent(path)}`;
}

export function buildMetadata(m: PageMeta): Metadata {
  const url = absoluteUrl(m.canonical ?? m.path);
  const image = absoluteUrl(m.image ?? ogImageFor(m.path, m.title));
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: url },
    robots: m.noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    openGraph: {
      title: m.title,
      description: m.description,
      url,
      siteName: site.name,
      type: m.type ?? "website",
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: m.title }],
      ...(m.type === "article" ? { publishedTime: m.publishedTime, modifiedTime: m.modifiedTime, authors: [site.doctor.name] } : {}),
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.description, images: [image] },
  };
}

/* ---------- JSON-LD ---------- */

export const IDS = {
  dentist: `${SITE_URL}/#dentist`,
  person: `${SITE_URL}/#dr-neda-moezzi`,
  website: `${SITE_URL}/#website`,
};

export function dentistNode(withRating = false) {
  return {
    "@type": ["Dentist", "LocalBusiness"],
    "@id": IDS.dentist,
    name: site.name,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/images/team/dr-lavi.jpg`,
    telephone: site.phone.tel,
    email: site.email,
    priceRange: site.priceRange,
    address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.state, postalCode: site.address.zip, addressCountry: site.address.country },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" }],
    areaServed: site.areas.map((a) => ({ "@type": "City", name: a })),
    sameAs: Object.values(site.social),
    founder: { "@id": IDS.person },
    employee: { "@id": IDS.person },
    medicalSpecialty: ["Dentistry"],
    paymentAccepted: "Cash, Credit Card, Insurance, Financing",
    currenciesAccepted: "USD",
    // aggregateRating is printed only on pages that visibly show reviews and the rating (Google's guideline).
    ...(withRating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5, worstRating: 1 } } : {}),
  };
}

export function personNode() {
  return {
    "@type": "Person",
    "@id": IDS.person,
    name: site.doctor.name,
    givenName: site.doctor.firstName,
    familyName: site.doctor.lastName,
    honorificSuffix: site.doctor.credentials,
    jobTitle: "Dentist",
    image: `${SITE_URL}/images/team/dr-lavi.jpg`,
    worksFor: { "@id": IDS.dentist },
    ...(site.doctor.school ? { alumniOf: { "@type": "CollegeOrUniversity", name: site.doctor.school } } : {}),
    url: `${SITE_URL}/about/`,
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function faqNode(faqs: Faq[]) {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceNode(s: Service) {
  return {
    "@type": "MedicalProcedure",
    "@id": `${absoluteUrl(s.path)}#service`,
    name: s.name,
    description: s.seo.description,
    url: absoluteUrl(s.path),
    image: absoluteUrl(s.hero.image.src),
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: "Mouth",
    provider: { "@id": IDS.dentist },
    howPerformed: s.process.steps.map((st) => st.title).join("; ") || undefined,
    areaServed: site.areas.map((a) => ({ "@type": "City", name: a })),
  };
}

export function serviceOfferNode(s: Service) {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(s.path)}#offer`,
    serviceType: s.name,
    name: s.name,
    description: s.shortDescription,
    url: absoluteUrl(s.path),
    provider: { "@id": IDS.dentist },
    areaServed: site.areas.map((a) => ({ "@type": "City", name: a })),
  };
}

export function articleNode(p: Post, wordCount: number) {
  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(p.path)}#article`,
    headline: p.title,
    description: p.description,
    image: absoluteUrl(p.image),
    datePublished: p.datePublished,
    dateModified: p.dateModified || p.datePublished,
    author: { "@id": IDS.person },
    publisher: { "@id": IDS.dentist },
    mainEntityOfPage: absoluteUrl(p.path),
    articleSection: p.category,
    keywords: p.tags.join(", "),
    wordCount,
    inLanguage: "en-US",
  };
}

export function webPageNode(path: string, name: string, description: string) {
  return { "@type": "WebPage", "@id": `${absoluteUrl(path)}#webpage`, url: absoluteUrl(path), name, description, isPartOf: { "@id": IDS.website }, about: { "@id": IDS.dentist }, inLanguage: "en-US" };
}

export function websiteNode() {
  return { "@type": "WebSite", "@id": IDS.website, url: `${SITE_URL}/`, name: site.name, publisher: { "@id": IDS.dentist }, inLanguage: "en-US" };
}

/** Builds the page graph. The WebSite, Dentist and Person nodes are included on every page so @id references always resolve. */
export function graph(nodes: (Record<string, unknown> | null | undefined)[]) {
  const given = nodes.filter((n): n is Record<string, unknown> => !!n);
  const has = (id: string) => given.some((n) => n["@id"] === id);
  const base = [!has(IDS.website) && websiteNode(), !has(IDS.dentist) && dentistNode(false), !has(IDS.person) && personNode()].filter(Boolean) as Record<string, unknown>[];
  return { "@context": "https://schema.org", "@graph": [...base, ...given] };
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
