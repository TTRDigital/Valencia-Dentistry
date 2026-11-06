import Link from "next/link";
import type { PhotoBannerSection, PhotoStepsSection, PhotoTrioSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

/** Ideal Dental style: centered heading and line, then three photos edge to edge, each with a title and text below. */
export function PhotoTrio({ s }: { s: PhotoTrioSection }) {
  return (
    <Section className="bg-warm" id="why-valencia">
      <Container>
        <div className="text-center">
          <h2>{s.heading}</h2>
          {s.lead && <p className="mx-auto mt-3 max-w-2xl text-grey-700">{s.lead}</p>}
        </div>
        <ul data-stagger className="mt-10 grid gap-6 sm:grid-cols-3">
          {s.items.map((it) => (
            <Reveal as="li" key={it.title} className="home-card">
              <span className="relative block aspect-[16/10] overflow-hidden">
                <Picture image={it.image} fill cropTo={16 / 10} sizes="(min-width: 640px) 400px, 100vw" className="home-card-photo object-cover" />
              </span>
              <span className="block p-6">
                <h3>{it.title}</h3>
                <p className="mt-2 text-grey-700">{it.text}</p>
              </span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/**
 * A full-width office photo with a statement over it (APA Aesthetic style): white caps heading, a short line,
 * optional ticks and fine print, and caps underlined links. The words sit on the left or the right, over an
 * olive fade on that side, so faces stay clear.
 */
export function PhotoBanner({ s }: { s: PhotoBannerSection }) {
  const right = s.align === "right";
  const links = [s.link, s.link2].filter((l): l is NonNullable<typeof l> => !!l);
  return (
    // Phones: the photo stands on its own on top, the words sit below it on olive (nothing over faces).
    <section className="on-dark relative isolate overflow-hidden bg-olive-900 text-white sm:flex sm:min-h-[560px] sm:items-end" id={s.id}>
      <div className="relative aspect-[4/3] sm:absolute sm:inset-0 sm:-z-20 sm:aspect-auto">
        <Picture image={s.image} fill sizes="100vw" className={`object-cover ${s.focus ?? ""}`} />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-olive-900 sm:hidden" />
      </div>
      <span aria-hidden="true" className={`absolute inset-0 -z-10 hidden sm:block ${right ? "sm:bg-gradient-to-l" : "sm:bg-gradient-to-r"} sm:from-olive-900/90 sm:via-olive-900/45 sm:to-transparent`} />
      <Container className="w-full pb-10 pt-2 sm:pb-16 sm:pt-0">
        <div className={`max-w-lg ${right ? "sm:ml-auto" : ""}`}>
          <h2 className="font-bold uppercase tracking-[0.08em] text-white">{s.heading}</h2>
          <p className="mt-3 text-lg text-white/90">{s.text}</p>
          {s.bullets && s.bullets.length > 0 && (
            <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-white/90 sm:grid-cols-2">
              {s.bullets.map((b) => <li key={b} className="flex items-center gap-2"><span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-white" />{b}</li>)}
            </ul>
          )}
          {links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              {links.map((l) => <a key={l.href + l.label} href={l.href} {...(/^https?:/.test(l.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-11 items-center border-b border-white px-1 pb-0.5 text-[0.9375rem] font-bold uppercase tracking-[0.12em] text-white hover:text-bronze-300">{l.label}</a>)}
            </div>
          )}
          {s.fine && <p className="mt-4 text-sm text-white/75">{s.fine}</p>}
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
              <h3 className="uppercase text-white">{i + 1}. {it.title}</h3>
              <p className="mt-2 text-white/85">{it.text}</p>
              {it.link && <Link href={it.link.href} className="mt-4 inline-flex min-h-11 items-center border-b border-white pb-0.5 text-[0.9375rem] font-semibold text-white">{it.link.label}</Link>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
