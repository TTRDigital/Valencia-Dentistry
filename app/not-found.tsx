import Link from "next/link";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  const links = [
    { label: "Our services", href: "/services/" },
    { label: "Dental implants", href: "/services/dental-implants/" },
    { label: "Veneers", href: "/services/cosmetic-dentistry/veneers/" },
    { label: "Our practice", href: "/about/" },
    { label: "Blog", href: "/category/blogs/" },
    { label: "Contact", href: "/contact/" },
  ];
  return (
    <Section className="bg-warm">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">404</p>
          <h1 className="mt-4">We couldn&rsquo;t find that page.</h1>
          <p className="lead mt-5">The link may be old or mistyped. Here are a few places to go next, or call us at <a href={`tel:${site.phone.tel}`} className="font-semibold text-olive-600">{site.phone.display}</a>.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/" arrow>Back to home</Button>
            <Button href={site.bookingUrl} variant="outline">Book an appointment</Button>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {links.map((l) => <li key={l.href}><Link href={l.href} className="text-olive-600 underline-offset-4 hover:underline">{l.label}</Link></li>)}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
