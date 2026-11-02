import { Fragment } from "react";
import type { FormSection as FormSectionType } from "@/lib/types";
import { site } from "@/lib/site";
import { LeadForm } from "@/components/forms/LeadForm";
import { Icon } from "@/components/ui/Icons";
import { Container } from "@/components/ui/Section";

/** Contact block in the Ideal style: dark section, practice details on the left, request form on the right. */
export function FormSection({ s }: { s: FormSectionType }) {
  return (
    <section id="request" className="dark-section py-14 sm:py-16 lg:py-20" aria-labelledby="request-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {s.eyebrow && <p className="eyebrow mb-4">{s.eyebrow}</p>}
            <p className="text-2xl font-semibold uppercase tracking-[0.02em] text-white">Call to schedule an appointment</p>
            <ul className="mt-6 space-y-4 text-white/85">
              <li className="flex items-start gap-3"><Icon.phone className="mt-1 h-5 w-5 shrink-0 text-bronze-300" /><a href={`tel:${site.phone.tel}`} className="inline-flex min-h-7 items-center font-semibold text-white hover:underline">{site.phone.display}</a></li>
              <li className="flex items-start gap-3"><Icon.pin className="mt-1 h-5 w-5 shrink-0 text-bronze-300" /><a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}</a></li>
              <li className="flex items-start gap-3"><Icon.mail className="mt-1 h-5 w-5 shrink-0 text-bronze-300" /><a href={`mailto:${site.email}`} className="break-all hover:underline">{site.email}</a></li>
            </ul>
            <div className="mt-8">
              <p className="font-semibold text-white">Office hours</p>
              <dl className="mt-3 grid max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-white/80">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
                  <Fragment key={d}><dt>{d}</dt><dd>8:00 – 5:00</dd></Fragment>
                ))}
                <dt>Sat</dt><dd>Closed</dd>
                <dt>Sun</dt><dd>Closed</dd>
              </dl>
            </div>
            {s.lead && <p className="mt-8 max-w-md text-white/70">{s.lead}</p>}
          </div>
          <div className="form-dark lg:col-span-7">
            <h2 id="request-heading" className="text-2xl font-semibold uppercase tracking-[0.02em] text-white">{s.heading}</h2>
            <LeadForm formName={s.formName} services={s.services !== false} className="mt-6" />
          </div>
        </div>
      </Container>
    </section>
  );
}
