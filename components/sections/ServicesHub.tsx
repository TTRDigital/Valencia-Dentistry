import Link from "next/link";
import { getServices } from "@/lib/content";
import type { Service, ServiceCategory } from "@/lib/types";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";

const GROUPS: { key: ServiceCategory; title: string; text: string }[] = [
  { key: "cosmetic", title: "Cosmetic Dentistry", text: "Refinements that look like you, only brighter: veneers, Invisalign, whitening and tooth-colored fillings." },
  { key: "restorative", title: "Restorative Dentistry", text: "Crowns, bridges and implants that rebuild strength and comfort, often in fewer visits than you expect." },
  { key: "surgical", title: "Oral Surgery", text: "Extractions, bone grafting and full-arch implants planned on 3D imaging, with sedation options when appropriate." },
  { key: "holistic", title: "Holistic Dentistry", text: "Biocompatible materials and whole-body thinking, from mercury-free fillings to PRF-supported healing." },
  { key: "preventive", title: "Preventive & Comfort Care", text: "Cleanings, exams, night guards and TMJ care to keep small problems small." },
];

export function ServiceCard({ s, index = 0 }: { s: Service; index?: number }) {
  return (
    <Reveal as="li" delay={(index % 3) * 70} className="card card-hover group overflow-hidden">
      <Link href={s.path} className="flex h-full flex-col no-underline">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Picture image={{ src: s.hero.image, alt: s.hero.imageAlt }} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl group-hover:text-olive-600">{s.name}</h3>
          <p className="mt-2 flex-1 text-[0.95rem] text-grey-600">{s.shortDescription}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-olive-600">Learn more <Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
        </div>
      </Link>
    </Reveal>
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
                <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-2 xl:grid-cols-3">
                  {items.map((s, i) => <ServiceCard key={s.slug} s={s} index={i} />)}
                </ul>
              </div>
            </Container>
          </Section>
        );
      })}
    </>
  );
}
