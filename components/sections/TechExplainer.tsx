import Link from "next/link";
import type { TechExplainerSection } from "@/lib/types";
import { RichHeading } from "@/components/rich/Blocks";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

/**
 * Technology: clean cards, each with a photo (or an icon when there is none), a small label,
 * the name and what it means for the patient. Centered heading, optional link below.
 */
export function TechExplainer({ s }: { s: TechExplainerSection }) {
  const withPhotos = s.items.some((it) => it.image);
  return (
    <Section className="bg-warm" id="technology">
      <Container>
        <RichHeading eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} align="center" />
        <ul data-stagger className={`-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-14 ${s.items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {s.items.map((it) => (
            <Reveal as="li" key={it.title} className="flex w-[80%] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white ring-1 ring-ink-900/10 sm:w-auto">
              {it.image ? (
                <span className="relative block aspect-[3/2] overflow-hidden bg-greige-50">
                  <Picture image={it.image} fill cropTo={3 / 2} sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 100vw" className="object-cover object-top" />
                </span>
              ) : withPhotos ? null : (
                <span className="px-6 pt-6"><FeatureIcon name={it.icon} /></span>
              )}
              <span className="flex flex-1 flex-col p-6">
                {it.label && <span className="text-xs font-semibold uppercase tracking-[0.12em] text-bronze-600">{it.label}</span>}
                <span className="mt-1.5 text-xl font-semibold text-ink-900">{it.title}</span>
                <span className="mt-2 text-grey-700">{it.text} {it.forYou}</span>
              </span>
            </Reveal>
          ))}
        </ul>
        {s.link && (
          <p className="mt-10 text-center"><Link href={s.link.href} className="link-arrow">{s.link.label} <Icon.arrow className="h-4 w-4" /></Link></p>
        )}
      </Container>
    </Section>
  );
}
