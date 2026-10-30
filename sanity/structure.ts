import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Valencia Dentistry")
    .items([
      S.listItem().title("Pages").schemaType("page").child(S.documentTypeList("page").title("Pages").defaultOrdering([{ field: "path", direction: "asc" }])),
      S.listItem().title("Services").schemaType("service").child(S.documentTypeList("service").title("Services").defaultOrdering([{ field: "path", direction: "asc" }])),
      S.listItem().title("Blog posts").schemaType("post").child(S.documentTypeList("post").title("Blog posts").defaultOrdering([{ field: "datePublished", direction: "desc" }])),
      S.divider(),
      S.listItem().title("Doctor & team").schemaType("person").child(S.documentTypeList("person").title("Doctor & team")),
      S.listItem().title("Testimonials").schemaType("testimonial").child(S.documentTypeList("testimonial").title("Testimonials")),
      S.listItem().title("Before / after cases").schemaType("beforeAfterCase").child(S.documentTypeList("beforeAfterCase").title("Before / after cases")),
      S.listItem().title("FAQ library").schemaType("faq").child(S.documentTypeList("faq").title("FAQ library")),
      S.listItem().title("Legal pages").schemaType("legalPage").child(S.documentTypeList("legalPage").title("Legal pages")),
      S.divider(),
      S.listItem().title("Navigation").id("navigation").child(S.document().schemaType("navigation").documentId("navigation")),
      S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
