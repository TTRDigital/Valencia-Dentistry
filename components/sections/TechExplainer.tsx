import Link from "next/link";
import type { TechExplainerSection } from "@/lib/types";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Container, Section } from "@/components/ui/Section";
import { TechCard } from "./TechCard";

/**
 * Technology, like the Agoura Hills reference: centered eyebrow and heading (last words in olive), then photo
 * cards. Hover lifts the card, zooms the photo and slides the description open; on phones a tap opens it.
 */
export function TechExplainer({ s }: { s: TechExplainerSection }) {
  const cols = s.items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <Section className="bg-warm" id="technology">
      <Container>
        <div className="text-center">
          {s.eyebrow && <p className="eyebrow mb-3 justify-center">{s.eyebrow}</p>}
          <h2>{s.heading}</h2>
          {s.lead && <p className="mx-auto mt-3 max-w-2xl text-grey-700">{s.lead}</p>}
        </div>
        <ul className={`mt-12 grid gap-6 sm:grid-cols-2 ${cols}`}>
          {s.items.map((it) => (
            <TechCard key={it.title} label={it.label} title={it.title} text={`${it.text} ${it.forYou}`}>
              {it.image && <Picture image={it.image} fill cropTo={4 / 3} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="tech-photo object-cover" />}
            </TechCard>
          ))}
        </ul>
        {s.link && (
          <p className="mt-10 text-center"><Link href={s.link.href} className="inline-flex items-center gap-2 border-b border-ink-900/20 pb-0.5 text-sm font-semibold text-grey-700 hover:border-olive-600 hover:text-olive-700">{s.link.label} <Icon.arrow className="h-4 w-4" /></Link></p>
        )}
      </Container>
    </Section>
  );
}
