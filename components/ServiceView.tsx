import type { Service, SiteImage } from "@/lib/types";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";
import { breadcrumbNode, faqNode, graph, JsonLd, serviceNode, serviceOfferNode, webPageNode } from "@/lib/seo";
import { PageHero } from "@/components/sections/Hero";
import { FaqList } from "@/components/sections/Faq";
import { CardList } from "@/components/sections/ServicesHub";
import { IconCard } from "@/components/rich/Blocks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
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
  const all = await getServices();
  const related = s.related.map((slug) => all.find((x) => x.slug === slug)).filter((x): x is Service => !!x);
  const children = all.filter((x) => x.parentPath === s.path);
  const crumbs = [{ name: "Home", path: "/" }, ...(s.parentPath !== "/services/" ? [{ name: "Services", path: "/services/" }] : []), { name: PARENT_NAMES[s.parentPath] ?? "Services", path: s.parentPath }, { name: s.name, path: s.path }].filter((c, i, a) => a.findIndex((x) => x.path === c.path) === i);
  const introHeading = s.intro.heading === s.hero.subtitle ? `${s.name} at Valencia Dentistry` : s.intro.heading;
  const hasWhat = s.understanding.items.length > 0 || !!s.understanding.intro || (s.understanding.bullets?.length ?? 0) > 0;
  const hasWho = !!s.candidate.text || s.candidate.bullets.length > 0;
  const hasDetails = !!s.care || (s.tables?.length ?? 0) > 0 || s.extra.length > 0;
  const photos = photosFor(s);
  const pic = (i: number) => photos[i % photos.length];

  const book = site.bookingUrl;
  const benefits = s.understanding.items.length ? s.understanding.items : s.why.cards;
  const features = s.understanding.items.length ? s.why.cards : [];
  const lower = inSentence(s.name);

  // Beverly Hills structure: photo banner, what it is, benefits accordion beside a photo (olive), who it's for,
  // the treatment process, why patients choose us (olive), a full-width photo, care details, a call to action
  // over a photo, and the questions.
  return (
    <article>
      <div className="reading-progress" aria-hidden="true" />

      <PageHero crumbs={crumbs} heading={s.hero.h1} sub={CATEGORY_LABEL[s.category]} lead={s.hero.subtitle && s.hero.subtitle !== s.name ? s.hero.subtitle : s.hero.text} image={s.hero.image} primary={{ label: "Schedule Appointment", href: book }} secondary={{ label: site.phone.display, href: `tel:${site.phone.tel}` }} />

      {/* ---------- What it is ---------- */}
      <Section id="overview" className="scroll-mt-28 bg-warm">
        <Container>
          <div className="max-w-3xl">
            <h2>{hasWhat ? s.understanding.heading : introHeading}</h2>
            <div className="mt-4 space-y-4 text-grey-700">
              {(s.intro.paragraphs.length ? s.intro.paragraphs : [s.hero.text]).map((p, i) => <p key={i}>{p}</p>)}
              {hasWhat && s.understanding.intro && <p>{s.understanding.intro}</p>}
            </div>
            {s.understanding.bullets && s.understanding.bullets.length > 0 && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{s.understanding.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>}
          </div>
          {children.length > 0 && (
            <div className="mt-14">
              <h3>Treatments in {lower}</h3>
              <CardList items={children} className="mt-6" />
            </div>
          )}
        </Container>
      </Section>

      {/* ---------- Benefits: photo beside an accordion (olive) ---------- */}
      {benefits.length > 0 && (
        <Section id="benefits" className="scroll-mt-28 bg-olive-900 text-white">
          <Container>
            <h2 className="uppercase text-white">Benefits &amp; care of {s.name}</h2>
            <p className="mt-2 text-white/75">What {lower} can do for you, and how we take care of it over the years.</p>
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg"><Picture image={pic(1)} fill cropTo={4 / 3} sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" /></div>
              <div className="divide-y divide-white/15 border-y border-white/15">
                {benefits.map((it, i) => (
                  <details key={it.title + i} className="faq-item group" name="benefits" open={i === 0 || undefined}>
                    <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 py-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                      <span>{it.title}</span>
                      <span aria-hidden="true" className="text-xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <div className="faq-answer pb-5 text-white/80"><p>{it.text}</p></div>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- Who it's for ---------- */}
      {hasWho && (
        <Section id="who-its-for" className="scroll-mt-28 bg-warm">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <h2>{s.candidate.heading}</h2>
                {s.candidate.text && <p className="mt-4 text-grey-700">{s.candidate.text}</p>}
                {s.candidate.bullets.length > 0 && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{s.candidate.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>}
                <p className="mt-6 text-grey-700">Not sure? We will tell you honestly at your consultation, including when another option suits you better.</p>
              </div>
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded-lg lg:col-span-5 lg:block"><Picture image={pic(2)} fill cropTo={4 / 3} sizes="480px" className="object-cover" /></div>
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- The treatment process ---------- */}
      {s.process.steps.length > 0 && (
        <Section id="how-it-works" className="scroll-mt-28 bg-greige-50">
          <Container>
            <div className="grid items-end gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h2 className="uppercase">{s.process.heading}</h2>
                {s.process.intro && <p className="mt-3 text-grey-700">{s.process.intro}</p>}
              </div>
              <div className="hidden grid-cols-2 gap-4 sm:grid lg:col-span-7">
                {[pic(3), pic(4)].map((im, i) => <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg"><Picture image={im} fill cropTo={4 / 3} sizes="(min-width: 1024px) 380px, 50vw" className="object-cover" /></div>)}
              </div>
            </div>
            <ol data-stagger className={cn("mt-12 grid gap-8 sm:grid-cols-2", STEP_COLS[s.process.steps.length] ?? "lg:grid-cols-3")}>
              {s.process.steps.map((st, i) => (
                <Reveal as="li" key={st.title + i} className="border-t border-ink-900/15 pt-5">
                  <span className="text-sm font-semibold text-olive-600">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 uppercase">{st.title}</h3>
                  <p className="mt-2 text-grey-700">{st.text}</p>
                </Reveal>
              ))}
            </ol>
          </Container>
        </Section>
      )}

      {/* ---------- Why patients choose us (olive) ---------- */}
      {features.length > 0 && (
        <Section id="why-here" className="scroll-mt-28 bg-olive-900 text-white">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <h2 className="uppercase text-white">{s.why.heading}</h2>
                {s.why.intro && <p className="mt-3 text-white/75">{s.why.intro}</p>}
              </div>
              <ul data-stagger className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
                {features.map((c, i) => {
                  const I = Icon[CARD_ICONS[(i + 2) % CARD_ICONS.length]];
                  return (
                    <Reveal as="li" key={c.title}>
                      <I className="h-8 w-8 text-bronze-300" />
                      <h3 className="mt-3 text-white">{c.title}</h3>
                      <p className="mt-2 text-white/75">{c.text}</p>
                    </Reveal>
                  );
                })}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- Full-width photo ---------- */}
      <div className="relative h-[260px] sm:h-[420px]"><Picture image={pic(5)} fill sizes="100vw" className="object-cover" /></div>

      {/* ---------- Care and extra detail ---------- */}
      {hasDetails && (
        <Section id="details" className="scroll-mt-28 bg-warm">
          <Container>
            <div className="mx-auto max-w-5xl space-y-14">
              {s.care && (
                <div>
                  <h2>{s.care.heading}</h2>
                  {s.care.intro && <p className="mt-3 text-grey-700">{s.care.intro}</p>}
                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    {([["Before your appointment", s.care.before], ["After your appointment", s.care.after]] as const).map(([t, items]) => items.length > 0 && (
                      <div key={t} className="border-t border-ink-900/15 pt-5">
                        <h3>{t}</h3>
                        <ul className="mt-4 space-y-3">{items.map((b) => <Check key={b}>{b}</Check>)}</ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {s.tables?.map((t) => (
                <div key={t.heading}>
                  <h2>{t.heading}</h2>
                  {t.text && <p className="mt-3 text-grey-700">{t.text}</p>}
                  <div className="mt-6 overflow-x-auto rounded-lg bg-offwhite ring-1 ring-ink-900/10" tabIndex={0} role="region" aria-label={t.heading}>
                    <table className="w-full min-w-[34rem]">
                      <thead className="bg-olive-900 text-left text-white"><tr>{t.rows[0].map((c, i) => <th key={i} scope="col" className="px-5 py-3.5 font-semibold">{c}</th>)}</tr></thead>
                      <tbody>{t.rows.slice(1).map((r, i) => <tr key={i} className="border-t border-ink-900/10">{r.map((c, j) => <td key={j} className={cn("px-5 py-3.5 align-top", j === 0 && "font-semibold text-ink-900")}>{c}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </div>
              ))}
              {s.extra.map((e) => (
                <div key={e.heading}>
                  <h2>{e.heading}</h2>
                  <div className="mt-4 max-w-[68ch] space-y-4 text-grey-700">{e.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
                  {e.bullets.length > 0 && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{e.bullets.map((b) => <Check key={b}>{b}</Check>)}</ul>}
                  {e.cards.length > 0 && (
                    <ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                      {e.cards.map((c, i) => <li key={c.title}><IconCard icon={CARD_ICONS[(i + 4) % CARD_ICONS.length]} title={c.title} text={c.text} /></li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ---------- Call to action over a photo ---------- */}
      <section className="on-dark relative isolate overflow-hidden text-white">
        <Picture image={pic(6)} fill sizes="100vw" className="-z-20 object-cover" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-olive-900/80" />
        <Container className="py-14 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="uppercase text-white">{s.name} in Santa Clarita</h2>
            <p className="mt-3 text-white/85">{s.cta.text}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={book} target="_blank" rel="noopener noreferrer" className="btn btn-light">{s.cta.buttonLabel || "Book a consultation"}</a>
              <a href={`tel:${site.phone.tel}`} className="btn border border-white text-white hover:bg-white hover:text-olive-900">{site.phone.display}</a>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Questions ---------- */}
      {s.faqs.length > 0 && (
        <Section id="questions" className="scroll-mt-28 bg-warm">
          <Container>
            <div className="text-center">
              <h2 className="uppercase">Frequently asked questions about {lower}</h2>
              <p className="mt-2 text-grey-700">The questions patients ask most often before starting treatment.</p>
            </div>
            <FaqList items={s.faqs} className="mx-auto mt-10 max-w-4xl" />
          </Container>
        </Section>
      )}

      {/* ---------- Related treatments ---------- */}
      {related.length > 0 && (
        <Section tight className="bg-greige-50">
          <Container>
            <h2>Related treatments</h2>
            <CardList items={related} className="mt-8" wideCols={4} wideAt="lg" avoid={photos.map((p) => p.src)} />
          </Container>
        </Section>
      )}

      <JsonLd data={graph([webPageNode(s.path, s.seo.title, s.seo.description), breadcrumbNode(crumbs), serviceNode(s), serviceOfferNode(s), faqNode(s.faqs)])} />
    </article>
  );
}
