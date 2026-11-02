import type { FormSection as FormSectionType } from "@/lib/types";
import { site } from "@/lib/site";
import { LeadForm } from "@/components/forms/LeadForm";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Container } from "@/components/ui/Section";

/**
 * Request form: the form sits in a white card on a cream band; beside it, a short
 * note on what happens after you send it and the quickest ways to reach the office.
 */
export function FormSection({ s }: { s: FormSectionType }) {
  return (
    <section id="request" className="bg-warm section" aria-labelledby="request-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 lg:order-2">
            <div className="rounded-lg bg-white p-6 shadow-[0_1px_0_rgb(0_0_0/0.04),0_12px_32px_-16px_rgb(0_0_0/0.18)] ring-1 ring-ink-900/10 sm:p-8">
              {s.eyebrow && <p className="eyebrow mb-3">{s.eyebrow}</p>}
              <h2 id="request-heading" className="text-3xl">{s.heading}</h2>
              {s.lead && <p className="mt-3 text-grey-700">{s.lead}</p>}
              <LeadForm formName={s.formName} services={s.services !== false} className="mt-6" />
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:order-1 lg:col-span-5 lg:self-start">
            <h3 className="text-2xl">Prefer to talk it through?</h3>
            <p className="mt-3 text-grey-700">Call the front desk and we&apos;ll find a time that suits you, answer insurance questions, and tell you what to bring.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`tel:${site.phone.tel}`} external={false} arrow={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
              <Button href={site.bookingUrl} variant="outline">Book online</Button>
            </div>
            <dl className="mt-8 divide-y divide-ink-900/10 border-y border-ink-900/10">
              <div className="flex gap-4 py-4">
                <dt className="w-20 shrink-0 text-sm font-semibold text-ink-900">Office</dt>
                <dd className="text-grey-700"><a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}</a></dd>
              </div>
              <div className="flex gap-4 py-4">
                <dt className="w-20 shrink-0 text-sm font-semibold text-ink-900">Hours</dt>
                <dd className="text-grey-700">
                  {site.hours.map((h) => <span key={h.days} className="block">{h.days}: {h.label}</span>)}
                  <OpenBadge showNext className="mt-2" />
                </dd>
              </div>
              <div className="flex gap-4 py-4">
                <dt className="w-20 shrink-0 text-sm font-semibold text-ink-900">Email</dt>
                <dd className="min-w-0 break-all text-grey-700"><a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">{site.email}</a></dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
