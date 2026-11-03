import type { FirstVisitSection } from "@/lib/types";
import { site } from "@/lib/site";
import { TimelineProgress } from "@/components/motion/TimelineProgress";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * "Your first visit" as a scroll story: on the left a sticky photo that changes to match the step
 * being read (crossfade + settle, driven by TimelineProgress's data-current), on the right a
 * timeline whose line draws down and whose steps light up in turn. Phones: photo above the steps.
 */
export function FirstVisit({ s }: { s: FirstVisitSection }) {
  const photos = s.images ?? [];
  return (
    <Section className="bg-white" id="first-visit">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        <TimelineProgress className="timeline relative mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {photos.length > 0 && (
            <div className="lg:col-span-6">
              <div className="lg:sticky lg:top-28">
                <div className="relative overflow-hidden rounded-lg bg-ink-900 shadow-lift" style={{ aspectRatio: "3 / 2" }}>
                  {photos.map((img, i) => (
                    <Picture key={img.src} image={img} fill sizes="(min-width: 1024px) 600px, 100vw" data-i={i} className="step-photo object-cover" />
                  ))}
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/70 to-transparent" />
                  <ol aria-hidden="true" className="absolute bottom-5 left-5 flex gap-2">
                    {photos.map((img, i) => <li key={img.src} data-i={i} className="step-tick h-1 w-8 rounded-full bg-white/30" />)}
                  </ol>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg bg-warm p-5 ring-1 ring-ink-900/[0.06]">
                  <Button href={s.cta?.href ?? site.bookingUrl} arrow>{s.cta?.label ?? "Book your first visit"}</Button>
                  <span className="flex items-center gap-2 text-grey-700"><Icon.shield className="h-5 w-5 text-olive-600" /> Most PPO plans accepted</span>
                  <span className="flex items-center gap-2 text-grey-700"><Icon.pin className="h-5 w-5 text-olive-600" /> Free parking, Suite 240</span>
                </div>
              </div>
            </div>
          )}
          <div className={cn("relative", photos.length ? "lg:col-span-6" : "lg:col-span-8")}>
            <div className="absolute bottom-6 left-[27px] top-6 w-0.5 bg-ink-900/10" aria-hidden="true" />
            <div data-progress className="timeline-line absolute bottom-6 left-[27px] top-6 w-0.5 origin-top bg-olive-600" aria-hidden="true" />
            <ol className="relative space-y-6">
              {s.steps.map((st, i) => (
                <li key={st.title} data-step className="timeline-step relative grid grid-cols-[56px_1fr] gap-5">
                  <span className="relative flex h-14 w-14 items-center justify-center" aria-hidden="true">
                    <span className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-ink-900/15 bg-white font-display text-xl text-ink-900">{i + 1}</span>
                    <span className="timeline-dot absolute inset-0 flex items-center justify-center rounded-full bg-olive-600 font-display text-xl text-white">{i + 1}</span>
                  </span>
                  <Reveal className="step-card rounded-lg border border-transparent p-5 transition-[background-color,border-color] duration-500 sm:p-6">
                    <h3 className="text-2xl">{st.title}</h3>
                    <p className="mt-2 max-w-xl text-lg text-grey-700">{st.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            {s.note && <p className="mt-8 pl-[76px] text-base text-grey-600 sm:text-sm">{s.note}</p>}
          </div>
        </TimelineProgress>
      </Container>
    </Section>
  );
}
