import type { DoctorIntroSection } from "@/lib/types";
import { site } from "@/lib/site";
import { RichHeading } from "@/components/rich/Blocks";
import { Button } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Meet the lead dentist: words on the left, a large photo filling the right half to the edge of the
 * screen (anchored at the top so his head is never cut). Phones: words first, then the photo.
 */
export function DoctorIntro({ s }: { s: DoctorIntroSection }) {
  return (
    <section className="bg-warm" id="meet-dr-lavi" aria-labelledby="meet-heading">
      <div className="grid lg:min-h-[640px] lg:grid-cols-2">
        <div className="flex items-center">
          <div className="w-full px-4 py-12 sm:px-8 sm:py-16 lg:ml-auto lg:max-w-[38rem] lg:py-24 lg:pl-8 lg:pr-16 xl:pr-20">
            <RichHeading eyebrow={s.eyebrow} heading={s.heading} id="meet-heading" />
            <div className="mt-5 space-y-4 text-grey-700 sm:mt-6 sm:text-lg">
              {s.body.map((p, i) => <Reveal key={i}><p className={i > 0 ? "hidden sm:block" : undefined}>{p}</p></Reveal>)}
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <Button href={site.bookingUrl} arrow>Book a visit</Button>
              {s.cta && <Button href={s.cta.href} variant="outline">{s.cta.label}</Button>}
            </div>
          </div>
        </div>
        <div className="relative order-first aspect-[5/4] w-full sm:aspect-[4/3] lg:order-none lg:aspect-auto">
          <Picture image={s.image} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top" />
        </div>
      </div>
    </section>
  );
}
