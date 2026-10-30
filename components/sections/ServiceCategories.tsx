import Link from "next/link";
import type { ServiceCategoriesSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export function ServiceCategories({ s }: { s: ServiceCategoriesSection }) {
  return (
    <Section className="bg-white">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {s.categories.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 80} className="card card-hover flex flex-col p-7 sm:p-8 last:md:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl">{c.href ? <Link href={c.href} className="inline-flex min-h-11 items-center hover:text-steel-600">{c.title}</Link> : c.title}</h3>
                  <p className="mt-2 text-grey-600">{c.text}</p>
                </div>
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-steel-600 sm:inline-flex" aria-hidden="true"><Icon.tooth className="h-5 w-5" /></span>
              </div>
              <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
                {c.items.map((it) => (
                  <li key={it.label} className="flex items-start gap-2.5 text-[0.95rem] text-grey-700">
                    <Icon.check className="mt-3 h-4 w-4 shrink-0 text-steel-600" />
                    {it.href ? <Link href={it.href} className="inline-flex min-h-11 items-center hover:text-steel-600 hover:underline">{it.label}</Link> : <span className="inline-flex min-h-11 items-center">{it.label}</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3 pt-1">
                {c.href && <Link href={c.href} className="btn btn-outline btn-sm">Explore {c.title.toLowerCase()}</Link>}
                <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Book now</a>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
