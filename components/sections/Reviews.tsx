import type { ReviewsSection, Testimonial } from "@/lib/types";
import { getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { ReviewCarousel } from "@/components/blocks/ReviewCarousel";

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
          <div className="flex items-center gap-4 rounded-2xl bg-sky-50 px-5 py-4 ring-1 ring-navy-900/5">
            <Icon.google className="h-9 w-9" />
            <div>
              <p className="flex items-center gap-2 font-display text-2xl text-navy-900">{site.rating.value} <Stars /></p>
              <p className="text-sm text-grey-600">{site.rating.count} Google reviews</p>
            </div>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm ml-2 hidden sm:inline-flex">Write a review</a>
          </div>
        </div>
        <div className="mt-10">
          <ReviewCarousel items={items} />
        </div>
      </Container>
    </Section>
  );
}
