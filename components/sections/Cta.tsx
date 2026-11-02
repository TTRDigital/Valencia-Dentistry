import type { CtaSection } from "@/lib/types";
import { CtaBanner } from "@/components/rich/Blocks";
import { Container, Section } from "@/components/ui/Section";

// A real practice photo for closing banners that don't name their own
const DEFAULT_IMAGE = { src: "/images/real/consult-seated.jpg", alt: "A consultation with a seated patient at Valencia Dentistry" };

/** Closing call to action: the shared banner with the booking, phone, hours and a photo. */
export function Cta({ s }: { s: CtaSection }) {
  return (
    <Section className="bg-warm">
      <Container>
        <CtaBanner heading={s.heading} text={s.text ?? ""} image={s.image ?? DEFAULT_IMAGE} buttonLabel={s.primary?.label ?? "Book online"} />
      </Container>
    </Section>
  );
}
