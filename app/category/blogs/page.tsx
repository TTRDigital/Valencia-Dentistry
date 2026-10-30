import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/BlogIndexPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dental Blog | Advice from Dr. Nuriel Lavi, Valencia",
  description: "Guides on dental implants, crowns, bridges, extractions, bone grafting and oral health from Valencia Dentistry in Santa Clarita, CA.",
  path: "/category/blogs/",
  image: "/images/team/dr-lavi.jpg",
});

export default function BlogPage() {
  return <BlogIndexPage page={1} />;
}
