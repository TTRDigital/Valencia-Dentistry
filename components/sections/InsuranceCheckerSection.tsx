import type { InsuranceCheckerSection } from "@/lib/types";
import { RichHeading } from "@/components/rich/Blocks";
import { Icon } from "@/components/ui/Icons";
import { Container, Section } from "@/components/ui/Section";
import { InsuranceWidget } from "./InsuranceChecker";

/** Insurance checker section: heading on the left, the three-step checker (client) on the right. */
export function InsuranceChecker({ s }: { s: InsuranceCheckerSection }) {
  return (
    <Section className="bg-white" id="insurance">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} />
            <p className="mt-6 flex items-center gap-2 text-sm text-grey-600"><Icon.shield className="h-4 w-4 text-olive-600" /> No personal details needed. Nothing is sent anywhere.</p>
          </div>
          <div className="lg:col-span-7"><InsuranceWidget /></div>
        </div>
      </Container>
    </Section>
  );
}
