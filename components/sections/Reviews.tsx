import type { ReviewsSection, Testimonial } from "@/lib/types";
import { getTestimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { Container, Section } from "@/components/ui/Section";
import { RichHeading } from "@/components/rich/Blocks";

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
  // Enough cards to fill a wide screen; the ticker loops through two copies of this row.
  const row = Array.from({ length: Math.max(1, Math.ceil(6 / Math.max(items.length, 1))) }, () => items).flat();
  const card = (t: Testimonial, k: string, hidden: boolean) => (
    <li key={k} aria-hidden={hidden || undefined} className="w-[min(82vw,380px)] shrink-0 pr-5">
      <figure className="flex h-full flex-col bg-offwhite p-6">
        <div className="flex items-center justify-between"><Stars n={t.rating} /><Icon.google className="h-5 w-5" /></div>
        <blockquote className="mt-4 flex-1 whitespace-normal text-base leading-relaxed text-grey-700">“{t.text}”</blockquote>
        <figcaption className="mt-5 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-olive-100 font-semibold text-olive-700" aria-hidden="true">{t.author.charAt(0)}</span>
          <span><span className="block font-semibold text-ink-900">{t.author}</span><span className="text-xs text-grey-600">Google review{t.when ? ` · ${t.when}` : ""}</span></span>
        </figcaption>
      </figure>
    </li>
  );
  return (
    <Section className="relative isolate overflow-hidden bg-warm" id="reviews">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
          <div className="flex shrink-0 items-center gap-4 bg-offwhite p-5">
            <Icon.google className="h-10 w-10" />
            <div>
              <p className="flex items-center gap-2 text-3xl font-semibold text-ink-900">{site.rating.value} <Stars className="h-4 w-4" /></p>
              <p className="text-sm text-grey-700">{site.rating.count} Google reviews</p>
            </div>
          </div>
        </div>
      </Container>
      {/* Reviews glide to the left; hover pauses; still and wrapped under reduced motion */}
      <div className="marquee mt-12" aria-label="Patient reviews">
        <div className="marquee-track items-stretch">
          <ul className="flex shrink-0 items-stretch">{row.map((t, i) => card(t, `a${i}`, i >= items.length))}</ul>
          <ul className="flex shrink-0 items-stretch" aria-hidden="true">{row.map((t, i) => card(t, `b${i}`, true))}</ul>
        </div>
      </div>
      <Container>
        <p className="mt-8 text-base text-grey-700 sm:text-sm">
          Reviews are shown exactly as written on Google. <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-olive-700 underline underline-offset-4">Read them all or leave one</a>
        </p>
      </Container>
    </Section>
  );
}
