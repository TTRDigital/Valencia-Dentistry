import type { Service, SiteImage } from "@/lib/types";
import { getServices } from "@/lib/content";
import { site } from "@/lib/site";
import { breadcrumbNode, faqNode, graph, JsonLd, serviceNode, serviceOfferNode, webPageNode } from "@/lib/seo";
import { PageHero } from "@/components/sections/Hero";
import { FaqList } from "@/components/sections/Faq";
import { CardList, servicePhotos } from "@/components/sections/ServicesHub";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Container, Section } from "@/components/ui/Section";
import { cn, distinctPhotos, inSentence } from "@/lib/utils";

export { Breadcrumbs };

const PARENT_NAMES: Record<string, string> = {
  "/services/": "Services",
  "/services/cosmetic-dentistry/": "Cosmetic Dentistry",
  "/services/oral-surgery/": "Oral Surgery",
  "/services/restorative-dentistry/": "Restorative Dentistry",
};
const CATEGORY_LABEL: Record<string, string> = { cosmetic: "Cosmetic dentistry", restorative: "Restorative dentistry", surgical: "Oral surgery", holistic: "Holistic dentistry", preventive: "Jaw & comfort care" };

const WHY_ICONS: IconName[] = ["tooth", "sparkle", "shield", "heart"];
const R = (n: string, alt: string): SiteImage => ({ src: `/images/real/${n}.jpg`, alt: `${alt} at Valencia Dentistry` });
/** Rooms first for the full-width call to action (no faces to crop), then other real scenes. */
const ROOM_POOL: SiteImage[] = [R("treatment-room-2", "A calm treatment room with natural light"), R("treatment-room", "A bright treatment room")];
const SCENE_POOL: SiteImage[] = [R("xray-screen", "A panoramic X-ray on screen"), R("smile-plan-screen", "A digital smile plan on screen"), R("scan-intraoral", "A digital iTero scan"), R("implant-model-hands", "Showing a patient a dental implant model"), R("scan-hygienist", "A digital scan with a hygienist"), R("cleaning", "A hygienist cleaning a patient's teeth"), R("smile-design", "A patient viewing her smile design on screen"), R("tryin-smile", "A patient smiling during a try-in"), R("xray-consult", "Reviewing implant X-rays with a patient"), R("smile-plan-screen-2", "Explaining a smile plan to a patient"), R("scan-closeup", "A digital scan of a patient's teeth"), R("denture-closeup", "A close look at a full-arch restoration")];


export async function ServiceView({ s }: { s: Service }) {
  const all = await getServices();
  const children = all.filter((x) => x.parentPath === s.path);
  const crumbs = [{ name: "Home", path: "/" }, ...(s.parentPath !== "/services/" ? [{ name: "Services", path: "/services/" }] : []), { name: PARENT_NAMES[s.parentPath] ?? "Services", path: s.parentPath }, { name: s.name, path: s.path }].filter((c, i, a) => a.findIndex((x) => x.path === c.path) === i);
  const introHeading = s.intro.heading === s.hero.subtitle ? `${s.name} at Valencia Dentistry` : s.intro.heading;
  const hasWhat = s.understanding.items.length > 0 || !!s.understanding.intro || (s.understanding.bullets?.length ?? 0) > 0;
  const hasWho = !!s.candidate.text || s.candidate.bullets.length > 0;

  const book = site.bookingUrl;
  const lower = inSentence(s.name);
  // the category cards claim their photos first, then the sections below pick ones not used yet
  const childPhotos = distinctPhotos(children, servicePhotos, [s.hero.image.src]);
  const used = new Set<string>([s.hero.image.src, ...childPhotos.map((p) => p?.src).filter((x): x is string => !!x)]);
  const take = (pref: (SiteImage | undefined)[], pool: SiteImage[] = SCENE_POOL) => {
    const pick = [...pref, ...pool].find((im) => im?.src && !used.has(im.src));
    if (pick) used.add(pick.src);
    return pick ?? s.hero.image;
  };
  // Benefits & care accordion: what it is, the benefits, who it suits, before/after care, extra notes, tables
  const what = s.understanding.items.length ? s.understanding.items : [];
  const reasons = s.understanding.items.length ? s.why.cards : [];
  const benefits = what.length ? what : s.why.cards;
  const acc: { title: string; body: React.ReactNode }[] = [
    { title: `What ${/s$/.test(s.name) ? "are" : "is"} ${lower}?`, body: <p>{s.hero.text || s.intro.paragraphs[0]}</p> },
    ...benefits.map((c) => ({ title: c.title, body: <p>{c.text}</p> })),
    ...(hasWho ? [{ title: s.candidate.heading, body: <>{s.candidate.text && <p>{s.candidate.text}</p>}{s.candidate.bullets.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5">{s.candidate.bullets.map((x) => <li key={x}>{x}</li>)}</ul>}</> }] : []),
    ...(s.care ? ([["Before your appointment", s.care.before], ["After your appointment", s.care.after]] as const).filter(([, l]) => l.length).map(([t, l]) => ({ title: t, body: <ul className="list-disc space-y-1 pl-5">{l.map((x) => <li key={x}>{x}</li>)}</ul> })) : []),
    ...(s.tables ?? []).map((t) => ({ title: t.heading, body: <div className="overflow-x-auto"><table className="w-full min-w-[28rem] text-[0.9375rem]"><thead><tr>{t.rows[0].map((c, i) => <th key={i} scope="col" className="border-b border-white/25 py-2 pr-4 text-left font-semibold text-white">{c}</th>)}</tr></thead><tbody>{t.rows.slice(1).map((r, i) => <tr key={i} className="border-b border-white/10">{r.map((c, j) => <td key={j} className={cn("py-2 pr-4 align-top", j === 0 && "font-semibold text-white")}>{c}</td>)}</tr>)}</tbody></table></div> })),
    ...s.extra.map((e) => ({ title: e.heading, body: <>{e.paragraphs.map((x, i) => <p key={i} className={i ? "mt-3" : undefined}>{x}</p>)}{e.bullets.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5">{e.bullets.map((x) => <li key={x}>{x}</li>)}</ul>}{e.cards.map((c) => <p key={c.title} className="mt-3"><strong className="text-white">{c.title}.</strong> {c.text}</p>)}</> })),
  ];
  const accPhoto = take([s.understanding.image, ...s.why.cards.map((c) => c.image)]);
  const stepPhotos = s.process.steps.map(() => take([s.candidate.image, ...s.why.cards.map((c) => c.image)]));
  const whyPts = (reasons.length ? reasons : what.length ? [] : s.why.cards).slice(0, 4);
  const ctaPhoto = take([], ROOM_POOL.concat(SCENE_POOL));

  return (
    <article>
      <div className="reading-progress" aria-hidden="true" />

      {/* 1. Photo banner */}
      <PageHero crumbs={crumbs} heading={s.hero.h1} sub={CATEGORY_LABEL[s.category]} lead={s.hero.subtitle && s.hero.subtitle !== s.name ? s.hero.subtitle : s.hero.text} image={s.hero.image} />

      {/* 2. What it is */}
      <Section id="overview" className="scroll-mt-28 bg-warm">
        <Container>
          <div className="max-w-3xl">
            <h2>{hasWhat ? s.understanding.heading : introHeading}</h2>
            <div className="mt-4 space-y-4 text-grey-700">
              {(s.intro.paragraphs.length ? s.intro.paragraphs : [s.hero.text]).map((p, i) => <p key={i}>{p}</p>)}
              {hasWhat && s.understanding.intro && <p>{s.understanding.intro}</p>}
              {s.understanding.bullets && s.understanding.bullets.length > 0 && <p>{s.understanding.bullets.join(" · ")}</p>}
            </div>
          </div>
          {children.length > 0 && (
            <div className="mt-12">
              <h3>Treatments in {lower}</h3>
              <CardList items={children} className="mt-6" avoid={[s.hero.image.src]} />
            </div>
          )}
        </Container>
      </Section>

      {/* 3. Benefits & care: photo beside the accordion (olive) */}
      <Section id="benefits" className="scroll-mt-28 bg-olive-900 text-white">
        <Container>
          <h2 className="uppercase text-white">Benefits &amp; care of {s.name}</h2>
          <p className="mt-2 text-white/80">What {lower} can do for you, who it suits, and what keeps it looking right over the years.</p>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28"><Picture image={accPhoto} fill cropTo={4 / 5} sizes="(min-width: 1024px) 560px, 100vw" className="object-cover object-top" /></div>
            <div>
              {acc.map((it, i) => (
                <details key={it.title + i} className="faq-item group" name="benefits" open={i === 0 || undefined}>
                  <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 py-3 text-xl font-semibold text-white [&::-webkit-details-marker]:hidden">
                    <span>{it.title}</span>
                    <span aria-hidden="true" className="shrink-0 text-2xl font-light leading-none"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span>
                  </summary>
                  <div className="faq-answer pb-4 text-white/85">{it.body}</div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. The treatment process: heading and intro on top, then every step with its photo in one row */}
      {s.process.steps.length > 0 && (
        <Section id="how-it-works" className="scroll-mt-28 bg-warm">
          <Container>
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-12">
              <h2 className="uppercase lg:col-span-6">{s.process.heading}</h2>
              {s.process.intro && <p className="text-grey-700 lg:col-span-6">{s.process.intro}</p>}
            </div>
            <ol className={cn("mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2", s.process.steps.length === 4 ? "lg:grid-cols-4" : s.process.steps.length === 2 ? "" : "lg:grid-cols-3")}>
              {s.process.steps.map((st, i) => (
                <li key={st.title + i}>
                  <div className="relative aspect-[4/3] overflow-hidden"><Picture image={stepPhotos[i]} fill cropTo={4 / 3} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" /></div>
                  <p className="mt-5 text-sm font-semibold text-olive-600">Step {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 uppercase">{st.title}</h3>
                  <p className="mt-2 text-grey-700">{st.text}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      )}

      {/* 5. Why patients choose us, exactly like Ideal Dental's icon section: heading, intro and a link on the
             left; four blocks on the right (2 x 2), each a large line icon, a 20px title and a short line. Olive, not black. */}
      {whyPts.length > 0 && (
        <Section id="why-here" className="scroll-mt-28 bg-olive-900 text-white">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5 lg:self-center lg:pr-8">
                <h2 className="uppercase text-white">{s.why.heading}</h2>
                {s.why.intro && <p className="mt-4 text-white/90">{s.why.intro}</p>}
                <a href={book} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-bronze-300 underline underline-offset-4 hover:text-white">Schedule your consultation</a>
              </div>
              <ul className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:col-span-7">
                {whyPts.map((c, i) => {
                  const I = Icon[WHY_ICONS[i % WHY_ICONS.length]];
                  return (
                    <li key={c.title}>
                      <I className="h-16 w-16 stroke-[1.1] text-white" />
                      <h3 className="mt-5 text-white">{c.title}</h3>
                      <p className="mt-2 text-white/90">{c.text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Container>
        </Section>
      )}

      {/* 6. Full-width photo with the call to action */}
      <section className="on-dark relative isolate flex min-h-[460px] items-center overflow-hidden text-white sm:min-h-[600px]">
        <Picture image={ctaPhoto} fill sizes="100vw" className="-z-20 object-cover" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-olive-900/90 via-olive-900/60 to-olive-900/20" />
        <Container className="w-full py-14">
          <div className="max-w-2xl">
            <h2 className="uppercase text-white">{s.name} in Santa Clarita</h2>
            <p className="mt-3 text-white/90">{s.cta.text}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={book} target="_blank" rel="noopener noreferrer" className="btn btn-light">{s.cta.buttonLabel || "Book a consultation"}</a>
              <a href={`tel:${site.phone.tel}`} className="btn border border-white text-white hover:bg-white hover:text-olive-900">{site.phone.display}</a>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Frequently asked questions */}
      {s.faqs.length > 0 && (
        <Section id="questions" className="scroll-mt-28 bg-warm">
          <Container>
            <div className="text-center">
              <h2 className="uppercase">Frequently asked questions about {lower}</h2>
              <p className="mt-2 text-grey-700">The questions patients ask most often before starting treatment.</p>
            </div>
            <FaqList items={s.faqs} plain className="mx-auto mt-10 max-w-4xl" />
          </Container>
        </Section>
      )}

      <JsonLd data={graph([webPageNode(s.path, s.seo.title, s.seo.description), breadcrumbNode(crumbs), serviceNode(s), serviceOfferNode(s), faqNode(s.faqs)])} />
    </article>
  );
}
