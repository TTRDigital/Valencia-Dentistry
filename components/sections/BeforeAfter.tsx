import type { BeforeAfterCase, GallerySection } from "@/lib/types";
import { getCases } from "@/lib/content";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { CompareSlider } from "@/components/blocks/CompareSlider";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";

export async function BeforeAfter({ s }: { s: GallerySection }) {
  const all = await getCases();
  const cases: BeforeAfterCase[] = s.caseIds?.length ? s.caseIds.map((id) => all.find((c) => c.id === id)).filter((c): c is BeforeAfterCase => !!c) : all;
  if (!cases.length) return null;
  return (
    <Section className="bg-warm" id="transformations">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        {s.layout === "grid" ? (
          // Beverly Hills style: each case as before (top) over after (bottom), three per row
          <ul data-stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <Reveal as="li" key={c.id} className="overflow-hidden rounded-xl bg-offwhite ring-1 ring-ink-900/5">
                {(["before", "after"] as const).map((k) => (
                  <span key={k} className="relative block aspect-[4/3] overflow-hidden">
                    <Picture image={c[k]} fill cropTo={4 / 3} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    <span className="absolute left-3 top-3 rounded-sm bg-olive-900/85 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">{k}</span>
                  </span>
                ))}
                <span className="block px-5 py-4"><span className="block font-semibold text-ink-900">{c.title}</span><span className="block text-sm text-grey-700">{c.treatment}</span></span>
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-10 max-w-5xl">
            <CompareSlider cases={cases} />
          </div>
        )}
        <p className="mt-6 text-center text-sm text-grey-600">Patients shown with permission.</p>
      </Container>
    </Section>
  );
}
