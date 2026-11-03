import type { DoctorIntroSection } from "@/lib/types";
import { site } from "@/lib/site";
import { FloatingBadge, PhotoFrame } from "@/components/rich/PhotoFrame";
import { RichHeading, Watermark } from "@/components/rich/Blocks";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

/** "Meet Dr. Lavi": the portrait whole in the arch with an offset block and proof badges, beside his introduction. */
export function DoctorIntro({ s }: { s: DoctorIntroSection }) {
  return (
    <Section className="relative isolate overflow-hidden bg-sand-50" id="meet-dr-lavi">
      <Watermark className="-right-20 bottom-0 h-[28rem] w-[28rem]" />
      <p aria-hidden="true" data-drift className="text-mega text-outline pointer-events-none absolute left-0 top-10 -z-10 select-none whitespace-nowrap font-display text-ink-900/15">Nuriel Lavi · Nuriel Lavi</p>
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <PhotoFrame image={s.image} sizes="(min-width: 1024px) 440px, 90vw" arch accent="olive" accentSide="left" className="mx-auto max-w-[420px]">
              <FloatingBadge className="-right-3 bottom-10 sm:-right-10" icon={<Icon.user className="h-5 w-5" />} title="Every visit with Dr. Lavi" text="No handoffs, no rush" />
              <FloatingBadge className="-left-3 top-16 hidden sm:flex sm:-left-10" icon={<Icon.google className="h-5 w-5" />} title={<>{site.rating.value} on Google</>} text={`${site.rating.count} reviews`} />
            </PhotoFrame>
          </Reveal>
          <div className="lg:col-span-7">
            <RichHeading eyebrow={s.eyebrow} heading={s.heading} />
            <div className="mt-6 space-y-4 text-lg text-grey-700">
              {s.body.map((p, i) => <Reveal key={i}><p>{p}</p></Reveal>)}
            </div>
            {s.points && (
              <ul data-stagger className="mt-8 grid gap-3 sm:grid-cols-2">
                {s.points.map((pt) => (
                  <Reveal as="li" key={pt} className="flex items-center gap-3 rounded-lg bg-white p-4 text-grey-900 ring-1 ring-ink-900/[0.07]">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-olive-600 text-white"><Icon.check className="h-4 w-4" /></span>
                    {pt}
                  </Reveal>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {s.cta && <Button href={s.cta.href} arrow>{s.cta.label}</Button>}
              <Button href={site.bookingUrl} variant="outline">Book with Dr. Lavi</Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
