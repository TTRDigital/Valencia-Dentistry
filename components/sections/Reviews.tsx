import type { ReviewsSection, Testimonial } from "@/lib/types";
import { getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { Container, Section } from "@/components/ui/Section";
import { ReviewCarousel } from "@/components/blocks/ReviewCarousel";
import { CountUp } from "@/components/motion/CountUp";
import { QuoteHighlight, RichHeading, Watermark } from "@/components/rich/Blocks";

export function Stars({ n = 5, className = "h-4 w-4" }: { n?: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-400" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => <Icon.star key={i} className={`${className} ${i < n ? "" : "opacity-25"}`} />)}
    </span>
  );
}

export async function Reviews({ s }: { s: ReviewsSection }) {
  const all = await getTestimonials();
  const items: Testimonial[] = s.ids?.length ? s.ids.map((id) => all.find((t) => t.id === id)).filter((t): t is Testimonial => !!t) : all;
  const [first, ...rest] = items;
  return (
    <Section className="relative isolate overflow-hidden bg-white" id="reviews">
      <Watermark className="-left-24 top-10 h-96 w-96" />
      <Container>
        <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {first && <QuoteHighlight t={first} className="lg:col-span-7" />}
          <div className="grid gap-6 lg:col-span-5">
            <div className="flex items-center gap-5 rounded-lg bg-warm p-6 ring-1 ring-ink-900/[0.07] sm:p-8">
              <Icon.google className="h-12 w-12 shrink-0" />
              <div>
                <p className="flex items-center gap-3 font-display text-5xl font-semibold text-ink-900"><CountUp value={site.rating.value} decimals={1} /><Stars className="h-5 w-5" /></p>
                <p className="mt-1 text-grey-700">Average from <span className="font-semibold text-ink-900">{site.rating.count} Google reviews</span> by local patients</p>
              </div>
            </div>
            {rest.length > 0 && <ReviewCarousel items={rest} />}
          </div>
        </div>
        <p className="mt-8 text-base text-grey-700 sm:text-sm">
          Reviews are shown exactly as written on Google. <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-olive-700 underline underline-offset-4">Read them all or leave one</a>
        </p>
      </Container>
    </Section>
  );
}
