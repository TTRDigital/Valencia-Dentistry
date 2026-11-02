import type { Faq as FaqItem, FaqSection } from "@/lib/types";
import { faqNode, JsonLd } from "@/lib/seo";
import { Icon } from "@/components/ui/Icons";
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

export function Faq({ s }: { s: FaqSection }) {
  return (
    <Section className="bg-warm" id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
            <p className="mt-6 flex items-center gap-2 text-sm text-grey-600"><Icon.phone className="h-4 w-4 text-olive-600" /> Still have a question? Call (661) 254-5200.</p>
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
