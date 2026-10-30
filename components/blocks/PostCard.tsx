import Link from "next/link";
import type { Post } from "@/lib/types";

type CardPost = Pick<Post, "slug" | "path" | "title" | "excerpt" | "category" | "datePublished" | "image" | "imageAlt">;
import { formatDate } from "@/lib/utils";
import { Picture } from "@/components/ui/Picture";

export function PostCard({ post, priority }: { post: CardPost; priority?: boolean }) {
  return (
    <li className="card card-hover group overflow-hidden">
      <Link href={post.path} className="flex h-full flex-col no-underline">
        <div className="relative aspect-[16/9] overflow-hidden bg-greige-50">
          <Picture image={{ src: post.image, alt: post.imageAlt }} fill priority={priority} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" quality={60} />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-olive-600">{post.category}</p>
          <h3 className="mt-2 text-xl leading-snug group-hover:text-olive-600">{post.title}</h3>
          <p className="mt-2 flex-1 text-[0.95rem] text-grey-600">{post.excerpt}</p>
          <p className="mt-4 text-xs text-grey-600"><time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time></p>
        </div>
      </Link>
    </li>
  );
}
