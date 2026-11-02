import Link from "next/link";
import type { InsuranceSection, OfferSection, PhotoGridSection, RichTextSection, TeamSection } from "@/lib/types";
import { getPeople } from "@/lib/content";
import { site } from "@/lib/site";
import { Markdown } from "@/components/blocks/Markdown";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export function RichText({ s }: { s: RichTextSection }) {
  return (
    <Section tight>
      <Container>
        {s.heading && s.narrow !== false ? (
          // Highlighted guidance: a dark panel with the heading and a call button beside the text card
          <div className="grid overflow-hidden rounded-lg ring-1 ring-ink-900/10 lg:grid-cols-12">
            <div className="on-dark relative isolate overflow-hidden bg-olive-700 p-7 text-white sm:p-10 lg:col-span-4">
              <Icon.bolt className="h-10 w-10 text-bronze-300" />
              <h2 className="mt-5 text-white">{s.heading}</h2>
              <p className="mt-3 text-white/85">In pain? Call us first. Same-day emergency appointments are available.</p>
              <Button href={`tel:${site.phone.tel}`} variant="light" className="mt-6" external={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
            </div>
            <div className="bg-white p-7 sm:p-10 lg:col-span-8">
              <Markdown source={s.body} />
            </div>
          </div>
        ) : (
          <div className={s.narrow !== false ? "max-w-[72ch]" : ""}>
            {s.heading && <h2 className="mb-6">{s.heading}</h2>}
            <Markdown source={s.body} />
          </div>
        )}
      </Container>
    </Section>
  );
}

/** Doctor / team rows: 50/50 split, black text panel and full-height photo, alternating sides (Ideal style). */
export async function Team({ s }: { s: TeamSection }) {
  const people = await getPeople();
  const list = s.slugs?.length ? people.filter((p) => s.slugs!.includes(p.slug)) : people;
  return (
    <Section id="team" className="bg-greige-50" aria-labelledby="team-heading">
      <Container>
        <Reveal className="max-w-3xl">
          {s.eyebrow && <p className="eyebrow mb-4">{s.eyebrow}</p>}
          <h2 id="team-heading" className="text-4xl">{s.heading}</h2>
          {s.lead && <p className="mt-4 text-lg text-grey-700">{s.lead}</p>}
        </Reveal>
        {list.map((p) => (
          <article key={p.slug} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Profile card: portrait and the essentials, kept in view while the bio scrolls */}
            <div className="lg:col-span-4">
              <div className="overflow-hidden rounded-lg bg-white ring-1 ring-ink-900/10 lg:sticky lg:top-24">
                <Picture image={p.image} sizes="(min-width: 1024px) 380px, 100vw" cropTo={4 / 5} className="aspect-[4/5] w-full object-cover object-top" />
                <div className="p-5">
                  <h3 className="text-2xl">{p.name}{p.credentials ? `, ${p.credentials}` : ""}</h3>
                  <p className="mt-1 text-sm font-semibold text-olive-700">{p.role}</p>
                  <Button href={site.bookingUrl} size="sm" className="mt-4" arrow>Book with Dr. Lavi</Button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="max-w-[66ch] space-y-5 text-lg text-grey-700">{p.bio.map((b, k) => <Reveal key={k} delay={Math.min(k, 3) * 60}><p>{b}</p></Reveal>)}</div>
              {p.highlights && (
                <ul className="mt-10 grid gap-x-8 gap-y-4 border-t border-ink-900/10 pt-8 sm:grid-cols-2">
                  {p.highlights.map((h) => <li key={h} className="flex items-start gap-3 text-grey-900"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-olive-600" aria-hidden="true" />{h}</li>)}
                </ul>
              )}
            </div>
          </article>
        ))}
      </Container>
    </Section>
  );
}

export function PhotoGrid({ s }: { s: PhotoGridSection }) {
  return (
    <Section className="bg-sand-50/70" id="office">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-6">
          {s.images.map((img, i) => (
            <Reveal as="li" key={img.src + i} delay={(i % 3) * 60} className={["md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-3", "md:col-span-3"][i % 7]}>
              <div className="overflow-hidden rounded-3xl shadow-soft">
                <Picture image={img} sizes="(min-width: 768px) 50vw, 50vw" className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function Insurance({ s }: { s: InsuranceSection }) {
  return (
    <Section tight className="border-y hairline bg-white" id="insurance">
      <Container>
        <div className="text-center">
          <h2 className="text-2xl">{s.heading ?? "Most major PPO plans accepted"}</h2>
          <p className="mx-auto mt-3 max-w-[48rem] text-grey-600">{s.text ?? "We verify your benefits before treatment and offer flexible financing so cost never stands between you and care. Not sure about your plan? Call us and we'll check."}</p>
        </div>
        {/* Equal cells; each logo is sized by its shape so wide wordmarks and compact marks read at a similar weight */}
        <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
          {site.insurers.map((i) => {
            const ratio = i.w / i.h;
            const h = ratio > 4.5 ? "h-6" : ratio > 3 ? "h-7" : ratio > 2 ? "h-9" : "h-11";
            return (
              <li key={i.name} className="flex h-20 items-center justify-center rounded-lg bg-warm px-4 opacity-85 grayscale transition-[filter,opacity] duration-[var(--dur-std)] hover:opacity-100 hover:grayscale-0">
                <Picture image={{ src: i.logo, alt: i.name, width: i.w, height: i.h }} sizes="140px" className={`${h} w-auto max-w-full object-contain`} quality={85} />
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

export function Offer({ s }: { s: OfferSection }) {
  return (
    <Section className="bg-greige-50/60" id="offer">
      <Container>
        <div className="card grid gap-8 overflow-hidden p-8 sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {s.eyebrow && <p className="eyebrow mb-4">{s.eyebrow}</p>}
            <h2 className="text-4xl">{s.heading}</h2>
            <p className="lead mt-4">{s.text}</p>
            {s.bullets && (
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {s.bullets.map((b) => <li key={b} className="flex items-start gap-2.5 text-grey-700"><Icon.check className="mt-1 h-4 w-4 shrink-0 text-olive-600" />{b}</li>)}
              </ul>
            )}
            {s.fine && <p className="mt-5 text-base text-grey-600 sm:text-sm">{s.fine}</p>}
          </div>
          <div className="flex flex-col justify-center gap-3 rounded-3xl bg-ink-900 p-7 text-white lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bronze-300">{site.offer.headline}</p>
            <p className="font-display text-6xl text-white">$59</p>
            <p className="text-white/80">Comprehensive exam and digital X-rays for new patients.</p>
            <Button href={s.cta?.href ?? site.bookingUrl} variant="light" size="lg" className="mt-3" arrow>{s.cta?.label ?? "Claim the offer"}</Button>
            <p className="text-sm text-white/70">Or call <a href={`tel:${site.phone.tel}`} className="inline-flex min-h-11 items-center font-semibold text-white underline-offset-4 hover:underline">{site.phone.display}</a></p>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-grey-600"><Link href="/services/" className="inline-flex min-h-11 items-center underline hover:text-ink-900">See everything we offer</Link></p>
      </Container>
    </Section>
  );
}
