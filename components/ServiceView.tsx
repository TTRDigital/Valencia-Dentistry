import Link from "next/link";
import type { Service, ServiceCard as Card } from "@/lib/types";
import { getServices, getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { breadcrumbNode, faqNode, graph, JsonLd, serviceNode, serviceOfferNode, webPageNode } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { FaqList } from "@/components/sections/Faq";
import { ReviewCarousel } from "@/components/blocks/ReviewCarousel";
import { ServiceCard } from "@/components/sections/ServicesHub";
import { cn } from "@/lib/utils";

const PARENT_NAMES: Record<string, string> = {
  "/services/": "Services",
  "/services/cosmetic-dentistry/": "Cosmetic Dentistry",
  "/services/oral-surgery/": "Oral Surgery",
  "/services/restorative-dentistry/": "Restorative Dentistry",
};
const CATEGORY_LABEL: Record<string, string> = { cosmetic: "Cosmetic dentistry", restorative: "Restorative dentistry", surgical: "Oral surgery", holistic: "Holistic dentistry", preventive: "Preventive & comfort care" };

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

/** Accordion of title/text items (native details, one open at a time). */
function Accordion({ items, dark, name }: { items: Card[]; dark?: boolean; name: string }) {
  return (
    <div className={cn("divide-y", dark ? "divide-white/15" : "divide-ink-900/10")}>
      {items.map((it, i) => (
        <details key={it.title + i} className="group" open={i === 0} name={name}>
          <summary className={cn("flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-left text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden", dark ? "text-white" : "text-ink-900")}>
            {it.title}
            <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-open:rotate-45", dark ? "bg-white/10 text-bronze-300" : "bg-greige-50 text-olive-600")} aria-hidden="true">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
            </span>
          </summary>
          <p className={cn("pb-5 pr-2 leading-relaxed sm:pr-12", dark ? "text-white/75" : "text-grey-700")}>{it.text}</p>
        </details>
      ))}
    </div>
  );
}

function Check({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className={cn("flex items-start gap-3", light ? "text-white/90" : "text-grey-700")}>
      <span className={cn("mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full", light ? "bg-white/15 text-bronze-300" : "bg-olive-100 text-olive-700")}><Icon.check className="h-3.5 w-3.5" /></span>
      <span>{children}</span>
    </li>
  );
}

export async function ServiceView({ s }: { s: Service }) {
  const [all, testimonials] = await Promise.all([getServices(), getTestimonials()]);
  const related = s.related.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const children = all.filter((x) => x.parentPath === s.path);
  const crumbs = [{ name: "Home", path: "/" }, ...(s.parentPath !== "/services/" ? [{ name: "Services", path: "/services/" }] : []), { name: PARENT_NAMES[s.parentPath] ?? "Services", path: s.parentPath }, { name: s.name, path: s.path }].filter((c, i, a) => a.findIndex((x) => x.path === c.path) === i);
  const hasUnderstanding = s.understanding.items.length > 0 || s.understanding.intro || (s.understanding.bullets?.length ?? 0) > 0;
  const whyWithPhoto = s.why.cards.filter((c) => c.image);
  const whyText = s.why.cards.filter((c) => !c.image);
  const introHeading = s.intro.heading === s.hero.subtitle ? `${s.name} at Valencia Dentistry` : s.intro.heading;

  return (
    <article>
      {/* 1. Photo hero */}
      <header className="on-dark relative isolate overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 -z-10">
          <Picture image={s.hero.image} fill priority sizes="100vw" quality={70} className="object-cover object-[70%_center] lg:object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-900/55 to-ink-900/20 lg:bg-gradient-to-r lg:from-ink-950/90 lg:via-ink-900/65 lg:to-ink-900/15" aria-hidden="true" />
        </div>
        <Container>
          <div className="max-w-2xl pb-14 pt-[46vw] sm:pt-32 sm:pb-24 lg:py-36">
            <p className="eyebrow mb-4 text-bronze-300">{CATEGORY_LABEL[s.category]}</p>
            <h1 className="text-5xl text-white">{s.hero.h1}</h1>
            {s.hero.subtitle && s.hero.subtitle !== s.name && <p className="mt-5 font-display text-2xl text-bronze-300">{s.hero.subtitle}</p>}
            {s.hero.text && <p className="mt-5 max-w-xl text-lg text-white/85">{s.hero.text}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={site.bookingUrl} variant="light" size="lg" arrow>Book a consultation</Button>
              <Button href={`tel:${site.phone.tel}`} variant="outline" size="lg" external={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. Intro */}
      <Section className="bg-warm" tight>
        <Container>
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="text-3xl">{introHeading}</h2>
            </div>
            <div className="prose-measure space-y-5 text-lg text-grey-700 lg:col-span-7">
              {s.intro.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              {!s.intro.paragraphs.length && s.hero.text && <p>{s.hero.text}</p>}
              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-grey-600">
                <li className="inline-flex items-center gap-2"><Icon.google className="h-4 w-4" /> {site.rating.value} · {site.rating.count} Google reviews</li>
                <li className="inline-flex items-center gap-2"><Icon.shield className="h-4 w-4 text-olive-600" /> Most PPO plans accepted</li>
                <li className="inline-flex items-center gap-2"><Icon.tag className="h-4 w-4 text-olive-600" /> $59 new patient exam &amp; X-rays</li>
              </ul>
            </div>
          </div>
          {children.length > 0 && (
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{children.map((c, i) => <ServiceCard key={c.slug} s={c} index={i} />)}</ul>
          )}
        </Container>
      </Section>

      {/* 3. Understanding: dark, photo + accordion */}
      {hasUnderstanding && (
        <Section dark>
          <Container>
            <div className="max-w-3xl">
              <p className="eyebrow mb-4">Understanding {s.name.toLowerCase()}</p>
              <h2 className="text-4xl">{s.understanding.heading}</h2>
              {s.understanding.intro && <p className="lead mt-5">{s.understanding.intro}</p>}
              {s.understanding.bullets && s.understanding.bullets.length > 0 && (
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">{s.understanding.bullets.map((b) => <Check key={b} light>{b}</Check>)}</ul>
              )}
            </div>
            <div className="mt-12 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
              <Reveal className="lg:col-span-5">
                <div className="overflow-hidden rounded-4xl shadow-lift ring-1 ring-white/10">
                  <Picture image={s.understanding.image} sizes="(min-width: 1024px) 480px, 100vw" className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]" />
                </div>
              </Reveal>
              <div className="lg:col-span-7">
                {s.understanding.items.length > 0 ? <Accordion items={s.understanding.items} dark name="understanding" /> : null}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 4. Why choose: photo cards */}
      {s.why.cards.length > 0 && (
        <Section className="bg-warm">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <SectionHeading eyebrow="Why Valencia Dentistry" heading={s.why.heading} lead={s.why.intro} />
                {whyText.length > 0 && (
                  <ul className="mt-8 space-y-5">
                    {whyText.map((c) => (
                      <li key={c.title} className="border-l-2 border-bronze-300 pl-4">
                        <p className="font-semibold text-ink-900">{c.title}</p>
                        <p className="mt-1 text-[0.95rem] text-grey-600">{c.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <ul className="grid items-start gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
                {whyWithPhoto.map((c, i) => (
                  <Reveal as="li" key={c.title} delay={i * 70} className="card card-hover self-start overflow-hidden">
                    <div className="relative aspect-[4/3]"><Picture image={c.image!} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="object-cover" /></div>
                    <div className="p-6">
                      <h3 className="font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-olive-700">{c.title}</h3>
                      <p className="mt-2 text-[0.95rem] text-grey-600">{c.text}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {/* 5. Process: dark, numbered steps */}
      {s.process.steps.length > 0 && (
        <Section dark>
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <SectionHeading eyebrow="What to expect" heading={s.process.heading} lead={s.process.intro} />
                <Button href={site.bookingUrl} variant="light" className="mt-8" arrow>Schedule your consultation</Button>
              </div>
              <ol className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
                {s.process.steps.map((st, i) => (
                  <Reveal as="li" key={st.title + i} delay={i * 80} className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bronze-300 font-display text-lg text-ink-900">{i + 1}</span>
                    <h3 className="mt-4 text-xl text-white">{st.title}</h3>
                    <p className="mt-2 text-[0.95rem] text-white/75">{st.text}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </Container>
        </Section>
      )}

      {/* 6. Candidate: full-bleed photo banner */}
      {(s.candidate.text || s.candidate.bullets.length > 0) && (
        <section className="on-dark relative isolate overflow-hidden bg-ink-900 text-white" aria-labelledby="candidate-heading">
          <div className="absolute inset-0 -z-10">
            <Picture image={s.candidate.image} fill sizes="100vw" quality={70} className="object-cover object-[75%_center] lg:object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-900/70 to-ink-900/35 lg:bg-gradient-to-r lg:from-ink-950/90 lg:via-ink-900/70 lg:to-ink-900/20" aria-hidden="true" />
          </div>
          <Container>
            <div className="max-w-2xl py-20 lg:py-28">
              <p className="eyebrow mb-4 text-bronze-300">Is it right for you?</p>
              <h2 id="candidate-heading" className="text-4xl text-white">{s.candidate.heading}</h2>
              {s.candidate.text && <p className="mt-5 text-lg text-white/85">{s.candidate.text}</p>}
              {s.candidate.bullets.length > 0 && <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">{s.candidate.bullets.map((b) => <Check key={b} light>{b}</Check>)}</ul>}
              <Button href="/appointment/" variant="light" className="mt-8" arrow>Ask Dr. Lavi</Button>
            </div>
          </Container>
        </section>
      )}

      {/* 7. Care, tables, extra sections */}
      {(s.care || (s.tables?.length ?? 0) > 0 || s.extra.length > 0) && (
        <Section className="bg-white">
          <Container>
            <div className="space-y-16">
              {s.care && (
                <div>
                  <SectionHeading eyebrow="Care guide" heading={s.care.heading} lead={s.care.intro} />
                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    {[["Before your visit", s.care.before], ["After your visit", s.care.after]].map(([t, items]) => (items as string[]).length > 0 && (
                      <div key={t as string} className="rounded-3xl bg-greige-50 p-6 sm:p-7">
                        <h3 className="font-sans text-lg font-semibold">{t as string}</h3>
                        <ul className="mt-4 space-y-3">{(items as string[]).map((b) => <Check key={b}>{b}</Check>)}</ul>
                      </div>
                    ))}
                  </div>
                  {s.care.cards && s.care.cards.length > 0 && (
                    <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{s.care.cards.map((c) => <li key={c.title} className="rounded-3xl border hairline p-6"><h3 className="font-sans text-lg font-semibold">{c.title}</h3><p className="mt-2 text-[0.95rem] text-grey-600">{c.text}</p></li>)}</ul>
                  )}
                </div>
              )}
              {s.tables?.map((t) => (
                <div key={t.heading}>
                  <SectionHeading heading={t.heading} lead={t.text} />
                  <div className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-ink-900/10">
                    <table className="w-full text-[0.95rem]">
                      <thead className="bg-greige-50 text-left"><tr>{t.rows[0].map((c, i) => <th key={i} scope="col" className="px-4 py-3 font-semibold text-ink-900">{c}</th>)}</tr></thead>
                      <tbody>{t.rows.slice(1).map((r, i) => <tr key={i} className="border-t border-ink-900/10">{r.map((c, j) => <td key={j} className={cn("px-4 py-3 align-top", j === 0 && "font-semibold text-ink-900")}>{c}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </div>
              ))}
              {s.extra.map((e) => (
                <div key={e.heading} className="grid gap-8 lg:grid-cols-12 lg:gap-14">
                  <div className="lg:col-span-4"><h2 className="text-3xl">{e.heading}</h2></div>
                  <div className="lg:col-span-8">
                    <div className="prose-measure space-y-4 text-lg text-grey-700">{e.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
                    {e.bullets.length > 0 && <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">{e.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>}
                    {e.cards.length > 0 && <ul className="mt-6 grid gap-4 sm:grid-cols-2">{e.cards.map((c) => <li key={c.title} className="rounded-3xl bg-greige-50 p-5"><h3 className="font-sans text-base font-semibold">{c.title}</h3><p className="mt-1.5 text-[0.95rem] text-grey-600">{c.text}</p></li>)}</ul>}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 8. FAQ */}
      {s.faqs.length > 0 && (
        <Section className="bg-warm" id="faq">
          <Container>
            <SectionHeading eyebrow="FAQ" heading={`Frequently asked questions about ${s.name.toLowerCase()}`} lead="Straight answers from Dr. Lavi. Have another question? Ask at your consultation or call the office." align="center" />
            <div className="mx-auto mt-10 max-w-3xl"><FaqList items={s.faqs} /></div>
          </Container>
        </Section>
      )}

      {/* 9. Reviews + related */}
      <Section className="bg-white">
        <Container>
          {testimonials.length > 0 && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading eyebrow="Patient reviews" heading="What patients say" />
                <p className="flex items-center gap-2 text-sm text-grey-600"><Icon.google className="h-5 w-5" /> {site.rating.value} · {site.rating.count} Google reviews</p>
              </div>
              <div className="mt-8"><ReviewCarousel items={testimonials} /></div>
            </div>
          )}
          {related.length > 0 && (
            <div className="mt-20">
              <SectionHeading eyebrow="Related care" heading="You might also be looking at" />
              <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((r, i) => <ServiceCard key={r.slug} s={r} index={i} />)}</ul>
            </div>
          )}
        </Container>
      </Section>

      {/* 10. CTA */}
      <Section tight className="bg-warm">
        <Container>
          <div className="dark-section rounded-4xl px-7 py-12 text-center sm:px-12 lg:py-16">
            <h2 className="mx-auto max-w-[28ch] text-4xl">{s.cta.heading}</h2>
            <p className="lead mx-auto mt-4 max-w-[40rem]">{s.cta.text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={site.bookingUrl} variant="light" size="lg" arrow>{s.cta.buttonLabel || "Book a consultation"}</Button>
              <Button href="/appointment/" variant="outline" size="lg">Request a callback</Button>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd data={graph([webPageNode(s.path, s.seo.title, s.seo.description), breadcrumbNode(crumbs), serviceNode(s), serviceOfferNode(s), faqNode(s.faqs)])} />
    </article>
  );
}
