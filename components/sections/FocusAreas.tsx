import Link from "next/link";
import type { FocusAreasSection } from "@/lib/types";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

/** Two things the practice is known for, as large linked panels with a photo and short checklist. */
export function FocusAreas({ s }: { s: FocusAreasSection }) {
  return (
    <Section className="bg-warm" id="holistic-tmj">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {s.areas.map((a, i) => (
            <Reveal as="article" key={a.title} delay={i * 90} className="group grid overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgb(20_20_20/0.06)] sm:grid-cols-5">
              <div className="relative min-h-56 sm:col-span-2">
                <Picture image={a.image} fill sizes="(min-width: 1024px) 260px, (min-width: 640px) 40vw, 100vw" cropTo={0.6} className="object-cover object-top" />
              </div>
              <div className="flex flex-col p-6 sm:col-span-3 sm:p-7">
                <h3 className="text-2xl">{a.title}</h3>
                <p className="mt-3 text-grey-700">{a.text}</p>
                {a.points && (
                  <ul className="mt-4 space-y-2 text-base sm:text-[0.95rem] text-grey-700">
                    {a.points.map((p) => <li key={p} className="flex gap-2.5"><Icon.check className="mt-1 h-4 w-4 shrink-0 text-olive-600" />{p}</li>)}
                  </ul>
                )}
                <Link href={a.link.href} className="link-arrow card-action pt-6">
                  {a.link.label} <Icon.arrow className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
