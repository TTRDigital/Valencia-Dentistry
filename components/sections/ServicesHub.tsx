import Link from "next/link";
import { getServices } from "@/lib/content";
import type { Service, ServiceCategory, SiteImage } from "@/lib/types";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { cn, distinctPhotos } from "@/lib/utils";

const GROUPS: { key: ServiceCategory; title: string; text: string }[] = [
  { key: "cosmetic", title: "Cosmetic Dentistry", text: "Refinements that look like you, only brighter: veneers, Invisalign, whitening and tooth-colored fillings." },
  { key: "restorative", title: "Restorative Dentistry", text: "Crowns, bridges and implants that rebuild strength and comfort, often in fewer visits than you expect." },
  { key: "surgical", title: "Oral Surgery", text: "Extractions, bone grafting and full-arch implants planned on 3D imaging, with sedation options when appropriate." },
  { key: "holistic", title: "Holistic Dentistry", text: "Biocompatible materials and whole-body thinking, from mercury-free fillings to PRF-supported healing." },
  { key: "preventive", title: "Preventive & Comfort Care", text: "Cleanings, exams, night guards and TMJ care to keep small problems small." },
];

/**
 * Service card: image, title, short text, "Learn more" pinned to the bottom.
 * `featured` cards span two columns (see cardGrid) with a wider image; `unspanAt` returns them
 * to a normal card where the grid widens to a single row.
 */
/** A service's real photos, hero first. */
export const servicePhotos = (s: Service): SiteImage[] => [s.hero.image, s.understanding?.image, ...s.why.cards.map((c) => c.image), s.candidate?.image].filter((x): x is SiteImage => !!x?.src);

export function ServiceCard({ s, featured, className, image }: { s: Service; featured?: boolean; className?: string; unspanAt?: "lg" | "xl" | null; sharesRowAt?: "lg" | "xl" | null; image?: SiteImage }) {
  // Service cards carry text only unless a photo of that treatment is passed in (the practice's own photos
  // are few, and a page never shows the same photo twice).
  return (
    <Reveal as="li" className={cn("card card-hover group flex", className)}>
      <Link href={s.path} className="flex w-full flex-col no-underline">
        {image && (
          <div className={cn("relative overflow-hidden rounded-t-lg", featured ? "aspect-[16/9]" : "aspect-[4/3] sm:aspect-[16/10]")}>
            <Picture image={image} fill sizes={featured ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 400px, 50vw"} className="object-cover" />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg group-hover:text-olive-600 sm:text-xl">{s.name}</h3>
          <p className="mt-1.5 text-base text-grey-600 sm:text-[0.95rem]">{s.shortDescription}</p>
          <span className="card-action mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-olive-700">Learn more <Icon.arrow className="arrow-nudge h-4 w-4" /></span>
        </div>
      </Link>
    </Reveal>
  );
}

/** A set of text service cards in an even grid, staggered as a group. */
export function CardList({ items, className, wideCols = 3, wideAt = "xl", avoid = [] }: { items: Service[]; className?: string; wideCols?: 3 | 4; wideAt?: "lg" | "xl"; avoid?: string[] }) {
  void avoid;
  return (
    <ul data-stagger className={cn("grid gap-3 sm:grid-cols-2 sm:gap-5", wideAt === "lg" ? (wideCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3") : "xl:grid-cols-3", className)}>
      {items.map((s) => <ServiceCard key={s.slug} s={s} />)}
    </ul>
  );
}

export async function ServicesHub({ avoid: pageAvoid = [] }: { avoid?: string[] } = {}) {
  const services = await getServices();
  const parents = new Set(services.filter((s) => s.parentPath !== "/services/").map((s) => s.parentPath));
  const used: string[] = [...pageAvoid]; // photos already on the page or in earlier groups, so nothing repeats
  return (
    <>
      {GROUPS.map((g, gi) => {
        const items = services.filter((s) => s.category === g.key).sort((a, b) => (parents.has(a.path) ? -1 : 0) - (parents.has(b.path) ? -1 : 0) || a.name.localeCompare(b.name));
        if (!items.length) return null;
        const avoid = [...used];
        distinctPhotos(items, servicePhotos, avoid).forEach((ph) => ph && used.push(ph.src));
        return (
          <Section key={g.key} id={g.key} className={gi % 2 ? "bg-warm" : "bg-warm"} tight>
            <Container>
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="eyebrow mb-4">{String(gi + 1).padStart(2, "0")}</p>
                  <h2>{g.title}</h2>
                  <p className="lead mt-4 text-base">{g.text}</p>
                </div>
                <CardList items={items} className="lg:col-span-8" avoid={avoid} />
              </div>
            </Container>
          </Section>
        );
      })}
    </>
  );
}
