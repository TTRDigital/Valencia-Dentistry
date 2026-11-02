import Link from "next/link";
import type { Post, Service } from "@/lib/types";
import { getPosts, getServices } from "@/lib/content";
import { plainText, tableOfContents } from "@/lib/markdown";
import { articleNode, breadcrumbNode, faqNode, graph, JsonLd, webPageNode } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate, readingTime } from "@/lib/utils";
import { Markdown } from "@/components/blocks/Markdown";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Container } from "@/components/ui/Section";
import { FaqList } from "@/components/sections/Faq";
import { Breadcrumbs } from "@/components/ServiceView";
import { PostCard } from "@/components/blocks/PostCard";

export async function PostView({ post }: { post: Post }) {
  const [posts, services] = await Promise.all([getPosts(), getServices()]);
  const related = post.relatedPosts.map((s) => posts.find((p) => p.slug === s)).filter((p): p is Post => !!p && p.slug !== post.slug).slice(0, 3);
  const fallback = posts.filter((p) => p.slug !== post.slug && p.category === post.category && !related.includes(p)).slice(0, 3 - related.length);
  const relatedServices = post.relatedServices.map((s) => services.find((x) => x.slug === s)).filter((x): x is Service => !!x);
  const toc = tableOfContents(post.body);
  const text = plainText(post.body);
  const minutes = readingTime(text);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/category/blogs/" }, { name: post.title, path: post.path }];

  return (
    <article>
      <header className="border-b hairline bg-warm">
        <Container>
          <div className="mx-auto max-w-[64rem] pt-8 pb-10 lg:pt-12 lg:pb-14"><div className="max-w-[52rem]">
            <Breadcrumbs items={crumbs} />
            <p className="eyebrow mt-8 mb-4">{post.category}</p>
            <h1 className="text-5xl">{post.title}</h1>
            <p className="lead mt-5">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-grey-600">
              <span className="inline-flex items-center gap-2"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-greige-100 text-xs font-semibold text-olive-700" aria-hidden="true">NL</span>By <span className="font-semibold text-ink-900">{post.author}</span></span>
              <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
              {post.dateModified && post.dateModified > post.datePublished && <span>Updated {formatDate(post.dateModified)}</span>}
              <span>{minutes} min read</span>
            </div>
          </div></div>
        </Container>
      </header>

      <Container>
        <div className="mx-auto -mt-0 max-w-[64rem] pt-8">
          <div className="overflow-hidden rounded-lg">
            <Picture image={{ src: post.image, alt: post.imageAlt }} priority sizes="(min-width: 1024px) 1024px, 100vw" className="aspect-[3/2] w-full object-cover object-[50%_15%] sm:aspect-[16/9]" quality={80} />
          </div>
        </div>

        <div className="mx-auto grid max-w-[64rem] grid-cols-1 gap-12 py-[var(--section-y-tight)] lg:grid-cols-12">
          {/* Phones: the article comes first; the contents list and booking card follow it. */}
          <aside className="order-last min-w-0 lg:order-first lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              {toc.length > 2 && (
                <nav aria-label="Table of contents" className="card p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-olive-600">In this article</p>
                  <ol className="mt-3 text-base sm:text-[0.95rem]">
                    {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="flex min-h-11 items-center py-1 text-grey-700 hover:text-ink-900 hover:underline">{h.text}</a></li>)}
                  </ol>
                </nav>
              )}
              <div className="dark-section rounded-3xl p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bronze-300">Talk to Dr. Lavi</p>
                <p className="mt-2 text-white/80">Questions about your own situation? A new patient visit includes an exam, X-rays and an unhurried consultation.</p>
                <Button href={site.bookingUrl} variant="light" className="mt-4 w-full" arrow>Book online</Button>
                <a href={`tel:${site.phone.tel}`} className="mt-2 flex min-h-11 items-center justify-center text-sm text-white/80 hover:text-white">or call {site.phone.display}</a>
              </div>
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-8">
            {post.keyTakeaways.length > 0 && (
              <section aria-labelledby="takeaways" className="mb-10 rounded-3xl border border-bronze-300/70 bg-sand-50 p-6 sm:p-7">
                <h2 id="takeaways" className="font-sans text-base font-semibold uppercase tracking-[0.14em] text-bronze-600">Key takeaways</h2>
                <ul className="mt-4 space-y-2.5">
                  {post.keyTakeaways.map((k) => <li key={k} className="flex items-start gap-3 text-grey-700"><Icon.check className="mt-1 h-4 w-4 shrink-0 text-olive-600" />{k}</li>)}
                </ul>
              </section>
            )}
            <Markdown source={post.body} />

            {post.faq.length > 0 && (
              <section aria-labelledby="post-faq" className="mt-14">
                <h2 id="post-faq" className="text-3xl">Frequently asked questions</h2>
                <FaqList items={post.faq} className="mt-6" />
              </section>
            )}

            {relatedServices.length > 0 && (
              <section aria-labelledby="related-services" className="mt-14">
                <h2 id="related-services" className="font-sans text-base font-semibold uppercase tracking-[0.14em] text-olive-600">Related services</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {relatedServices.map((s) => <li key={s.slug}><Link href={s.path} className="inline-flex min-h-11 items-center rounded-full border hairline bg-white px-4 text-sm font-medium text-ink-900 hover:border-olive-600 hover:text-olive-600">{s.name}</Link></li>)}
                </ul>
              </section>
            )}

            <section aria-labelledby="author" className="mt-14 flex flex-col gap-5 rounded-3xl bg-greige-50/70 p-6 sm:flex-row sm:p-7">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                <Picture image={{ src: "/images/team/dr-lavi-portrait.jpg", alt: "Dr. Nuriel Lavi, DDS" }} sizes="96px" className="h-full w-full object-cover object-top" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-olive-600">About the author</p>
                <h2 id="author" className="mt-1 text-xl">{site.doctor.name}</h2>
                <p className="mt-2 text-base sm:text-[0.95rem] text-grey-700">Dentist and owner of Valencia Dentistry in Santa Clarita. Dr. Lavi practices holistic, one-on-one dentistry with a focus on implants, cosmetic care and prevention.</p>
                <Link href="/about/" className="link-arrow mt-1 text-sm">Meet Dr. Lavi <Icon.arrow className="h-4 w-4" /></Link>
              </div>
            </section>
            <p className="mt-8 text-base text-grey-600 sm:text-sm">This article is for general information and does not replace an examination. Treatment recommendations, timelines and costs depend on your individual situation.</p>
          </div>
        </div>
      </Container>

      {(related.length + fallback.length) > 0 && (
        <section className="section-tight border-t hairline bg-white" aria-labelledby="related-posts">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <h2 id="related-posts" className="text-3xl">Keep reading</h2>
              <Link href="/category/blogs/" className="link-arrow text-sm">All articles <Icon.arrow className="h-4 w-4" /></Link>
            </div>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">{[...related, ...fallback].map((p) => <PostCard key={p.slug} post={p} />)}</ul>
          </Container>
        </section>
      )}

      <JsonLd data={graph([webPageNode(post.path, post.seoTitle, post.description), breadcrumbNode(crumbs), articleNode(post, text.split(/\s+/).length), faqNode(post.faq)])} />
    </article>
  );
}
