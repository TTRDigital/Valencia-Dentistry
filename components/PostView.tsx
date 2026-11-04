import Link from "next/link";
import type { Post, Service } from "@/lib/types";
import { getPosts, getServices } from "@/lib/content";
import { plainText, tableOfContents } from "@/lib/markdown";
import { articleNode, breadcrumbNode, faqNode, graph, JsonLd, webPageNode } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate, readingTime } from "@/lib/utils";
import { Markdown } from "@/components/blocks/Markdown";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Container } from "@/components/ui/Section";
import { FaqList } from "@/components/sections/Faq";
import { Breadcrumbs } from "@/components/ServiceView";
import { PostCard } from "@/components/blocks/PostCard";
import { sceneKey } from "@/lib/utils";

export async function PostView({ post }: { post: Post }) {
  const [posts, services] = await Promise.all([getPosts(), getServices()]);
  // three related posts, never showing the same photo as this post or each other
  const seenImg = new Set([sceneKey(post.image)]);
  const pickDistinct = (list: Post[], n: number) => list.filter((p) => { if (p.slug === post.slug || seenImg.has(sceneKey(p.image)) || n <= 0) return false; seenImg.add(sceneKey(p.image)); n -= 1; return true; });
  const related = pickDistinct(post.relatedPosts.map((s) => posts.find((p) => p.slug === s)).filter((p): p is Post => !!p), 3);
  const fallback = pickDistinct([...posts.filter((p) => p.category === post.category && !related.includes(p)), ...posts.filter((p) => !related.includes(p))], 3 - related.length);
  const relatedServices = post.relatedServices.map((s) => services.find((x) => x.slug === s)).filter((x): x is Service => !!x);
  const toc = tableOfContents(post.body);
  const text = plainText(post.body);
  const minutes = readingTime(text);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/category/blogs/" }, { name: post.title, path: post.path }];

  return (
    <article>
      {/* Header: tinted band, title and author on the left, the photo framed on the right */}
      <header className="border-b hairline bg-[linear-gradient(180deg,#dcd7cd_0%,#e6e2da_100%)]">
        <Container>
          <div className="grid items-center gap-10 py-10 lg:grid-cols-12 lg:gap-14 lg:py-16">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <Breadcrumbs items={crumbs.slice(0, 2)} />
                <span className="rounded-full bg-olive-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-olive-700">{post.category}</span>
              </div>
              <h1 className="mt-6 text-5xl">{post.title}</h1>
              <div className="mt-8 inline-flex items-center gap-4 rounded-lg bg-white p-3 pr-6 shadow-lift ring-1 ring-ink-900/5">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full"><Picture image={{ src: "/images/team/dr-lavi-portrait.jpg", alt: "" }} sizes="56px" className="h-full w-full object-cover object-top" /></div>
                <div className="text-sm leading-snug">
                  <p className="font-semibold text-ink-900">By {site.doctor.name}</p>
                  <p className="text-grey-600">Dentist and practice owner</p>
                  <p className="text-grey-600"><time dateTime={post.dateModified ?? post.datePublished}>{formatDate(post.dateModified ?? post.datePublished)}</time> · {minutes} min read</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-lg shadow-lift ring-1 ring-ink-900/5" style={{ aspectRatio: "3 / 2" }}>
                <Picture image={{ src: post.image, alt: post.imageAlt }} priority sizes="(min-width: 1024px) 520px, 100vw" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <div className="mx-auto grid max-w-[72rem] grid-cols-1 gap-12 py-[var(--section-y-tight)] lg:grid-cols-12 lg:gap-16">
          {/* Sidebar on the right (after the article on phones): numbered contents and a call to action */}
          <aside className="order-last min-w-0 lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              {toc.length > 2 && (
                <nav aria-label="In this article" className="rounded-lg bg-white p-6 ring-1 ring-ink-900/[0.07]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-grey-600">In this article</p>
                  <ol className="mt-3">
                    {toc.map((h, i) => (
                      <li key={h.id}><a href={`#${h.id}`} className="flex min-h-11 items-start gap-3 py-1.5 text-[0.95rem] text-grey-700 hover:text-ink-900">
                        <span className="w-6 shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-olive-600">{String(i + 1).padStart(2, "0")}</span><span>{h.text}</span>
                      </a></li>
                    ))}
                  </ol>
                </nav>
              )}
              <div className="rounded-lg bg-olive-700 p-6 text-white">
                <p className="text-lg font-semibold">Want to talk it through?</p>
                <p className="mt-1.5 text-white/80">Your first visit is an exam and a conversation about your options with our team.</p>
                <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light mt-5 w-full">Request an appointment</a>
                <a href={`tel:${site.phone.tel}`} className="mt-2 flex min-h-11 items-center justify-center gap-2 text-white/90 hover:text-white"><Icon.phone className="h-4 w-4" /> {site.phone.display}</a>
              </div>
            </div>
          </aside>

          <div className="min-w-0 lg:order-first lg:col-span-8">
            <section aria-labelledby="in-short" className="mb-10 rounded-lg border-l-4 border-olive-600 bg-warm p-6 shadow-[0_0_0_1px_rgb(20_20_20/0.06)] sm:p-8">
              <p id="in-short" className="text-xs font-semibold uppercase tracking-[0.16em] text-grey-600">In short</p>
              <p className="mt-3 text-lg leading-relaxed text-ink-900">{post.excerpt}</p>
            </section>
            {post.keyTakeaways.length > 0 && (
              <section aria-labelledby="takeaways" className="mb-10 rounded-lg bg-sand-50 p-6 sm:p-7">
                <p id="takeaways" className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze-600">Key takeaways</p>
                <ul className="mt-4 space-y-2.5">
                  {post.keyTakeaways.map((k) => <li key={k} className="flex items-start gap-3 text-grey-700"><Icon.check className="mt-1 h-4 w-4 shrink-0 text-olive-600" />{k}</li>)}
                </ul>
              </section>
            )}
            <Markdown source={post.body} />

            {post.faq.length > 0 && (
              <section aria-labelledby="post-faq" className="mt-14">
                <h2 id="post-faq">Frequently asked questions</h2>
                <FaqList items={post.faq} className="mt-6" />
              </section>
            )}

            {relatedServices.length > 0 && (
              <section aria-labelledby="related-services" className="mt-14">
                <p id="related-services" className="text-base font-semibold uppercase tracking-[0.14em] text-olive-600">Related services</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {relatedServices.map((s) => <li key={s.slug}><Link href={s.path} className="inline-flex min-h-11 items-center rounded-full border hairline bg-white px-4 text-sm font-medium text-ink-900 hover:border-olive-600 hover:text-olive-600">{s.name}</Link></li>)}
                </ul>
              </section>
            )}

            <section aria-labelledby="author" className="mt-14 flex flex-col gap-5 rounded-lg bg-greige-50/70 p-6 sm:flex-row sm:p-7">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                <Picture image={{ src: "/images/team/dr-lavi-portrait.jpg", alt: "Dr. Nuriel Lavi, DDS" }} sizes="96px" className="h-full w-full object-cover object-top" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-olive-600">About the author</p>
                <p id="author" className="mt-1 text-xl font-semibold text-ink-900">{site.doctor.name}</p>
                <p className="mt-2 text-base sm:text-[0.95rem] text-grey-700">Dentist and owner of Valencia Dentistry in Santa Clarita. Dr. Lavi practices holistic, personal dentistry with a focus on implants, cosmetic care and prevention.</p>
                <Link href="/about/" className="link-arrow mt-1 text-sm">Meet Dr. Lavi <Icon.arrow className="h-4 w-4" /></Link>
              </div>
            </section>
            <p className="mt-8 text-base text-grey-600 sm:text-sm">This article is for general information and does not replace an examination. Treatment recommendations, timelines and costs depend on your individual situation.</p>
          </div>
        </div>
      </Container>

      {(related.length + fallback.length) > 0 && (
        <section className="section-tight border-t hairline bg-warm" aria-labelledby="related-posts">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <h2 id="related-posts">More from the blog</h2>
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
