"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Navigation } from "@/lib/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icons";
import { Logo } from "./Logo";

export function Header({ nav }: { nav: Navigation }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const megaId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (state adjusted during render, per React's guidance)
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  // Lock scroll while the mobile menu is open; close on Escape
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMobileOpen(false); setMegaOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [mobileOpen]);

  // Close the mega menu when focus or pointer leaves it
  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: PointerEvent) => { if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [megaOpen]);

  const openMega = () => { window.clearTimeout(closeTimer.current); setMegaOpen(true); };
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160); };
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const desktopNav = nav.header;

  return (
    <header className={cn("sticky top-0 z-50 bg-offwhite transition-[box-shadow] duration-300", scrolled && "shadow-[0_1px_0_rgb(20_20_20/0.08),0_8px_24px_-16px_rgb(20_20_20/0.25)]")} data-scrolled={scrolled || undefined}>
      {/* Main bar */}
      <div className="container-x">
        <div className={cn("flex items-center justify-between gap-6 transition-[height] duration-300", scrolled ? "h-16" : "h-[72px]")}>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-md">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1.5">
              {desktopNav.map((item) =>
                item.mega ? (
                  <li key={item.href} className="relative" onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                    <button
                      type="button"
                      className={cn("flex min-h-11 items-center gap-1 px-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-ink-900 transition-colors hover:text-olive-600", (megaOpen || isActive(item.href)) && "text-olive-600")}
                      aria-expanded={megaOpen}
                      aria-controls={megaId}
                      onClick={() => setMegaOpen((v) => !v)}
                    >
                      {item.label}
                      <Icon.chevron className={cn("h-4 w-4 transition-transform", megaOpen && "rotate-180")} />
                    </button>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className={cn("flex min-h-11 items-center px-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-ink-900 transition-colors hover:text-olive-600", isActive(item.href) && "text-olive-600")} aria-current={isActive(item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-1 lg:gap-3">
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center border-b-2 border-ink-900 px-1 text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-ink-900 transition-colors hover:border-olive-600 hover:text-olive-600 lg:inline-flex">
              Schedule Appointment
            </a>
            <a href={`tel:${site.phone.tel}`} className="hidden min-h-11 items-center px-1 text-[0.8125rem] font-bold text-ink-900 hover:text-olive-600 xl:inline-flex">
              {site.phone.display}
            </a>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm whitespace-nowrap px-3.5 sm:px-4 lg:hidden">
              Book Now
            </a>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center text-ink-900 hover:text-olive-600 lg:hidden" aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <Icon.close className="h-6 w-6" /> : <Icon.menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega menu */}
      <div
        id={megaId}
        ref={megaRef}
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
        className={cn("absolute inset-x-0 top-full hidden border-t hairline bg-offwhite shadow-lift transition-[opacity,transform] duration-200 ease-out lg:block", megaOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0")}
        aria-hidden={!megaOpen}
      >
        <div className="container-x grid grid-cols-4 gap-8 py-8">
          {nav.serviceGroups.map((g) => (
            <div key={g.title}>
              {g.href ? (
                <Link href={g.href} prefetch={false} className="group inline-flex items-center gap-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-ink-900 hover:text-olive-600" tabIndex={megaOpen ? 0 : -1}>
                  {g.title} <Icon.arrow className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ) : (
                <p className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-ink-900">{g.title}</p>
              )}
              {g.description && <p className="mt-1 text-sm text-grey-600">{g.description}</p>}
              <ul className="mt-4 space-y-1">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} prefetch={false} className="block rounded-xl px-3 py-2 -mx-3 hover:bg-greige-50" tabIndex={megaOpen ? 0 : -1}>
                      <span className="block text-[0.9375rem] font-medium text-ink-900">{it.label}</span>
                      {it.description && <span className="block text-[0.8125rem] text-grey-600">{it.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t hairline bg-greige-50/60">
          <div className="container-x flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-grey-700">
            <p><span className="font-semibold text-ink-900">{site.offer.headline}:</span> {site.offer.detail}. Most PPO plans accepted.</p>
            <Link href="/services/" prefetch={false} className="font-semibold text-olive-600 hover:underline" tabIndex={megaOpen ? 0 : -1}>View all services →</Link>
          </div>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <div id="mobile-menu" className={cn("fixed inset-0 top-[var(--mobile-top,0px)] z-40 overflow-y-auto bg-offwhite transition-[opacity,visibility] duration-200 lg:hidden", mobileOpen ? "visible opacity-100" : "invisible opacity-0")} aria-hidden={!mobileOpen} style={{ top: scrolled ? 64 : 72 }}>
        <nav aria-label="Mobile" className="container-x pb-28 pt-4">
          <ul className="divide-y hairline">
            {nav.header.map((item) => (
              <li key={item.href}>
                {item.mega ? (
                  <details className="group">
                    <summary className="flex min-h-14 cursor-pointer items-center justify-between py-3 text-lg font-medium text-ink-900">
                      {item.label} <Icon.chevron className="h-5 w-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pb-4">
                      {nav.serviceGroups.map((g) => (
                        <div key={g.title} className="mb-4">
                          {g.href ? <Link href={g.href} prefetch={false} className="block py-1 text-sm font-semibold uppercase tracking-wider text-olive-600" tabIndex={mobileOpen ? 0 : -1}>{g.title}</Link> : <p className="py-1 text-sm font-semibold uppercase tracking-wider text-olive-600">{g.title}</p>}
                          <ul>
                            {g.items.map((it) => (
                              <li key={it.href}><Link href={it.href} prefetch={false} className="block min-h-11 py-2.5 text-ink-900" tabIndex={mobileOpen ? 0 : -1}>{it.label}</Link></li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link href={item.href} prefetch={false} className="flex min-h-14 items-center py-3 text-lg font-medium text-ink-900" tabIndex={mobileOpen ? 0 : -1}>{item.label}</Link>
                )}
              </li>
            ))}
            <li><Link href="/appointment/" prefetch={false} className="flex min-h-14 items-center py-3 text-lg font-medium text-ink-900" tabIndex={mobileOpen ? 0 : -1}>Request an Appointment</Link></li>
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" tabIndex={mobileOpen ? 0 : -1}>Book Online</a>
            <a href={`tel:${site.phone.tel}`} className="btn btn-outline btn-lg" tabIndex={mobileOpen ? 0 : -1}><Icon.phone className="h-4 w-4" /> {site.phone.display}</a>
          </div>
          <p className="mt-6 text-sm text-grey-600">{site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}<br />Mon – Fri 8am – 5pm</p>
        </nav>
      </div>
    </header>
  );
}
