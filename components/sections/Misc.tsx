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
        <div className={s.narrow !== false ? "mx-auto max-w-[72ch]" : ""}>
          {s.heading && <h2 className="mb-6">{s.heading}</h2>}
          <Markdown source={s.body} />
        </div>
      </Container>
    </Section>
  );
}

export async function Team({ s }: { s: TeamSection }) {
  const people = await getPeople();
  const list = s.slugs?.length ? people.filter((p) => s.slugs!.includes(p.slug)) : people;
  return (
    <Section className="bg-white" id="team">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        <div className="mt-12 space-y-16">
          {list.map((p) => (
            <article key={p.slug} className="grid items-start gap-8 lg:grid-cols-12 lg:gap-14">
              <Reveal className="lg:col-span-5">
                <div className="overflow-hidden rounded-4xl shadow-lift">
                  <Picture image={p.image} sizes="(min-width: 1024px) 480px, 100vw" className="aspect-[5/4] w-full object-cover object-top" />
                </div>
              </Reveal>
              <Reveal className="lg:col-span-7" delay={80}>
                <h3 className="text-3xl">{p.name}{p.credentials ? `, ${p.credentials}` : ""}</h3>
                <p className="mt-1 text-olive-600 font-medium">{p.role}</p>
                <div className="prose-measure mt-5 space-y-4 text-lg text-grey-700">{p.bio.map((b, i) => <p key={i}>{b}</p>)}</div>
                {p.highlights && (
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {p.highlights.map((h) => <li key={h} className="flex items-start gap-2.5 text-[0.95rem] text-grey-700"><Icon.check className="mt-1 h-4 w-4 shrink-0 text-olive-600" />{h}</li>)}
                  </ul>
                )}
              </Reveal>
            </article>
          ))}
        </div>
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
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {site.insurers.map((i) => (
            <li key={i.name} className="opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Picture image={{ src: i.logo, alt: i.name, width: i.w, height: i.h }} sizes="120px" className="h-7 w-auto max-w-[120px] object-contain" quality={85} />
            </li>
          ))}
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
            {s.fine && <p className="mt-5 text-sm text-grey-600">{s.fine}</p>}
          </div>
          <div className="flex flex-col justify-center gap-3 rounded-3xl bg-ink-900 p-7 text-white lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bronze-300">{site.offer.headline}</p>
            <p className="font-display text-6xl text-white">$59</p>
            <p className="text-white/80">Comprehensive exam and digital X-rays for new patients.</p>
            <Button href={s.cta?.href ?? site.bookingUrl} variant="light" size="lg" className="mt-3" arrow>{s.cta?.label ?? "Claim the offer"}</Button>
            <p className="text-sm text-white/70">Or call <a href={`tel:${site.phone.tel}`} className="font-semibold text-white underline-offset-4 hover:underline">{site.phone.display}</a></p>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-grey-600"><Link href="/services/" className="underline hover:text-ink-900">See everything we offer</Link></p>
      </Container>
    </Section>
  );
}
