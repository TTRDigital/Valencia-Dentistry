import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/BlogIndexPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dental Blog | Valencia Dentistry, Santa Clarita",
  description: "Guides on dental implants, crowns, bridges, extractions, bone grafting and oral health from Valencia Dentistry in Santa Clarita, CA.",
  path: "/category/blogs/",
  image: "/images/client/01-reception-logo-wall.jpg",
});

export default function BlogPage() {
  return <BlogIndexPage page={1} />;
}
