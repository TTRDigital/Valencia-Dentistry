import Link from "next/link";
import type { Navigation } from "@/lib/types";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { Logo } from "./Logo";
import { OpenBadge } from "./OpenBadge";

export function Footer({ nav }: { nav: Navigation }) {
  const year = new Date().getFullYear();
  const socials = [
    { name: "Facebook", href: site.social.facebook, I: Icon.facebook },
    { name: "Instagram", href: site.social.instagram, I: Icon.instagram },
    { name: "LinkedIn", href: site.social.linkedin, I: Icon.linkedin },
    { name: "X", href: site.social.x, I: Icon.x },
  ];
  return (
    <footer className="dark-section mt-auto pb-24 lg:pb-0">
      <div className="container-x pt-[var(--section-y-tight)]">
        {/* Closing call to action on every page */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-5">{site.newPatients.headline}</p>
            <p className="font-display max-w-3xl text-6xl text-white">Book your visit with <em>Dr. Lavi.</em></p>
          </div>
          <div className="grid shrink-0 gap-3 sm:flex">
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">Book online <Icon.arrow className="h-4 w-4" /></a>
            <a href={`tel:${site.phone.tel}`} className="btn btn-outline btn-lg"><Icon.phone className="h-4 w-4" /> {site.phone.display}</a>
          </div>
        </div>
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link href="/" prefetch={false} className="inline-flex min-h-11 items-center rounded-md"><Logo inverted /></Link>
            <p className="mt-5 max-w-sm text-white/75">Comfortable, holistic dentistry for Valencia and Santa Clarita families, delivered one on one by Dr. Nuriel Lavi.</p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ name, href, I }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on ${name}`} className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-olive-600">
                  <I className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {nav.footer.map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
              <p className="text-lg font-semibold text-white">{col.title}</p>
              <ul className="mt-3">
                {col.items.map((it) => (
                  <li key={it.href}>
                    {/^https?:/.test(it.href) ? (
                      <a href={it.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center text-white/80 hover:text-white hover:underline">{it.label}</a>
                    ) : (
                      <Link href={it.href} prefetch={false} className="inline-flex min-h-11 min-w-11 items-center text-white/80 hover:text-white hover:underline">{it.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-3">
            <p className="text-lg font-semibold text-white">Hours &amp; location</p>
            <address className="mt-4 space-y-3 not-italic text-white/80">
              <p className="flex gap-2.5"><Icon.pin className="mt-1 h-4 w-4 shrink-0 text-bronze-300" /><a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-white hover:underline">{site.address.street}<br />{site.address.city}, {site.address.state} {site.address.zip}</a></p>
              <p className="flex items-center gap-2.5"><Icon.phone className="h-4 w-4 shrink-0 text-bronze-300" /><a href={`tel:${site.phone.tel}`} className="inline-flex min-h-11 items-center hover:text-white hover:underline">{site.phone.display}</a></p>
              <p className="flex items-center gap-2.5"><Icon.mail className="h-4 w-4 shrink-0 text-bronze-300" /><a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center break-all hover:text-white hover:underline">{site.email}</a></p>
              <div className="flex gap-2.5"><Icon.clock className="mt-1 h-4 w-4 shrink-0 text-bronze-300" /><div><p>Mon – Fri: 8am – 5pm</p><p>Sat – Sun: Closed</p><OpenBadge className="mt-2" /></div></div>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 py-7 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5">
            {nav.legal.map((l) => (
              <li key={l.href}><Link href={l.href} prefetch={false} className="inline-flex min-h-11 items-center hover:text-white hover:underline">{l.label}</Link></li>
            ))}
            <li><a href="https://ttrdigitalmarketing.com/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-white hover:underline">Website by TTR Digital Marketing</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
