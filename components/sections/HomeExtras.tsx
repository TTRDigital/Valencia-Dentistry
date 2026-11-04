import Link from "next/link";
import type { PhotoBannerSection, PhotoStepsSection, PhotoTrioSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

/** Ideal Dental style: centered heading and line, then three photos edge to edge, each with a title and text below. */
export function PhotoTrio({ s }: { s: PhotoTrioSection }) {
  return (
    <Section className="bg-warm pb-0 sm:pb-0" id="why-valencia">
      <Container className="text-center">
        <h2>{s.heading}</h2>
        {s.lead && <p className="mx-auto mt-3 max-w-2xl text-grey-700">{s.lead}</p>}
      </Container>
      <ul data-stagger className="mt-10 grid sm:grid-cols-3">
        {s.items.map((it) => (
          <Reveal as="li" key={it.title} className="flex flex-col bg-offwhite">
            <span className="relative block aspect-[16/9] overflow-hidden sm:aspect-[16/10]">
              <Picture image={it.image} fill cropTo={16 / 10} sizes="(min-width: 640px) 34vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
            </span>
            <span className="block px-5 py-6 sm:px-7 sm:py-8">
              <h3>{it.title}</h3>
              <p className="mt-2 text-grey-700">{it.text}</p>
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/** A full-width office photo with a short statement and a link low on the left. */
export function PhotoBanner({ s }: { s: PhotoBannerSection }) {
  return (
    <section className="on-dark relative isolate flex min-h-[420px] items-end overflow-hidden text-white sm:min-h-[520px]">
      <Picture image={s.image} fill sizes="100vw" className="-z-20 object-cover" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-olive-900/90 via-olive-900/45 to-olive-900/10 sm:bg-gradient-to-r sm:from-olive-900/85 sm:via-olive-900/40 sm:to-transparent" />
      <Container className="w-full pb-10 sm:pb-16">
        <div className="max-w-lg">
          <h2 className="text-white">{s.heading}</h2>
          <p className="mt-3 text-white/85">{s.text}</p>
          {s.link && <Link href={s.link.href} className="mt-5 inline-flex min-h-11 items-center border-b border-white pb-0.5 text-[0.9375rem] font-semibold text-white hover:text-bronze-300">{s.link.label}</Link>}
        </div>
      </Container>
    </section>
  );
}

/** Three numbered steps, each written over its own office photo (Beverly Hills / Ideal Dental closing section). */
export function PhotoSteps({ s }: { s: PhotoStepsSection }) {
  return (
    <section aria-label={s.label ?? "How it works"}>
      <ol className="grid sm:grid-cols-3">
        {s.items.map((it, i) => (
          <li key={it.title} className="on-dark relative isolate flex min-h-[260px] items-end overflow-hidden text-white sm:min-h-[460px]">
            <Picture image={it.image} fill sizes="(min-width: 640px) 34vw, 100vw" className="-z-20 object-cover" />
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-olive-900/90 via-olive-900/50 to-transparent" />
            <span className="block p-6 sm:p-8">
              <h3 className="text-white">{i + 1}. {it.title}</h3>
              <p className="mt-2 text-white/85">{it.text}</p>
              {it.link && <Link href={it.link.href} className="mt-4 inline-flex min-h-11 items-center border-b border-white pb-0.5 text-[0.9375rem] font-semibold text-white">{it.link.label}</Link>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
