import type { FormSection as FormSectionType } from "@/lib/types";
import { site } from "@/lib/site";
import { LeadForm } from "@/components/forms/LeadForm";
import { Icon } from "@/components/ui/Icons";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export function FormSection({ s }: { s: FormSectionType }) {
  return (
    <Section className="bg-white" id="request">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
            <ul className="mt-8 space-y-4 text-grey-700">
              <li className="flex gap-3"><Icon.check className="mt-1 h-5 w-5 shrink-0 text-steel-600" /><span>We reply within one business day, usually much sooner.</span></li>
              <li className="flex gap-3"><Icon.check className="mt-1 h-5 w-5 shrink-0 text-steel-600" /><span>Same-day appointments are often available for urgent needs.</span></li>
              <li className="flex gap-3"><Icon.check className="mt-1 h-5 w-5 shrink-0 text-steel-600" /><span>We verify PPO benefits before your visit and explain costs up front.</span></li>
            </ul>
            <div className="mt-8 rounded-3xl bg-sky-50 p-6">
              <p className="font-semibold text-navy-900">Rather talk to a person?</p>
              <p className="mt-1 text-grey-700">Call <a href={`tel:${site.phone.tel}`} className="font-semibold text-steel-600 underline-offset-4 hover:underline">{site.phone.display}</a>, Monday to Friday, 8am to 5pm.</p>
            </div>
          </div>
          <div className="card p-6 sm:p-8 lg:col-span-7">
            <LeadForm formName={s.formName} services={s.services !== false} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
