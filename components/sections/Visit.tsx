import type { VisitSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { OfficeMap } from "@/components/blocks/OfficeMap";

export function Visit({ s }: { s: VisitSection }) {
  return (
    <Section className="bg-warm" id="visit">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
            <ul className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="sr-only">Address: </span>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-greige-50 text-olive-600"><Icon.pin className="h-5 w-5" /></span>
                <div className="text-grey-700"><a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-ink-900 hover:underline">{site.address.street}</a><br />{site.address.city} ({site.address.neighborhood}), {site.address.state} {site.address.zip}</div>
              </li>
              <li className="flex gap-4">
                <span className="sr-only">Phone: </span>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-greige-50 text-olive-600"><Icon.phone className="h-5 w-5" /></span>
                <div className="text-grey-700"><a href={`tel:${site.phone.tel}`} className="inline-flex min-h-11 items-center font-semibold text-ink-900 hover:underline">{site.phone.display}</a><br /><a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center hover:underline">{site.email}</a></div>
              </li>
              <li className="flex gap-4">
                <span className="sr-only">Hours: </span>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-greige-50 text-olive-600"><Icon.clock className="h-5 w-5" /></span>
                <div className="text-grey-700">
                  <OpenBadge showNext className="text-ink-900" />
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-0.5">
                    {site.hours.map((h) => <div key={h.days} className="contents"><dt>{h.days}</dt><dd className="font-medium text-ink-900">{h.label}</dd></div>)}
                  </dl>
                </div>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={site.directionsUrl} variant="outline"><Icon.directions className="h-4 w-4" /> Get directions</Button>
              <Button href={site.bookingUrl} arrow>Book an appointment</Button>
              <Button href={site.sms} variant="outline" external={false}><Icon.mail className="h-4 w-4" /> Text us</Button>
            </div>
            <p className="mt-6 border-l-2 border-olive-600 pl-4 text-ink-900">{site.news}</p>
            <p className="mt-4 text-base text-grey-600 sm:text-sm">Free parking on site. Suite 240 is on the second floor; the building has an elevator. Serving {site.areas.slice(0, -1).join(", ")} and {site.areas.at(-1)}.</p>
          </div>
          <div className="lg:col-span-7">
            {s.showMap !== false && <OfficeMap />}
          </div>
        </div>
      </Container>
    </Section>
  );
}
