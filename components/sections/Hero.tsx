import { Fragment } from "react";
import type { HeroSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils";

export function TrustRow({ className, light }: { className?: string; light?: boolean }) {
  const items = [
    { I: Icon.google, text: <><strong className="font-semibold">{site.rating.value}</strong> on Google · {site.rating.count} reviews</> },
    { I: Icon.shield, text: <>Most PPO plans accepted</> },
    { I: Icon.tag, text: <><strong className="font-semibold">$59</strong> new patient exam &amp; X-rays</> },
  ];
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-2 text-sm", light ? "text-white/80" : "text-grey-700", className)}>
      {items.map(({ I, text }, i) => (
        <li key={i} className="inline-flex items-center gap-2"><I className={cn("h-4 w-4", light ? "text-bronze-300" : "text-olive-600")} /><span>{text}</span></li>
      ))}
    </ul>
  );
}

/** Headline split into words for the staged entrance; each word rises 35ms after the previous, so lines build in reading order. */
function StagedHeading({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="hero-word" style={{ "--w": i } as React.CSSProperties}>{w}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function Hero({ s, crumbs }: { s: HeroSection; crumbs?: { name: string; path: string }[] }) {
  if (s.variant === "home") {
    return (
      <section data-hero="dark" className="dark-section overflow-hidden" aria-labelledby="hero-heading">
        <div className="container-x grid items-end gap-10 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-8 lg:pt-24">
          <div className="hero-stage pb-10 lg:col-span-7 lg:pb-24">
            {s.eyebrow && <p className="eyebrow mb-5" data-stage="0">{s.eyebrow}</p>}
            <h1 id="hero-heading" className="text-6xl"><StagedHeading text={s.heading} /></h1>
            {s.lead && <p className="lead mt-6 max-w-[38rem] text-xl" data-stage="3">{s.lead}</p>}
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap" data-stage="4">
              {s.primary && <Button href={s.primary.href} size="lg" arrow>{s.primary.label}</Button>}
              {s.secondary && <Button href={s.secondary.href} variant="outline" size="lg">{s.secondary.label}</Button>}
            </div>
            {s.trust && <div data-stage="5"><TrustRow light className="mt-10" /></div>}
          </div>
          <div className="hero-parallax relative lg:col-span-5">
            <div className="pointer-events-none absolute inset-x-6 bottom-0 top-10 arch bg-gradient-to-b from-olive-600/40 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-6 top-6 h-56 w-56 rounded-full border border-bronze-300/30 sm:h-72 sm:w-72" aria-hidden="true" />
            {s.image && /\.png$/i.test(s.image.src) ? (
              <Picture image={s.image} priority quality={85} sizes="(min-width: 1024px) 480px, (min-width: 640px) 60vw, 90vw" className="relative mx-auto block w-[min(85%,420px)] object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)] lg:w-full lg:max-w-[480px]" />
            ) : s.image ? (
              <div className="hero-portrait arch relative mx-auto mb-10 w-[min(88%,440px)] overflow-hidden shadow-lift ring-1 ring-white/10 lg:mb-0 lg:w-full lg:max-w-[460px]">
                <Picture image={s.image} priority quality={85} sizes="(min-width: 1024px) 460px, (min-width: 640px) 60vw, 88vw" cropTo={4 / 5} className="aspect-[4/5] w-full object-cover object-top" />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }
  // Page and landing heroes: full-bleed photo with the text on the left (Ideal style).
  const landing = s.variant === "landing";
  return (
    <section data-hero="dark" className="on-dark relative isolate overflow-hidden bg-ink-900 text-white" aria-labelledby="hero-heading">
      {s.image && (
        // Phones: the photo fills a 4:3 band at the top (close to the photos' own ratio, so it is not cropped into
        // a tall box and upscaled) and fades into the dark text area. Tablet and up: full-bleed behind the text.
        <div className="absolute inset-x-0 top-0 -z-10 aspect-[4/3] sm:inset-0 sm:aspect-auto">
          <Picture image={s.image} fill priority sizes="(min-width: 640px) 100vw, 100vw" cropTo={4 / 3} quality={70} className="object-cover object-[70%_25%] lg:object-[center_25%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/45 to-ink-900/10 sm:from-ink-950/95 sm:via-ink-900/60 sm:to-ink-900/25 lg:bg-gradient-to-r lg:from-ink-950/85 lg:via-ink-900/55 lg:to-ink-900/10" aria-hidden="true" />
        </div>
      )}
      <div className="container-x">
        <div className={cn("hero-stage max-w-2xl", s.image ? "pb-12 pt-[52vw] sm:pt-28 sm:pb-20 lg:py-28" : "py-14 lg:py-20", landing && "lg:py-32")}>
          {crumbs && <div className="mb-5" data-stage="0"><Breadcrumbs items={crumbs} light /></div>}
          {s.eyebrow && <p className="eyebrow mb-4 text-bronze-300" data-stage="0">{s.eyebrow}</p>}
          <h1 id="hero-heading" className="text-5xl text-white"><StagedHeading text={s.heading} /></h1>
          {s.lead && <p className="mt-5 max-w-xl text-lg text-white/85" data-stage="3">{s.lead}</p>}
          {(s.primary || s.secondary) && (
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap" data-stage="4">
              {s.primary && <Button href={s.primary.href} size="lg" arrow>{s.primary.label}</Button>}
              {s.secondary && <Button href={s.secondary.href} variant="outline" size="lg">{s.secondary.label}</Button>}
            </div>
          )}
          {s.trust && <div data-stage="5"><TrustRow light className="mt-8" /></div>}
        </div>
      </div>
    </section>
  );
}
