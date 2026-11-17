import Link from "next/link";
import type { Post } from "@/lib/types";

type CardPost = Pick<Post, "slug" | "path" | "title" | "excerpt" | "category" | "datePublished" | "image" | "imageAlt">;
import { formatDate } from "@/lib/utils";
import { Picture } from "@/components/ui/Picture";
import { Icon } from "@/components/ui/Icons";

export function PostCard({ post, priority, headingLevel = 3 }: { post: CardPost; priority?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <li className="card card-hover group">
      <Link href={post.path} className="flex h-full flex-col no-underline">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg bg-greige-50">
          {post.image ? (
            <Picture image={{ src: post.image, alt: post.imageAlt }} fill priority={priority} sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          ) : (
            // Neutral illustration (no office photo): olive panel with the tooth mark and the topic
            <span aria-hidden="true" className="flex h-full w-full flex-col items-center justify-center gap-3 bg-olive-900 text-white transition-colors duration-500 group-hover:bg-olive-800">
              <Icon.tooth className="h-12 w-12 text-bronze-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{post.category}</span>
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-olive-600">{post.category}</p>
          <H className="mt-2 text-2xl group-hover:text-olive-600">{post.title}</H>
          <p className="mt-2 text-base text-grey-600 sm:text-[0.95rem]">{post.excerpt}</p>
          <p className="card-action pt-4 text-xs text-grey-600"><time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time></p>
        </div>
      </Link>
    </li>
  );
}
