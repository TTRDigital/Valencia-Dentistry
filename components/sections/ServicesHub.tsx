import Link from "next/link";
import { getServices } from "@/lib/content";
import type { Service, ServiceCategory } from "@/lib/types";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { cardGrid, cn } from "@/lib/utils";

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
export function ServiceCard({ s, featured, className, unspanAt }: { s: Service; featured?: boolean; className?: string; unspanAt?: "lg" | "xl" | null }) {
  const imgAspect = featured ? cn("aspect-[16/9] sm:aspect-[21/9]", unspanAt === "lg" && "lg:aspect-[16/10]", unspanAt === "xl" && "xl:aspect-[16/10]") : "aspect-[4/3] sm:aspect-[16/10]";
  return (
    <Reveal as="li" className={cn("card card-hover group flex flex-col", className)}>
      <Link href={s.path} className="flex h-full flex-col no-underline">
        <div className={cn("relative overflow-hidden rounded-t-lg", imgAspect)}>
          <Picture image={s.hero.image} fill sizes={featured ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 50vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <h3 className="text-lg group-hover:text-olive-600 sm:text-xl">{s.name}</h3>
          <p className={cn("mt-1.5 text-base text-grey-600 sm:text-[0.95rem]", !featured && "hidden sm:block")}>{s.shortDescription}</p>
          <span className="card-action inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-olive-700 sm:pt-4">Learn more <Icon.arrow className="arrow-nudge h-4 w-4" /></span>
        </div>
      </Link>
    </Reveal>
  );
}

/** A set of service cards laid out with cardGrid (no orphan on the last row), staggered as a group. */
export function CardList({ items, className, wideCols = 3, wideAt = "xl" }: { items: Service[]; className?: string; wideCols?: 3 | 4; wideAt?: "lg" | "xl" }) {
  const plan = cardGrid(items.length, wideCols, wideAt);
  return (
    <ul data-stagger className={cn(plan.ul, "gap-3 sm:gap-5", className)}>
      {items.map((s, i) => <ServiceCard key={s.slug} s={s} featured={i === 0 && plan.featured} unspanAt={plan.unspanAt} className={i === 0 ? plan.first : undefined} />)}
    </ul>
  );
}

export async function ServicesHub() {
  const services = await getServices();
  const parents = new Set(services.filter((s) => s.parentPath !== "/services/").map((s) => s.parentPath));
  return (
    <>
      {GROUPS.map((g, gi) => {
        const items = services.filter((s) => s.category === g.key).sort((a, b) => (parents.has(a.path) ? -1 : 0) - (parents.has(b.path) ? -1 : 0) || a.name.localeCompare(b.name));
        if (!items.length) return null;
        return (
          <Section key={g.key} id={g.key} className={gi % 2 ? "bg-white" : "bg-warm"} tight>
            <Container>
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="eyebrow mb-4">{String(gi + 1).padStart(2, "0")}</p>
                  <h2 className="text-3xl">{g.title}</h2>
                  <p className="lead mt-4 text-base">{g.text}</p>
                </div>
                <CardList items={items} className="lg:col-span-8" />
              </div>
            </Container>
          </Section>
        );
      })}
    </>
  );
}
