import type { BeforeAfterCase, GallerySection } from "@/lib/types";
import { getCases } from "@/lib/content";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { CompareSlider } from "@/components/blocks/CompareSlider";

export async function BeforeAfter({ s }: { s: GallerySection }) {
  const all = await getCases();
  const cases: BeforeAfterCase[] = s.caseIds?.length ? s.caseIds.map((id) => all.find((c) => c.id === id)).filter((c): c is BeforeAfterCase => !!c) : all;
  if (!cases.length) return null;
  return (
    <Section className="bg-sand-50/70" id="transformations">
      <Container>
        <SectionHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        <div className="mt-12">
          <CompareSlider cases={cases} />
        </div>
        <p className="mt-6 text-center text-sm text-grey-600">Real patients of Dr. Moezzi, shown with permission. Results vary from person to person.</p>
      </Container>
    </Section>
  );
}
