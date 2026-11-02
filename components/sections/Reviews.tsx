import type { ReviewsSection, Testimonial } from "@/lib/types";
import { getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ReviewCarousel } from "@/components/blocks/ReviewCarousel";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/ui/Reveal";

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
  return (
    <Section className="bg-white" id="reviews">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
          {!s.trust && (
            <div className="flex items-center gap-4 rounded-[4px] bg-greige-50 px-5 py-4 ring-1 ring-ink-900/5">
              <Icon.google className="h-9 w-9" />
              <div>
                <p className="flex items-center gap-2 text-2xl font-semibold text-ink-900">{site.rating.value} <Stars /></p>
                <p className="text-sm text-grey-600">{site.rating.count} Google reviews</p>
              </div>
            </div>
          )}
        </div>
        {s.trust && (
          <dl className="mt-10 grid divide-y divide-ink-900/10 border-y border-ink-900/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Reveal className="flex flex-col-reverse gap-1 py-6 sm:px-6 sm:first:pl-0">
              <dt className="flex items-center gap-2 text-grey-700"><Icon.google className="h-4 w-4" /> Google rating</dt>
              <dd className="flex items-center gap-3 text-5xl font-semibold text-ink-900"><CountUp value={site.rating.value} decimals={1} /><Stars className="h-5 w-5" /></dd>
            </Reveal>
            <Reveal delay={80} className="flex flex-col-reverse gap-1 py-6 sm:px-6">
              <dt className="text-grey-700">Google reviews from local patients</dt>
              <dd className="text-5xl font-semibold text-ink-900"><CountUp value={site.rating.count} /></dd>
            </Reveal>
            <Reveal delay={160} className="flex flex-col-reverse gap-1 py-6 sm:px-6">
              <dt className="text-grey-700">New patient exam &amp; X-rays</dt>
              <dd className="text-5xl font-semibold text-ink-900"><CountUp value={59} prefix="$" /></dd>
            </Reveal>
          </dl>
        )}
        <div className="mt-10">
          <ReviewCarousel items={items} />
        </div>
        <p className="mt-6 text-sm text-grey-600">
          Reviews are shown exactly as written on Google. <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-olive-700 underline underline-offset-4">Read them all or leave one</a>.
        </p>
      </Container>
    </Section>
  );
}
