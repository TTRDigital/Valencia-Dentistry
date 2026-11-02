import type { DoctorIntroSection } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

/** "Meet Dr. Lavi": tall portrait beside a short personal introduction. */
export function DoctorIntro({ s }: { s: DoctorIntroSection }) {
  return (
    <Section className="bg-white" id="meet-dr-lavi">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-12 lg:gap-16">
          <Reveal className="md:col-span-5">
            <div className="overflow-hidden rounded-t-[999px] rounded-b-[4px] bg-greige-50">
              <Picture image={s.image} sizes="(min-width: 768px) 420px, 100vw" className="aspect-[4/5] w-full object-cover object-top" />
            </div>
          </Reveal>
          <div className="md:col-span-7">
            <Reveal>
              {s.eyebrow && <p className="eyebrow mb-4">{s.eyebrow}</p>}
              <h2 className="text-4xl">{s.heading}</h2>
            </Reveal>
            <div className="mt-6 max-w-[60ch] space-y-4 text-lg text-grey-700">
              {s.body.map((p, i) => <Reveal key={i} delay={i * 70}><p>{p}</p></Reveal>)}
            </div>
            {s.points && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {s.points.map((pt, i) => (
                  <Reveal as="li" key={pt} delay={i * 60} className="flex items-start gap-3 text-grey-900">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive-100 text-olive-700"><Icon.check className="h-3.5 w-3.5" /></span>
                    {pt}
                  </Reveal>
                ))}
              </ul>
            )}
            {s.cta && <Button href={s.cta.href} variant="outline" className="mt-8" arrow>{s.cta.label}</Button>}
          </div>
        </div>
      </Container>
    </Section>
  );
}
