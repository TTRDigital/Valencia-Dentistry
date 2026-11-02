import type { DoctorSection } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export function Doctor({ s }: { s: DoctorSection }) {
  return (
    <Section dark>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-3 rounded-lg border border-bronze-300/30" aria-hidden="true" />
              <div className="overflow-hidden rounded-4xl shadow-lift">
                <Picture image={s.image} sizes="(min-width: 1024px) 460px, 90vw" cropTo={4 / 5} className="aspect-[4/5] w-full object-cover object-top" />
              </div>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={100}>
            <SectionHeading eyebrow={s.eyebrow} heading={s.heading} />
            {s.quote && (
              <blockquote className="mt-7 border-l-2 border-bronze-300 pl-5 font-display text-2xl leading-snug text-white/90">
                <Icon.quote className="mb-2 h-6 w-6 text-bronze-300/70" />
                {s.quote}
              </blockquote>
            )}
            <div className="prose-measure mt-6 space-y-4 text-lg text-white/75">
              {s.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {s.stats && (
              <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {s.stats.map((st) => (
                  <div key={st.label} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <dd className="font-display text-2xl text-bronze-300">{st.value}</dd>
                    <dt className="mt-1 text-sm text-white/70">{st.label}</dt>
                  </div>
                ))}
              </dl>
            )}
            {s.cta && <Button href={s.cta.href} variant="light" className="mt-8" arrow>{s.cta.label}</Button>}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
