import Link from "next/link";
import type { Service } from "@/lib/types";
import { getServices, getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { breadcrumbNode, faqNode, graph, JsonLd, serviceNode, serviceOfferNode, webPageNode } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { FaqList } from "@/components/sections/Faq";
import { TrustRow } from "@/components/sections/Hero";
import { ReviewCarousel } from "@/components/blocks/ReviewCarousel";
import { ServiceCard } from "@/components/sections/ServicesHub";
import { FeatureIcon } from "@/components/sections/FeatureGrid";

const PARENT_NAMES: Record<string, string> = {
  "/services/": "Services",
  "/services/cosmetic-dentistry/": "Cosmetic Dentistry",
  "/services/oral-surgery/": "Oral Surgery",
  "/services/restorative-dentistry/": "Restorative Dentistry",
};

export function Breadcrumbs({ items, light }: { items: { name: string; path: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${light ? "text-white/70" : "text-grey-600"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="opacity-50">/</span>}
            {i === items.length - 1 ? <span aria-current="page" className={light ? "text-white" : "text-navy-900"}>{it.name}</span> : <Link href={it.path} className="hover:underline">{it.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const TECH_ICONS = ["tech", "shield", "sparkle", "leaf"];

export async function ServiceView({ s }: { s: Service }) {
  const [all, testimonials] = await Promise.all([getServices(), getTestimonials()]);
  const related = s.related.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const children = all.filter((x) => x.parentPath === s.path);
  const crumbs = [{ name: "Home", path: "/" }, ...(s.parentPath !== "/services/" ? [{ name: "Services", path: "/services/" }] : []), { name: PARENT_NAMES[s.parentPath] ?? "Services", path: s.parentPath }, { name: s.name, path: s.path }].filter((c, i, a) => a.findIndex((x) => x.path === c.path) === i);
  const steps = s.process.steps;

  return (
    <article>
      {/* Hero */}
      <header className="dark-section overflow-hidden">
        <div className="container-x grid items-center gap-10 pb-16 pt-10 lg:grid-cols-12 lg:pb-24 lg:pt-14">
          <div className="lg:col-span-7">
            <Breadcrumbs items={crumbs} light />
            <p className="eyebrow mt-8 mb-4">{s.hero.eyebrow}</p>
            <h1 className="text-5xl">{s.hero.h1}</h1>
            <p className="lead mt-6 max-w-[38rem] text-xl">{s.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={site.bookingUrl} variant="light" size="lg" arrow>{s.cta.buttonLabel || "Book a consultation"}</Button>
              <Button href={`tel:${site.phone.tel}`} variant="outline" size="lg" external={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
            </div>
            <TrustRow light className="mt-10" />
          </div>
          <div className="order-first lg:order-none lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2.5rem] border border-champagne-300/25" aria-hidden="true" />
              <div className="overflow-hidden rounded-4xl shadow-lift">
                <Picture image={{ src: s.hero.image, alt: s.hero.imageAlt }} priority quality={85} sizes="(min-width: 1024px) 480px, calc(100vw - 32px)" className="aspect-[4/3] w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Intro + who it's for */}
      <Section className="bg-warm">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <SectionHeading eyebrow="Overview" heading={s.intro.heading} />
              <div className="prose-measure mt-6 space-y-5 text-lg text-grey-700">{s.intro.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
            </Reveal>
            <Reveal className="lg:col-span-5" delay={100}>
              <div className="card sticky top-28 p-7 sm:p-8">
                <h2 className="text-2xl">{s.whoItsFor.heading}</h2>
                <p className="mt-2 text-grey-600">{s.whoItsFor.intro}</p>
                <ul className="mt-5 space-y-3">
                  {s.whoItsFor.items.map((it) => <li key={it} className="flex items-start gap-3 text-grey-700"><Icon.check className="mt-1 h-4 w-4 shrink-0 text-steel-600" />{it}</li>)}
                </ul>
                <Button href="/appointment/" className="mt-7 w-full" arrow>Ask if it&rsquo;s right for you</Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Options (sub-treatments) */}
      {s.options && (
        <Section className="bg-white" tight>
          <Container>
            <SectionHeading eyebrow="Options" heading={s.options.heading} lead={s.options.intro} />
            {children.length ? (
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children.map((c, i) => <ServiceCard key={c.slug} s={c} index={i} />)}</ul>
            ) : null}
            <ul className={`mt-10 grid gap-5 sm:grid-cols-2 ${s.options.items.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
              {s.options.items.filter((o) => !children.some((c) => c.name.toLowerCase() === o.title.toLowerCase())).map((o, i) => (
                <Reveal as="li" key={o.title} delay={(i % 3) * 60} className="rounded-3xl border hairline bg-warm p-6">
                  <h3 className="text-lg font-sans font-semibold">{o.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-grey-600">{o.text}</p>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Benefits */}
      <Section className="bg-sky-50/60">
        <Container>
          <SectionHeading eyebrow="Benefits" heading={s.benefits.heading} lead={s.benefits.intro} align="center" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {s.benefits.items.map((b, i) => (
              <Reveal as="li" key={b.title} delay={(i % 3) * 70} className="card card-hover p-7">
                <span className="font-display text-3xl text-champagne-500">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl">{b.title}</h3>
                <p className="mt-2 text-[0.95rem] text-grey-600">{b.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Process */}
      <Section dark>
        <Container>
          <SectionHeading eyebrow="What to expect" heading={s.process.heading} lead={s.process.intro} />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <Reveal as="li" key={st.title} delay={i * 90} className="relative rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-champagne-300 font-display text-lg text-navy-900">{i + 1}</span>
                <h3 className="mt-4 text-xl text-white">{st.title}</h3>
                <p className="mt-2 text-[0.95rem] text-white/70">{st.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Technology + aftercare */}
      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className={s.aftercare ? "lg:col-span-6" : "lg:col-span-12"}>
              <SectionHeading eyebrow="Technology" heading={s.technology.heading} lead={s.technology.intro} />
              <ul className={`mt-8 grid gap-4 ${s.aftercare ? "" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
                {s.technology.items.map((t, i) => (
                  <li key={t.title} className="flex gap-4 rounded-3xl border hairline p-5">
                    <FeatureIcon name={TECH_ICONS[i % TECH_ICONS.length]} />
                    <div><h3 className="text-lg font-sans font-semibold">{t.title}</h3><p className="mt-1 text-[0.95rem] text-grey-600">{t.text}</p></div>
                  </li>
                ))}
              </ul>
            </div>
            {s.aftercare && (
              <div className="lg:col-span-6">
                <SectionHeading eyebrow="Care guide" heading={s.aftercare.heading} />
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-3xl bg-warm p-6 ring-1 ring-navy-900/5">
                    <h3 className="text-lg font-sans font-semibold">Before your visit</h3>
                    <ul className="mt-3 space-y-2.5">{s.aftercare.before.map((b) => <li key={b} className="flex items-start gap-2.5 text-[0.95rem] text-grey-700"><Icon.check className="mt-1 h-4 w-4 shrink-0 text-steel-600" />{b}</li>)}</ul>
                  </div>
                  <div className="rounded-3xl bg-warm p-6 ring-1 ring-navy-900/5">
                    <h3 className="text-lg font-sans font-semibold">After your visit</h3>
                    <ul className="mt-3 space-y-2.5">{s.aftercare.after.map((b) => <li key={b} className="flex items-start gap-2.5 text-[0.95rem] text-grey-700"><Icon.check className="mt-1 h-4 w-4 shrink-0 text-steel-600" />{b}</li>)}</ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Cost */}
      <Section tight className="bg-champagne-50/70">
        <Container>
          <div className="grid gap-8 rounded-4xl bg-white p-8 shadow-soft ring-1 ring-navy-900/[0.06] sm:p-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-4">Cost &amp; financing</p>
              <h2 className="text-3xl">{s.cost.heading}</h2>
              <p className="prose-measure mt-4 text-lg text-grey-700">{s.cost.text}</p>
            </div>
            <div className="flex flex-col justify-center gap-3 lg:col-span-4">
              <div className="rounded-3xl bg-sky-50 p-5"><p className="font-display text-3xl text-navy-900">$59</p><p className="text-sm text-grey-700">New patient exam &amp; X-rays</p></div>
              <p className="text-sm text-grey-600">Most PPO plans accepted · flexible financing · written estimate before treatment</p>
              <Link href="/contact/#insurance" className="text-sm font-semibold text-steel-600 underline-offset-4 hover:underline">See accepted insurance →</Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQs */}
      <Section className="bg-warm" id="faq">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" heading={`${s.name} questions`} lead="Straight answers from Dr. Moezzi. Have another one? Ask at your consultation or call the office." />
            </div>
            <div className="lg:col-span-8"><FaqList items={s.faqs} /></div>
          </div>
        </Container>
      </Section>

      {/* Related + reviews */}
      <Section className="bg-white">
        <Container>
          {related.length > 0 && (
            <>
              <SectionHeading eyebrow="Related care" heading="You might also be looking at" />
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((r, i) => <ServiceCard key={r.slug} s={r} index={i} />)}</ul>
            </>
          )}
          <div className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Patient reviews" heading="What patients say" />
              <p className="flex items-center gap-2 text-sm text-grey-600"><Icon.google className="h-5 w-5" /> {site.rating.value} · {site.rating.count} Google reviews</p>
            </div>
            <div className="mt-8"><ReviewCarousel items={testimonials} /></div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
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
