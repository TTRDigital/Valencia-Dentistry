import type { Service, SiteImage } from "@/lib/types";
import { getPeople, getServices, getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { breadcrumbNode, faqNode, graph, JsonLd, serviceNode, serviceOfferNode, webPageNode } from "@/lib/seo";
import { StagedHeading, TrustRow } from "@/components/sections/Hero";
import { FaqList } from "@/components/sections/Faq";
import { CardList } from "@/components/sections/ServicesHub";
import { CtaBanner, IconCard, QuoteHighlight, RichHeading } from "@/components/rich/Blocks";
import { FloatingBadge, PhotoCollage, PhotoFrame } from "@/components/rich/PhotoFrame";
import { SectionNav } from "@/components/rich/SectionNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { cn, inSentence } from "@/lib/utils";

export { Breadcrumbs };

const PARENT_NAMES: Record<string, string> = {
  "/services/": "Services",
  "/services/cosmetic-dentistry/": "Cosmetic Dentistry",
  "/services/oral-surgery/": "Oral Surgery",
  "/services/restorative-dentistry/": "Restorative Dentistry",
};
const CATEGORY_LABEL: Record<string, string> = { cosmetic: "Cosmetic dentistry", restorative: "Restorative dentistry", surgical: "Oral surgery", holistic: "Holistic dentistry", preventive: "Jaw & comfort care" };
const CARD_ICONS: IconName[] = ["tooth", "shield", "sparkle", "heart", "tech", "smile", "leaf", "bolt"];
// Literal class names so Tailwind generates them
const STEP_COLS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-3", 6: "lg:grid-cols-3" };

function Check({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className={cn("flex items-start gap-3", dark ? "text-white/90" : "text-grey-900")}>
      <span className={cn("mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full", dark ? "bg-bronze-300/20 text-bronze-300" : "bg-olive-600 text-white")}><Icon.check className="h-3.5 w-3.5" /></span>
      <span>{children}</span>
    </li>
  );
}

/** Pick distinct photos for the page: hero first, then the rest in order, without repeats. */
function photosFor(s: Service): SiteImage[] {
  const all = [s.hero.image, s.understanding.image, ...s.why.cards.map((c) => c.image), s.candidate.image].filter((x): x is SiteImage => !!x?.src);
  return all.filter((img, i) => all.findIndex((x) => x.src === img.src) === i);
}

export async function ServiceView({ s }: { s: Service }) {
  const [all, testimonials, people] = await Promise.all([getServices(), getTestimonials(), getPeople()]);
  const related = s.related.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const children = all.filter((x) => x.parentPath === s.path);
  const crumbs = [{ name: "Home", path: "/" }, ...(s.parentPath !== "/services/" ? [{ name: "Services", path: "/services/" }] : []), { name: PARENT_NAMES[s.parentPath] ?? "Services", path: s.parentPath }, { name: s.name, path: s.path }].filter((c, i, a) => a.findIndex((x) => x.path === c.path) === i);
  const introHeading = s.intro.heading === s.hero.subtitle ? `${s.name} at Valencia Dentistry` : s.intro.heading;
  const hasWhat = s.understanding.items.length > 0 || !!s.understanding.intro || (s.understanding.bullets?.length ?? 0) > 0;
  const hasWho = !!s.candidate.text || s.candidate.bullets.length > 0;
  const hasDetails = !!s.care || (s.tables?.length ?? 0) > 0 || s.extra.length > 0;
  const photos = photosFor(s);
  const pic = (i: number) => photos[i % photos.length];
  const doctor = people[0];
  const quote = testimonials[0];

  const nav = [
    { id: "overview", label: "Overview" },
    ...(hasWhat ? [{ id: "what-it-is", label: "What it is" }] : []),
    ...(hasWho ? [{ id: "who-its-for", label: "Who it's for" }] : []),
    ...(s.process.steps.length ? [{ id: "how-it-works", label: "How it works" }] : []),
    ...(s.why.cards.length ? [{ id: "why-here", label: "Why us" }] : []),
    ...(hasDetails ? [{ id: "details", label: "Care & details" }] : []),
    ...(s.faqs.length ? [{ id: "questions", label: "Questions" }] : []),
  ];

  const quickFacts: { icon: IconName; title: string; text: string }[] = [
    { icon: "user", title: "Unhurried visits", text: "Every step explained before treatment" },
    { icon: "calendar", title: "Mon–Fri, 8am–5pm", text: "Weekday appointments, same-day when possible" },
    { icon: "shield", title: "Most PPO plans", text: "We check your benefits before you come in" },
    { icon: "pin", title: "Easy to reach", text: "Free parking, elevator to Suite 240" },
  ];

  return (
    <article>
      <div className="reading-progress" aria-hidden="true" />

      {/* ---------- Hero: dark, the photo whole in its own proportions with floating proof points ---------- */}
      <header data-hero="dark" className="on-dark relative isolate overflow-hidden bg-ink-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(90%_80%_at_100%_0%,rgba(91,107,90,0.55),transparent_60%),radial-gradient(60%_60%_at_0%_100%,rgba(154,139,114,0.18),transparent_70%)]" />
        <Container>
          <div className="grid items-center gap-12 pb-14 pt-10 lg:grid-cols-12 lg:gap-16 lg:pb-32 lg:pt-14">
            <div className="hero-stage lg:col-span-6 xl:col-span-7">
              <div data-stage="0"><Breadcrumbs items={crumbs} light /></div>
              <p className="eyebrow mb-4 mt-7 text-bronze-300" data-stage="0">{CATEGORY_LABEL[s.category]}</p>
              <h1 className="text-5xl text-white"><StagedHeading text={s.hero.h1} /></h1>
              {s.hero.subtitle && s.hero.subtitle !== s.name && <p className="mt-4 text-xl font-semibold text-bronze-300" data-stage="3">{s.hero.subtitle}</p>}
              {s.hero.text && <p className="mt-4 max-w-xl text-lg text-white/80" data-stage="3">{s.hero.text}</p>}
              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap" data-stage="4">
                <Button href={site.bookingUrl} size="lg" arrow>Book a consultation</Button>
                <Button href={`tel:${site.phone.tel}`} variant="outline" size="lg" external={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
              </div>
              <div data-stage="5"><TrustRow light className="mt-8" /></div>
            </div>
            <div data-hero-media className="relative mx-auto w-full max-w-[420px] lg:col-span-6 lg:max-w-[520px] xl:col-span-5">
              <PhotoFrame image={s.hero.image} priority sizes="(min-width: 1024px) 520px, 90vw" frameClassName="rounded-2xl" />
            </div>
          </div>
        </Container>
      </header>

      {/* ---------- Quick facts, overlapping the hero ---------- */}
      <div className="relative z-10 mt-8 lg:-mt-16">
        <Container>
          <ul data-stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {quickFacts.map((f) => {
              const I = Icon[f.icon];
              return (
                <Reveal as="li" key={f.title} className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-lift ring-1 ring-ink-900/5 sm:flex-row sm:items-center sm:p-5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-olive-100 text-olive-700"><I className="h-5 w-5" /></span>
                  <span><span className="block font-semibold text-ink-900">{f.title}</span><span className="block text-sm text-grey-700">{f.text}</span></span>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </div>

<div className="mt-12" aria-hidden="true" />

      <SectionNav items={nav} label={`${s.name}: on this page`} />

      {/* ---------- Overview: text beside a two-photo collage ---------- */}
      <Section id="overview" className="scroll-mt-32 bg-warm">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <RichHeading eyebrow="Overview" heading={introHeading} />
              <div className="mt-6 space-y-4 text-lg text-grey-700">
                {(s.intro.paragraphs.length ? s.intro.paragraphs : [s.hero.text]).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button href={site.bookingUrl} arrow>Book a consultation</Button>
                <a href="#how-it-works" className="link-arrow">See how it works <Icon.arrow className="h-4 w-4" /></a>
              </div>
            </div>
            <div className="lg:col-span-6">
              <PhotoCollage main={pic(1)} second={pic(2)}>
                <FloatingBadge className="bottom-28 left-0 sm:-left-4" icon={<Icon.user className="h-5 w-5" />} title="Planned in our office" text="3D imaging, start to finish" />
              </PhotoCollage>
            </div>
          </div>
          {children.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl">Treatments in {inSentence(s.name)}</h3>
              <CardList items={children} className="mt-6" />
            </div>
          )}
        </Container>
      </Section>

      {/* ---------- What it is: icon cards ---------- */}
      {hasWhat && (
        <Section id="what-it-is" className="scroll-mt-32 relative isolate overflow-hidden bg-white">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <RichHeading eyebrow="What it is" heading={s.understanding.heading} lead={s.understanding.intro || undefined} />
                {s.understanding.bullets && s.understanding.bullets.length > 0 && (
                  <ul className="mt-6 space-y-3">{s.understanding.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>
                )}
              </div>
              <div className="lg:col-span-7">
                {s.understanding.items.length > 0 ? (
                  <ul data-stagger className="fill-odd grid gap-4 sm:grid-cols-2">
                    {s.understanding.items.map((it, i) => (
                      <Reveal as="li" key={it.title + i}><IconCard icon={CARD_ICONS[i % CARD_ICONS.length]} title={it.title} text={it.text} /></Reveal>
                    ))}
                  </ul>
                ) : (
                  <PhotoFrame image={s.understanding.image} sizes="(min-width: 1024px) 640px, 100vw" accent="sand" />
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- Who it's for: photo beside a checklist panel ---------- */}
      {hasWho && (
        <Section id="who-its-for" className="scroll-mt-32 bg-sand-50">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="order-2 lg:order-1 lg:col-span-5">
                <PhotoFrame image={pic(3)} sizes="(min-width: 1024px) 480px, 100vw" arch accent="olive" accentSide="left" className="mx-auto max-w-[460px]" />
              </div>
              <div className="order-1 lg:order-2 lg:col-span-7">
                <RichHeading eyebrow="Who it's for" heading={s.candidate.heading} lead={s.candidate.text || undefined} />
                {s.candidate.bullets.length > 0 && (
                  <ul className="mt-8 grid gap-3 rounded-lg bg-white p-6 ring-1 ring-ink-900/[0.07] sm:grid-cols-2 sm:p-8">
                    {s.candidate.bullets.map((b) => <Check key={b}>{b}</Check>)}
                  </ul>
                )}
                <div className="mt-6 flex items-start gap-3 rounded-lg bg-olive-700 p-5 text-white">
                  <Icon.heart className="mt-0.5 h-5 w-5 shrink-0 text-bronze-300" />
                  <p>Not sure? We will tell you honestly at your consultation, including when another option suits you better.</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- How it works: connected step cards ---------- */}
      {s.process.steps.length > 0 && (
        <Section id="how-it-works" className="scroll-mt-32 bg-white">
          <Container>
            <RichHeading eyebrow="How it works" heading={s.process.heading} lead={s.process.intro || undefined} align="center" />
            <div className="relative mt-14">
              <div aria-hidden="true" data-reveal="" className="draw-x absolute left-[8%] right-[8%] top-7 hidden h-0.5 origin-left bg-olive-600/30 lg:block" />
              <ol data-stagger className={cn("fill-odd-until-lg relative grid gap-6 sm:grid-cols-2", STEP_COLS[s.process.steps.length] ?? "lg:grid-cols-3")}>
                {s.process.steps.map((st, i) => (
                  <Reveal as="li" key={st.title + i} className="relative flex flex-col items-center text-center">
                    <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-olive-600 font-display text-xl font-semibold text-white ring-8 ring-white">{i + 1}</span>
                    <div className="mt-5 h-full w-full rounded-lg bg-warm p-6 ring-1 ring-ink-900/[0.06]">
                      <h3 className="text-xl">{st.title}</h3>
                      <p className="mt-2 text-grey-700">{st.text}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
            <p className="mt-10 text-center text-grey-700">Questions about your own case? <a href={`tel:${site.phone.tel}`} className="font-semibold text-olive-700 underline-offset-4 hover:underline">Call {site.phone.display}</a></p>
          </Container>
        </Section>
      )}

      {/* ---------- Why patients choose us: dark section with photo and numbered reasons ---------- */}
      {s.why.cards.length > 0 && (
        <Section id="why-here" className="scroll-mt-32 relative isolate overflow-hidden bg-ink-900 text-white">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_70%_at_0%_0%,rgba(91,107,90,0.45),transparent_60%)]" />
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <RichHeading eyebrow="Why patients choose us" heading={s.why.heading} lead={s.why.intro || undefined} dark />
                <PhotoFrame image={pic(4)} sizes="(min-width: 1024px) 460px, 100vw" className="mt-10" accent="olive" />
              </div>
              <ul data-stagger className="fill-odd grid content-start gap-4 sm:grid-cols-2 lg:col-span-7">
                {s.why.cards.map((c, i) => (
                  <Reveal as="li" key={c.title}><IconCard dark number={i + 1} icon={CARD_ICONS[(i + 2) % CARD_ICONS.length]} title={c.title} text={c.text} /></Reveal>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- Care, tables and extra detail ---------- */}
      {hasDetails && (
        <Section id="details" className="scroll-mt-32 bg-warm">
          <Container>
            <div className="mx-auto max-w-5xl space-y-14">
              {s.care && (
                <div>
                  <RichHeading eyebrow="Before & after your visit" heading={s.care.heading} lead={s.care.intro || undefined} />
                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    {([["Before your appointment", s.care.before, "calendar"], ["After your appointment", s.care.after, "heart"]] as const).map(([t, items, ic]) => items.length > 0 && (
                      <div key={t} className="rounded-lg bg-white p-6 ring-1 ring-ink-900/[0.07] sm:p-8">
                        <div className="flex items-center gap-3"><span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-olive-100 text-olive-700">{ic === "calendar" ? <Icon.calendar className="h-5 w-5" /> : <Icon.heart className="h-5 w-5" />}</span><h3 className="text-xl">{t}</h3></div>
                        <ul className="mt-5 space-y-3">{items.map((b) => <Check key={b}>{b}</Check>)}</ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {s.tables?.map((t) => (
                <div key={t.heading}>
                  <RichHeading heading={t.heading} lead={t.text || undefined} />
                  <div className="mt-6 overflow-x-auto rounded-lg bg-white ring-1 ring-ink-900/10" tabIndex={0} role="region" aria-label={t.heading}>
                    <table className="w-full min-w-[34rem] text-base sm:text-[0.95rem]">
                      <thead className="bg-ink-900 text-left text-white"><tr>{t.rows[0].map((c, i) => <th key={i} scope="col" className="px-5 py-3.5 font-semibold">{c}</th>)}</tr></thead>
                      <tbody>{t.rows.slice(1).map((r, i) => <tr key={i} className="border-t border-ink-900/10 even:bg-warm/60">{r.map((c, j) => <td key={j} className={cn("px-5 py-3.5 align-top", j === 0 && "font-semibold text-ink-900")}>{c}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </div>
              ))}
              {s.extra.map((e) => (
                <div key={e.heading} className="rounded-lg bg-white p-6 ring-1 ring-ink-900/[0.07] sm:p-10">
                  <h2 className="text-3xl">{e.heading}</h2>
                  <div className="mt-4 max-w-[68ch] space-y-4 text-grey-700">{e.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
                  {e.bullets.length > 0 && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{e.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>}
                  {e.cards.length > 0 && (
                    <ul className="fill-odd mt-6 grid gap-4 sm:grid-cols-2">
                      {e.cards.map((c, i) => <li key={c.title}><IconCard icon={CARD_ICONS[(i + 4) % CARD_ICONS.length]} title={c.title} text={c.text} className="bg-warm ring-0" /></li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- Questions: doctor card beside the accordion ---------- */}
      {s.faqs.length > 0 && (
        <Section id="questions" className="scroll-mt-32 bg-white">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-36">
                  <RichHeading eyebrow="Questions" heading={`Questions patients ask about ${inSentence(s.name)}`} />
                  {doctor && (
                    <div className="mt-8 overflow-hidden rounded-lg bg-warm ring-1 ring-ink-900/[0.07]">
                      <div className="flex items-center gap-4 p-5">
                        <div className="w-20 shrink-0"><PhotoFrame image={doctor.image} sizes="80px" arch /></div>
                        <div>
                          <p className="font-semibold text-ink-900">Answered by {doctor.name}, {doctor.credentials}</p>
                          <p className="mt-0.5 text-sm text-grey-700">Have another question? Ask us directly.</p>
                        </div>
                      </div>
                      <div className="grid gap-2 border-t border-ink-900/10 p-5">
                        <Button href={`tel:${site.phone.tel}`} external={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
                        <Button href="/contact/" variant="outline">Send us a note</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-8">
                <FaqList items={s.faqs} />
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- A review, related treatments and the closing call to action ---------- */}
      <Section className="bg-warm">
        <Container>
          {quote && (
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <QuoteHighlight t={quote} className="lg:col-span-8" />
              <div className="lg:col-span-4">
                <p className="eyebrow mb-3">From our Google reviews</p>
                <p className="font-display text-6xl font-semibold text-ink-900">{site.rating.value}<Icon.star className="ml-2 inline h-9 w-9 -translate-y-1.5 text-amber-400" /></p>
                <p className="mt-2 text-grey-700">Average from {site.rating.count} Google reviews by local patients, shown exactly as written.</p>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow mt-3">Read them on Google <Icon.arrow className="h-4 w-4" /></a>
              </div>
            </div>
          )}
          {related.length > 0 && (
            <div className="mt-20">
              <RichHeading eyebrow="Related" heading="Treatments patients often consider alongside this" />
              <CardList items={related} className="mt-8" wideCols={4} wideAt="lg" avoid={photos.map((p) => p.src)} />
            </div>
          )}
          <CtaBanner className="mt-20" heading={s.cta.heading} text={s.cta.text} image={pic(5)} buttonLabel={s.cta.buttonLabel || "Book a consultation"} />
        </Container>
      </Section>

      <JsonLd data={graph([webPageNode(s.path, s.seo.title, s.seo.description), breadcrumbNode(crumbs), serviceNode(s), serviceOfferNode(s), faqNode(s.faqs)])} />
    </article>
  );
}
