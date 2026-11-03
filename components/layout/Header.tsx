"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Navigation } from "@/lib/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icons";
import { Logo } from "./Logo";
import { navSectionFor } from "@/lib/nav";

export function Header({ nav, postPaths = [] }: { nav: Navigation; postPaths?: string[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // return focus to the control that opened the menu
      if (megaRef.current?.contains(document.activeElement) || document.activeElement === triggerRef.current) triggerRef.current?.focus();
      setMobileOpen(false);
      setMegaOpen(false);
    };
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

  const hoverOpenedAt = useRef(0);
  const openMega = () => { window.clearTimeout(closeTimer.current); if (!megaOpen) hoverOpenedAt.current = Date.now(); setMegaOpen(true); };
  // A click that lands right after the hover opened the panel must not close it again;
  // keyboard (Enter/Space, detail 0) and later clicks toggle as usual.
  const onMegaClick = (e: React.MouseEvent) => {
    if (e.detail > 0 && megaOpen && Date.now() - hoverOpenedAt.current < 600) return;
    setMegaOpen((v) => !v);
  };
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160); };
  // The top-level item for the current page (a service page highlights Services, a blog post highlights Blog, …)
  const section = navSectionFor(pathname, postPaths);
  const isActive = (href: string) => section === href;
  const current = (href: string) => (pathname === href ? ("page" as const) : isActive(href) ? ("true" as const) : undefined);
  const desktopNav = nav.header;

  return (
    <header className="site-header sticky top-0 z-50 h-[72px]" data-scrolled={scrolled || undefined} data-open={megaOpen || mobileOpen || undefined}>
      {/* The header box keeps a fixed 72px height (no layout shift). Over a hero it starts transparent
          (the hero runs underneath it, see [data-hero] in globals.css); after scrolling the background
          fades in, scales to 64px and gains a shadow, and the row moves up 4px. Transforms and opacity only. */}
      <div aria-hidden="true" className={cn("header-bg absolute inset-0 origin-top bg-offwhite", scrolled && "scale-y-[0.889]")} />
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 top-[64px] h-4 bg-gradient-to-b from-ink-900/10 to-transparent opacity-0 transition-opacity duration-300", scrolled && "opacity-100")} />
      {/* Main bar */}
      <div className={cn("container-x relative transition-transform duration-300 ease-out", scrolled && "-translate-y-1")}>
        <div className="flex h-[72px] items-center justify-between gap-6">
          <Link href="/" className={cn("inline-flex min-h-12 origin-left items-center rounded-md transition-transform duration-300 ease-out", scrolled && "scale-[0.92]")}>
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1.5">
              {desktopNav.map((item) =>
                item.mega ? (
                  <li key={item.href} className="relative" onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                    <button
                      ref={triggerRef}
                      type="button"
                      className={cn("nav-link relative flex min-h-11 items-center gap-1 px-3 text-[0.9375rem] font-medium text-[var(--header-fg)] hover:text-[var(--header-accent)]", megaOpen && "text-[var(--header-accent)]")}
                      data-active={isActive(item.href) || undefined}
                      aria-expanded={megaOpen}
                      aria-controls={megaId}
                      onClick={onMegaClick}
                      onKeyDown={(e) => {
                        // Down Arrow (or Tab while the panel is open) moves focus into the panel's first link
                        if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey && megaOpen)) {
                          e.preventDefault();
                          setMegaOpen(true);
                          requestAnimationFrame(() => megaRef.current?.querySelector<HTMLElement>("a")?.focus());
                        }
                      }}
                    >
                      {item.label}
                      <Icon.chevron className={cn("h-4 w-4 transition-transform", megaOpen && "rotate-180")} />
                    </button>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className="nav-link relative flex min-h-11 items-center px-3 text-[0.9375rem] font-medium text-[var(--header-fg)] hover:text-[var(--header-accent)]" data-active={isActive(item.href) || undefined} aria-current={current(item.href)}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-1 lg:gap-3">
            <a href={`tel:${site.phone.tel}`} className="hidden min-h-11 items-center gap-2 px-1 text-[0.9375rem] font-semibold text-[var(--header-fg)] hover:text-[var(--header-accent)] xl:inline-flex">
              <Icon.phone className="h-4 w-4 text-[var(--header-accent)]" /> {site.phone.display}
            </a>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm whitespace-nowrap px-3.5 sm:px-5">
              Book Now
            </a>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center text-[var(--header-fg)] hover:text-[var(--header-accent)] lg:hidden" aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} onClick={() => setMobileOpen((v) => !v)}>
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
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node) && e.relatedTarget !== triggerRef.current) setMegaOpen(false); }}
        style={{ top: scrolled ? 64 : 72 }}
        data-open={megaOpen || undefined}
        className={cn("mega absolute inset-x-0 hidden border-t hairline bg-offwhite shadow-lift lg:block", !megaOpen && "pointer-events-none")}
        aria-hidden={!megaOpen}
      >
        <div className="container-x grid grid-cols-4 gap-8 py-8">
          {nav.serviceGroups.map((g, gi) => (
            <div key={g.title} className="mega-item" style={{ "--i": gi } as React.CSSProperties}>
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
                    <Link href={it.href} prefetch={false} aria-current={pathname === it.href ? "page" : undefined} className={cn("-mx-3 block rounded-md border-l-2 px-3 py-2 hover:bg-greige-50", pathname === it.href ? "border-olive-600 bg-greige-50" : "border-transparent")} tabIndex={megaOpen ? 0 : -1}>
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
            <p><span className="font-semibold text-ink-900">{site.newPatients.headline}:</span> {site.newPatients.detail.toLowerCase()}. Most PPO plans accepted.</p>
            <Link href="/services/" prefetch={false} className="font-semibold text-olive-600 hover:underline" tabIndex={megaOpen ? 0 : -1}>View all services →</Link>
          </div>
        </div>
      </div>

      {/* Mobile full-screen menu: dark panel, large serif links that cascade in */}
      <div id="mobile-menu" data-lenis-prevent data-open={mobileOpen || undefined} className={cn("mobile-menu fixed inset-0 z-40 isolate overflow-y-auto bg-ink-900 text-white transition-[opacity,visibility] duration-300 lg:hidden", mobileOpen ? "visible opacity-100" : "invisible opacity-0")} aria-hidden={!mobileOpen} style={{ top: scrolled ? 64 : 72 }}>
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <nav aria-label="Mobile" className="container-x pb-32 pt-6">
          <ul>
            {nav.header.map((item, i) => (
              <li key={item.href} className="mm-item border-b border-white/10" style={{ "--i": i } as React.CSSProperties}>
                {item.mega ? (
                  <details className="group">
                    <summary className={cn("flex min-h-16 cursor-pointer items-center justify-between py-3 font-display text-4xl", isActive(item.href) ? "italic text-bronze-300" : "text-white")}>
                      {item.label} <Icon.chevron className="h-6 w-6 text-white/60 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="grid gap-5 pb-6 pt-1">
                      {nav.serviceGroups.map((g) => (
                        <div key={g.title}>
                          {g.href ? <Link href={g.href} prefetch={false} className="block py-1 text-sm font-semibold uppercase tracking-[0.14em] text-bronze-300" tabIndex={mobileOpen ? 0 : -1}>{g.title}</Link> : <p className="py-1 text-sm font-semibold uppercase tracking-[0.14em] text-bronze-300">{g.title}</p>}
                          <ul className="mt-1 grid grid-cols-2 gap-x-4">
                            {g.items.map((it) => (
                              <li key={it.href}><Link href={it.href} prefetch={false} aria-current={pathname === it.href ? "page" : undefined} className={cn("flex min-h-11 items-center text-[1.0625rem]", pathname === it.href ? "font-semibold text-bronze-300" : "text-white/85")} tabIndex={mobileOpen ? 0 : -1}>{it.label}</Link></li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link href={item.href} prefetch={false} aria-current={current(item.href)} className={cn("flex min-h-16 items-center justify-between py-3 font-display text-4xl", isActive(item.href) ? "italic text-bronze-300" : "text-white")} tabIndex={mobileOpen ? 0 : -1}>
                    {item.label}
                    <Icon.arrow className="h-6 w-6 text-white/40" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mm-item mt-8 grid gap-3" style={{ "--i": nav.header.length } as React.CSSProperties}>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" tabIndex={mobileOpen ? 0 : -1}>Book online <Icon.arrow className="h-4 w-4" /></a>
            <a href={`tel:${site.phone.tel}`} className="btn btn-lg border border-white/30 text-white" tabIndex={mobileOpen ? 0 : -1}><Icon.phone className="h-4 w-4" /> {site.phone.display}</a>
            <Link href="/appointment/" prefetch={false} className="flex min-h-11 items-center justify-center text-white/80 underline-offset-4 hover:underline" tabIndex={mobileOpen ? 0 : -1}>Request an appointment</Link>
          </div>
          <p className="mm-item mt-8 text-white/60" style={{ "--i": nav.header.length + 1 } as React.CSSProperties}>{site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}<br />Mon – Fri 8am – 5pm</p>
        </nav>
      </div>
    </header>
  );
}
