import type { SpecialsSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

/**
 * Specials page (layout from the client's reference): intro beside a photo with quick facts, the offer
 * cards (number, category, name, line, price with the regular price struck, what's included, terms, claim),
 * three steps to claim, and a note on terms.
 */
export function Specials({ s }: { s: SpecialsSection }) {
  return (
    <>
      <section className="bg-warm" aria-labelledby="specials-heading">
        <div className="grid lg:grid-cols-2">
          <div className="container-x flex items-center py-12 lg:ml-auto lg:max-w-[40rem] lg:py-20 lg:pr-16">
            <div className="w-full">
              <p className="eyebrow mb-3">Current specials</p>
              <h1 id="specials-heading" className="text-5xl">{s.heading}</h1>
              <span aria-hidden="true" className="mt-5 block h-px w-12 bg-bronze-500" />
              <p className="mt-5 text-grey-700">{s.lead}</p>
              <p className="mt-5 text-xl font-semibold text-bronze-600">Mention the offer when you book</p>
              <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ink-900/15 pt-6">
                {s.facts.map((f) => (
                  <div key={f.label}><dt className="text-xs font-bold uppercase tracking-[0.12em] text-grey-600">{f.label}</dt><dd className="mt-1 font-semibold text-ink-900">{f.value}</dd></div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#offers" className="btn btn-primary">See the offer</a>
                <a href={`tel:${site.phone.tel}`} className="btn border border-ink-900/20 text-ink-900"><Icon.phone className="h-4 w-4" /> {site.phone.display}</a>
              </div>
            </div>
          </div>
          <div className="relative order-first aspect-[4/3] lg:order-none lg:aspect-auto lg:min-h-[560px]">
            <Picture image={s.image} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top" />
          </div>
        </div>
      </section>

      <Section className="bg-greige-50 scroll-mt-24" id="offers">
        <Container>
          <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7"><p className="eyebrow mb-3">The offers</p><h2>{s.offersHeading}</h2></div>
            <p className="text-grey-700 lg:col-span-5 lg:text-right">No coupon needed. Just mention it when you book or call.</p>
          </div>
          <ul data-stagger className={`mt-10 grid gap-px overflow-hidden rounded-xl bg-ink-900/10 ${s.offers.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-2xl"}`}>
            {s.offers.map((o, i) => (
              <Reveal as="li" key={o.name} className="flex flex-col bg-offwhite p-6 sm:p-9">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-bronze-600"><span>{String(i + 1).padStart(2, "0")}</span><span>{o.tag}</span></div>
                <h3 className="mt-4 text-2xl">{o.name}</h3>
                <p className="mt-2 text-grey-700">{o.text}</p>
                <p className="mt-6 flex items-baseline gap-2"><span className="text-5xl font-semibold text-ink-900">{o.price}</span>{o.was && <s className="text-grey-600">{o.was}</s>}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-grey-600">{o.note}</p>
                <ul className="mt-5 divide-y divide-ink-900/10 border-y border-ink-900/10">
                  {o.includes.map((x) => <li key={x} className="flex items-center gap-3 py-3 text-[0.9375rem] text-ink-900"><Icon.check className="h-4 w-4 shrink-0 text-olive-600" />{x}</li>)}
                </ul>
                <p className="mt-5 text-sm text-grey-600">{o.terms}</p>
                <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6 self-start">Claim this offer <Icon.arrow className="h-4 w-4" /></a>
              </Reveal>
            ))}
          </ul>
          {s.disclaimer && <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-grey-600">{s.disclaimer}</p>}
        </Container>
      </Section>

      <Section className="bg-warm">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><p className="eyebrow mb-3">How to claim</p><h2>Three steps, no coupon codes</h2></div>
            <ol className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
              {s.steps.map((st, i) => (
                <li key={st.title} className="border-t border-ink-900/15 pt-5">
                  <span className="text-sm font-semibold text-olive-600">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-base font-bold uppercase tracking-[0.08em]">{st.title}</h3>
                  <p className="mt-2 text-grey-700">{st.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>
    </>
  );
}
