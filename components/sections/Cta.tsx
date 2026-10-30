import type { CtaSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { Container, Section } from "@/components/ui/Section";

export function Cta({ s }: { s: CtaSection }) {
  return (
    <Section tight className="bg-warm">
      <Container>
        <div className="dark-section overflow-hidden rounded-4xl">
          <div className="grid items-center gap-8 px-7 py-12 sm:px-12 lg:grid-cols-12 lg:py-16">
            <div className={s.image ? "lg:col-span-7" : "lg:col-span-9"}>
              {s.eyebrow && <p className="eyebrow mb-4">{s.eyebrow}</p>}
              <h2 className="text-4xl">{s.heading}</h2>
              {s.text && <p className="lead mt-4 max-w-[36rem]">{s.text}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={s.primary?.href ?? site.bookingUrl} variant="light" size="lg" arrow>{s.primary?.label ?? "Book online"}</Button>
                <Button href={s.secondary?.href ?? `tel:${site.phone.tel}`} variant="outline" size="lg" external={false}><Icon.phone className="h-4 w-4" /> {s.secondary?.label ?? site.phone.display}</Button>
              </div>
            </div>
            {s.image && (
              <div className="hidden lg:col-span-5 lg:block">
                <div className="overflow-hidden rounded-3xl ring-1 ring-white/10">
                  <Picture image={s.image} sizes="420px" className="aspect-[4/3] w-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
