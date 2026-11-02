import type { FirstVisitSection } from "@/lib/types";
import { site } from "@/lib/site";
import { TimelineProgress } from "@/components/motion/TimelineProgress";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

/** "Your first visit": sticky intro + price card beside a vertical timeline that draws in as you scroll. */
export function FirstVisit({ s }: { s: FirstVisitSection }) {
  return (
    <Section className="bg-white" id="first-visit">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
              <div className="mt-8 rounded-[4px] border border-ink-900/10 bg-warm p-6">
                <p className="flex items-baseline gap-3"><span className="text-5xl font-semibold text-ink-900">$59</span><span className="text-grey-700">new patient exam &amp; X-rays</span></p>
                <ul className="mt-4 space-y-2 text-[0.95rem] text-grey-700">
                  <li className="flex gap-2.5"><Icon.shield className="mt-0.5 h-5 w-5 shrink-0 text-olive-600" />Most PPO plans accepted; we check your benefits first</li>
                  <li className="flex gap-2.5"><Icon.pin className="mt-0.5 h-5 w-5 shrink-0 text-olive-600" />Free parking, elevator to Suite 240</li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={s.cta?.href ?? site.bookingUrl} arrow>{s.cta?.label ?? "Book your first visit"}</Button>
                  <Button href={`tel:${site.phone.tel}`} variant="outline" external={false}>{site.phone.display}</Button>
                </div>
              </div>
            </div>
          </div>
          <TimelineProgress className="timeline relative lg:col-span-7">
            {/* Track + progress line (transform: scaleY) */}
            <div className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-ink-900/10" aria-hidden="true" />
            <div data-progress className="timeline-line absolute bottom-6 left-[19px] top-6 w-0.5 origin-top bg-olive-600" aria-hidden="true" />
            <ol className="relative space-y-10">
              {s.steps.map((st, i) => (
                <li key={st.title} data-step className="timeline-step relative grid grid-cols-[40px_1fr] gap-5">
                  <span className="relative flex h-10 w-10 items-center justify-center" aria-hidden="true">
                    <span className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-ink-900/15 bg-white text-sm font-bold text-ink-900">{i + 1}</span>
                    <span className="timeline-dot absolute inset-0 flex items-center justify-center rounded-full bg-olive-600 text-sm font-bold text-white">{i + 1}</span>
                  </span>
                  <Reveal className="pt-1.5">
                    <h3 className="text-xl">{st.title}</h3>
                    <p className="mt-2 max-w-xl text-grey-700">{st.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            {s.note && <p className="mt-10 pl-[60px] text-sm text-grey-600">{s.note}</p>}
          </TimelineProgress>
        </div>
      </Container>
    </Section>
  );
}
