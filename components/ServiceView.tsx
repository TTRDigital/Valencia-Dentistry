import Link from "next/link";
import type { Service } from "@/lib/types";
import { getServices, getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { breadcrumbNode, faqNode, graph, JsonLd, serviceNode, serviceOfferNode, webPageNode } from "@/lib/seo";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { TimelineProgress } from "@/components/motion/TimelineProgress";
import { ReviewCarousel } from "@/components/blocks/ReviewCarousel";
import { FaqList } from "@/components/sections/Faq";
import { ServiceCard } from "@/components/sections/ServicesHub";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { cn, inSentence } from "@/lib/utils";

const PARENT_NAMES: Record<string, string> = {
  "/services/": "Services",
  "/services/cosmetic-dentistry/": "Cosmetic Dentistry",
  "/services/oral-surgery/": "Oral Surgery",
  "/services/restorative-dentistry/": "Restorative Dentistry",
};
const CATEGORY_LABEL: Record<string, string> = { cosmetic: "Cosmetic dentistry", restorative: "Restorative dentistry", surgical: "Oral surgery", holistic: "Holistic dentistry", preventive: "Jaw & comfort care" };

export function Breadcrumbs({ items, light }: { items: { name: string; path: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${light ? "text-white/70" : "text-grey-600"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="opacity-50">/</span>}
            {i === items.length - 1 ? <span aria-current="page" className={light ? "text-white" : "text-ink-900"}>{it.name}</span> : <Link href={it.path} className="hover:underline">{it.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-grey-900">
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive-100 text-olive-700"><Icon.check className="h-3.5 w-3.5" /></span>
      <span>{children}</span>
    </li>
  );
}

/** A labelled block in the article column; `label` is the short name used in the "On this page" list. */
function Block({ id, label, children, className }: { id: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-label={label} className={cn("scroll-mt-28 border-t border-ink-900/10 pt-12 first:border-t-0 first:pt-0", className)}>
      {children}
    </section>
  );
}

/** Booking card used in the sticky sidebar (desktop) and inline after the overview (mobile). */
function BookingCard({ s, className }: { s: Service; className?: string }) {
  return (
    <div className={cn("rounded-md bg-ink-900 p-6 text-white", className)}>
      <p className="text-sm font-semibold text-bronze-300">Start with a consultation</p>
      <p className="mt-2 text-lg">See Dr. Lavi about {inSentence(s.name)}. New patients: exam &amp; X-rays for <span className="font-semibold">$59</span>.</p>
      <div className="mt-5 grid gap-2">
        <Button href={site.bookingUrl} variant="light" arrow>Book online</Button>
        <Button href={`tel:${site.phone.tel}`} variant="outline" external={false} className="border-white/40 text-white hover:bg-white/10"><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
      </div>
      <ul className="mt-5 space-y-2 text-sm text-white/80">
        <li className="flex items-center gap-2"><Icon.google className="h-4 w-4" /> {site.rating.value} from {site.rating.count} Google reviews</li>
        <li className="flex items-center gap-2"><Icon.shield className="h-4 w-4 text-bronze-300" /> Most PPO plans accepted</li>
        <li className="flex items-center gap-2"><Icon.pin className="h-4 w-4 text-bronze-300" /> Free parking · elevator to Suite 240</li>
      </ul>
      <OpenBadge showNext className="mt-4 text-white" />
    </div>
  );
}

export async function ServiceView({ s }: { s: Service }) {
  const [all, testimonials] = await Promise.all([getServices(), getTestimonials()]);
  const related = s.related.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const children = all.filter((x) => x.parentPath === s.path);
  const crumbs = [{ name: "Home", path: "/" }, ...(s.parentPath !== "/services/" ? [{ name: "Services", path: "/services/" }] : []), { name: PARENT_NAMES[s.parentPath] ?? "Services", path: s.parentPath }, { name: s.name, path: s.path }].filter((c, i, a) => a.findIndex((x) => x.path === c.path) === i);
  const introHeading = s.intro.heading === s.hero.subtitle ? `${s.name} at Valencia Dentistry` : s.intro.heading;
  const hasWhat = s.understanding.items.length > 0 || !!s.understanding.intro || (s.understanding.bullets?.length ?? 0) > 0;
  const hasWho = !!s.candidate.text || s.candidate.bullets.length > 0;
  const whyPhotos = s.why.cards.filter((c) => c.image).map((c) => c.image!);
  const toc = [
    { id: "overview", label: "Overview" },
    ...(hasWhat ? [{ id: "what-it-is", label: "What it is" }] : []),
    ...(hasWho ? [{ id: "who-its-for", label: "Who it's for" }] : []),
    ...(s.process.steps.length ? [{ id: "how-it-works", label: "How it works" }] : []),
    ...(s.why.cards.length ? [{ id: "why-here", label: "Why patients choose us" }] : []),
    ...(s.care || s.tables?.length || s.extra.length ? [{ id: "details", label: "Care and details" }] : []),
    ...(s.faqs.length ? [{ id: "questions", label: "Questions" }] : []),
  ];

  return (
    <article>
      {/* Split hero: text on cream, photo in a soft frame */}
      <header data-hero className="border-b border-ink-900/10 bg-warm">
        <Container>
          <div className="grid items-center gap-8 py-10 lg:grid-cols-12 lg:gap-14 lg:py-16">
            <div className="lg:col-span-7">
              <Breadcrumbs items={crumbs} />
              <p className="eyebrow mb-3 mt-6">{CATEGORY_LABEL[s.category]}</p>
              <h1 className="text-5xl">{s.hero.h1}</h1>
              {s.hero.subtitle && s.hero.subtitle !== s.name && <p className="mt-4 text-xl font-semibold text-olive-700">{s.hero.subtitle}</p>}
              {s.hero.text && <p className="mt-4 max-w-xl text-lg text-grey-700">{s.hero.text}</p>}
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={site.bookingUrl} size="lg" arrow>Book a consultation</Button>
                <Button href={`tel:${site.phone.tel}`} variant="outline" size="lg" external={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-t-[160px] rounded-b-md bg-greige-50">
                <Picture image={s.hero.image} priority quality={80} sizes="(min-width: 1024px) 460px, 100vw" className="aspect-[5/4] w-full object-cover object-top lg:aspect-[4/5]" />
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <div className="grid gap-12 py-12 lg:grid-cols-12 lg:gap-14 lg:py-16">
          {/* Article column */}
          <div className="min-w-0 space-y-12 lg:col-span-8">
            <Block id="overview" label="Overview">
              <h2 className="text-4xl">{introHeading}</h2>
              <div className="mt-5 max-w-[68ch] space-y-4 text-lg text-grey-700">
                {(s.intro.paragraphs.length ? s.intro.paragraphs : [s.hero.text]).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {children.length > 0 && (
                <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">{children.map((c, i) => <ServiceCard key={c.slug} s={c} index={i} />)}</ul>
              )}
              <BookingCard s={s} className="mt-8 lg:hidden" />
            </Block>

            {hasWhat && (
              <Block id="what-it-is" label="What it is">
                <h2 className="text-4xl">{s.understanding.heading}</h2>
                {s.understanding.intro && <p className="mt-5 max-w-[68ch] text-lg text-grey-700">{s.understanding.intro}</p>}
                {s.understanding.bullets && s.understanding.bullets.length > 0 && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">{s.understanding.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>
                )}
                <Reveal className="mt-8 overflow-hidden rounded-md">
                  <Picture image={s.understanding.image} sizes="(min-width: 1024px) 760px, 100vw" className="aspect-[16/9] w-full object-cover object-top" />
                </Reveal>
                {s.understanding.items.length > 0 && (
                  <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    {s.understanding.items.map((it, i) => (
                      <Reveal key={it.title + i} delay={(i % 2) * 70} className="border-l-2 border-olive-600 pl-4">
                        <dt className="font-semibold text-ink-900">{it.title}</dt>
                        <dd className="mt-1 text-grey-700">{it.text}</dd>
                      </Reveal>
                    ))}
                  </dl>
                )}
              </Block>
            )}

            {hasWho && (
              <Block id="who-its-for" label="Who it's for">
                <div className="rounded-md bg-warm p-6 ring-1 ring-ink-900/10 sm:p-8">
                  <h2 className="text-3xl">{s.candidate.heading}</h2>
                  {s.candidate.text && <p className="mt-4 max-w-[68ch] text-grey-700">{s.candidate.text}</p>}
                  {s.candidate.bullets.length > 0 && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{s.candidate.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>}
                  <p className="mt-6 text-sm text-grey-700">Not sure? Dr. Lavi will tell you honestly at your consultation, including when another option suits you better.</p>
                </div>
              </Block>
            )}

            {s.process.steps.length > 0 && (
              <Block id="how-it-works" label="How it works">
                <h2 className="text-4xl">{s.process.heading}</h2>
                {s.process.intro && <p className="mt-5 max-w-[68ch] text-lg text-grey-700">{s.process.intro}</p>}
                <TimelineProgress className="timeline relative mt-8">
                  <div className="absolute bottom-4 left-[19px] top-4 w-0.5 bg-ink-900/10" aria-hidden="true" />
                  <div data-progress className="timeline-line absolute bottom-4 left-[19px] top-4 w-0.5 origin-top bg-olive-600" aria-hidden="true" />
                  <ol className="relative space-y-8">
                    {s.process.steps.map((st, i) => (
                      <li key={st.title + i} data-step className="relative grid grid-cols-[40px_1fr] gap-5">
                        <span className="relative flex h-10 w-10 items-center justify-center" aria-hidden="true">
                          <span className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-ink-900/15 bg-white text-sm font-bold text-ink-900">{i + 1}</span>
                          <span className="timeline-dot absolute inset-0 flex items-center justify-center rounded-full bg-olive-600 text-sm font-bold text-white">{i + 1}</span>
                        </span>
                        <div className="pt-1.5">
                          <h3 className="text-xl">{st.title}</h3>
                          <p className="mt-1.5 text-grey-700">{st.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </TimelineProgress>
              </Block>
            )}

            {s.why.cards.length > 0 && (
              <Block id="why-here" label="Why patients choose us">
                <h2 className="text-4xl">{s.why.heading}</h2>
                {s.why.intro && <p className="mt-5 max-w-[68ch] text-lg text-grey-700">{s.why.intro}</p>}
                {whyPhotos.length > 0 && (
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {whyPhotos.slice(0, 3).map((img, i) => (
                      <div key={img.src + i} className="overflow-hidden rounded-md"><Picture image={img} sizes="(min-width: 1024px) 250px, 33vw" className="aspect-square w-full object-cover object-top" /></div>
                    ))}
                  </div>
                )}
                <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {s.why.cards.map((c, i) => (
                    <Reveal as="li" key={c.title} delay={(i % 2) * 70} className="flex gap-4">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-100 text-sm font-bold text-bronze-600">{i + 1}</span>
                      <div><h3 className="text-lg font-semibold">{c.title}</h3><p className="mt-1 text-grey-700">{c.text}</p></div>
                    </Reveal>
                  ))}
                </ul>
              </Block>
            )}

            {(s.care || (s.tables?.length ?? 0) > 0 || s.extra.length > 0) && (
              <Block id="details" label="Care and details" className="space-y-12">
                {s.care && (
                  <div>
                    <h2 className="text-3xl">{s.care.heading}</h2>
                    {s.care.intro && <p className="mt-4 max-w-[68ch] text-grey-700">{s.care.intro}</p>}
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      {[["Before your appointment", s.care.before], ["After your appointment", s.care.after]].map(([t, items]) => (items as string[]).length > 0 && (
                        <div key={t as string} className="rounded-md bg-greige-50 p-6">
                          <h3 className="text-lg font-semibold">{t as string}</h3>
                          <ul className="mt-4 space-y-3">{(items as string[]).map((b) => <Check key={b}>{b}</Check>)}</ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {s.tables?.map((t) => (
                  <div key={t.heading}>
                    <h2 className="text-3xl">{t.heading}</h2>
                    {t.text && <p className="mt-4 max-w-[68ch] text-grey-700">{t.text}</p>}
                    <div className="mt-6 overflow-x-auto rounded-md ring-1 ring-ink-900/10">
                      <table className="w-full text-[0.95rem]">
                        <thead className="bg-greige-50 text-left"><tr>{t.rows[0].map((c, i) => <th key={i} scope="col" className="px-4 py-3 font-semibold text-ink-900">{c}</th>)}</tr></thead>
                        <tbody>{t.rows.slice(1).map((r, i) => <tr key={i} className="border-t border-ink-900/10">{r.map((c, j) => <td key={j} className={cn("px-4 py-3 align-top", j === 0 && "font-semibold text-ink-900")}>{c}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                  </div>
                ))}
                {s.extra.map((e) => (
                  <div key={e.heading}>
                    <h2 className="text-3xl">{e.heading}</h2>
                    <div className="mt-4 max-w-[68ch] space-y-4 text-grey-700">{e.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
                    {e.bullets.length > 0 && <ul className="mt-5 grid gap-3 sm:grid-cols-2">{e.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>}
                    {e.cards.length > 0 && <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">{e.cards.map((c) => <div key={c.title} className="border-l-2 border-olive-600 pl-4"><dt className="font-semibold text-ink-900">{c.title}</dt><dd className="mt-1 text-grey-700">{c.text}</dd></div>)}</dl>}
                  </div>
                ))}
              </Block>
            )}

            {s.faqs.length > 0 && (
              <Block id="questions" label="Questions">
                <h2 className="text-4xl">Questions patients ask about {inSentence(s.name)}</h2>
                <p className="mt-4 text-grey-700">Answered by Dr. Lavi. Have another? Call {site.phone.display}.</p>
                <FaqList items={s.faqs} className="mt-6" />
              </Block>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:col-span-4 lg:block" aria-label={`Book ${inSentence(s.name)}`}>
            <div className="sticky top-24 space-y-6">
              <BookingCard s={s} />
              <nav aria-label="On this page" className="rounded-md p-1">
                <p className="text-sm font-semibold text-ink-900">On this page</p>
                <ol className="mt-3 space-y-0.5 border-l border-ink-900/10">
                  {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="-ml-px block min-h-9 border-l-2 border-transparent py-1.5 pl-4 text-[0.95rem] text-grey-700 hover:border-olive-600 hover:text-ink-900">{t.label}</a></li>)}
                </ol>
              </nav>
            </div>
          </aside>
        </div>
      </Container>

      {/* Reviews and related treatments */}
      <Section className="border-t border-ink-900/10 bg-white" tight>
        <Container>
          {testimonials.length > 0 && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-3xl">From our Google reviews</h2>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-olive-700 underline-offset-4 hover:underline"><Icon.google className="h-4 w-4" /> {site.rating.value} · {site.rating.count} reviews</a>
              </div>
              <div className="mt-8"><ReviewCarousel items={testimonials} /></div>
            </div>
          )}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl">Related treatments</h2>
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((r, i) => <ServiceCard key={r.slug} s={r} index={i} />)}</ul>
            </div>
          )}
        </Container>
      </Section>

      <Section tight className="bg-warm">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-md bg-olive-700 px-7 py-10 text-white sm:px-10 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl text-white">{s.cta.heading}</h2>
              <p className="mt-2 max-w-xl text-white/85">{s.cta.text}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href={site.bookingUrl} variant="light" size="lg" arrow>{s.cta.buttonLabel || "Book a consultation"}</Button>
              <Button href="/appointment/" variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">Request a callback</Button>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd data={graph([webPageNode(s.path, s.seo.title, s.seo.description), breadcrumbNode(crumbs), serviceNode(s), serviceOfferNode(s), faqNode(s.faqs)])} />
    </article>
  );
}
