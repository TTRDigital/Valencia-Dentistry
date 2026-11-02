import type { Faq as FaqItem, FaqSection } from "@/lib/types";
import { faqNode, JsonLd } from "@/lib/seo";
import { Icon } from "@/components/ui/Icons";
import { getPeople } from "@/lib/content";
import { site } from "@/lib/site";
import { PhotoFrame } from "@/components/rich/PhotoFrame";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn("divide-y hairline rounded-lg bg-white ring-1 ring-ink-900/[0.06] shadow-soft", className)}>
      {items.map((f, i) => (
        <details key={i} className="faq-item group px-6 sm:px-8" name="faq">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 py-5 text-left font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
            <span className="text-[1.0625rem]">{f.q}</span>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-greige-50 text-olive-600 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
            </span>
          </summary>
          <div className="faq-answer pb-6 pr-2 text-grey-700 leading-relaxed sm:pr-14">
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export async function Faq({ s }: { s: FaqSection }) {
  const [doctor] = await getPeople();
  return (
    <Section className="bg-warm" id="faq">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
              {doctor && (
                <div className="mt-8 overflow-hidden rounded-lg bg-white ring-1 ring-ink-900/[0.07]">
                  <div className="flex items-center gap-4 p-5">
                    <div className="w-20 shrink-0"><PhotoFrame image={doctor.image} sizes="80px" arch /></div>
                    <div>
                      <p className="font-semibold text-ink-900">Still have a question?</p>
                      <p className="mt-0.5 text-sm text-grey-700">{doctor.name} and the front desk are happy to help.</p>
                    </div>
                  </div>
                  <div className="grid gap-2 border-t border-ink-900/10 p-5">
                    <Button href={`tel:${site.phone.tel}`} external={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
                    <Button href={site.bookingUrl} variant="outline">Book online</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={s.items} />
          </div>
        </div>
      </Container>
      {s.schema !== false && <JsonLd data={{ "@context": "https://schema.org", ...faqNode(s.items) }} />}
    </Section>
  );
}
