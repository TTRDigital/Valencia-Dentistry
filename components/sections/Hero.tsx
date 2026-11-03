import { Fragment } from "react";
import type { HeroSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Seal, Watermark } from "@/components/rich/Blocks";
import { FloatingBadge, PhotoFrame } from "@/components/rich/PhotoFrame";
import { FannedStack } from "@/components/rich/FannedStack";
import { OpenBadge } from "@/components/layout/OpenBadge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function TrustRow({ className, light }: { className?: string; light?: boolean }) {
  const items = [
    { I: Icon.google, text: <><strong className="font-semibold">{site.rating.value}</strong> on Google · {site.rating.count} reviews</> },
    { I: Icon.shield, text: <>Most PPO plans accepted</> },
    { I: Icon.user, text: <>Dr. Lavi at <strong className="font-semibold">every visit</strong></> },
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
export function StagedHeading({ text, accent = 2 }: { text: string; accent?: number }) {
  // The last `accent` words are set in the italic display cut (visual emphasis only; the words are unchanged).
  const words = text.split(" ");
  const from = words.length > accent + 1 ? words.length - accent : words.length;
  const word = (w: string, i: number) => <span className="hero-word" style={{ "--w": i } as React.CSSProperties}>{w}</span>;
  return (
    <>
      {words.slice(0, from).map((w, i) => <Fragment key={i}>{word(w, i)}{" "}</Fragment>)}
      {from < words.length && (
        <em>{words.slice(from).map((w, j) => <Fragment key={j}>{word(w, from + j)}{j < words.length - from - 1 ? " " : null}</Fragment>)}</em>
      )}
    </>
  );
}

export function Hero({ s, crumbs }: { s: HeroSection; crumbs?: { name: string; path: string }[] }) {
  if (s.variant === "home") {
    return (
      <section data-hero="dark" className="dark-section isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center" aria-labelledby="hero-heading">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <Watermark light className="-left-28 top-20 h-[36rem] w-[36rem]" />
        <div className="container-x grid w-full items-center gap-8 pb-16 pt-4 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-6">
          <div className="hero-stage lg:col-span-7">
            <div className="mb-6 flex flex-wrap items-center gap-3" data-stage="0">
              {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15"><OpenBadge showNext className="text-white" /></span>
            </div>
            <h1 id="hero-heading" className="text-hero"><StagedHeading text={s.heading} accent={3} /></h1>
            {s.lead && <p className="lead mt-7 max-w-[36rem] text-xl" data-stage="3">{s.lead}</p>}
            <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap" data-stage="4">
              {s.primary && <Button href={s.primary.href} size="lg" arrow>{s.primary.label}</Button>}
              {s.secondary && <Button href={s.secondary.href} variant="outline" size="lg">{s.secondary.label}</Button>}
            </div>
            {s.trust && <div data-stage="5"><TrustRow light className="mt-10" /></div>}
          </div>
          <div data-hero-media className="relative order-first mx-auto w-full max-w-[380px] lg:order-none lg:col-span-5 lg:max-w-none">
            {s.image && <FannedStack main={s.image} side={s.gallery ?? []} />}
            {s.image && (
              <>
                <FloatingBadge className="bottom-6 left-0 lg:-left-6" icon={<Icon.google className="h-5 w-5" />} title={<>{site.rating.value} <Icon.star className="inline h-4 w-4 -translate-y-0.5 text-amber-400" /> on Google</>} text={`${site.rating.count} reviews from local patients`} />
                <Seal text="VALENCIA DENTISTRY · SANTA CLARITA · " className="absolute right-0 top-0 hidden lg:block lg:-right-4" />
              </>
            )}
          </div>
        </div>
        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 lg:flex" aria-hidden="true">
          Scroll
          <span className="scroll-cue relative h-10 w-px overflow-hidden bg-white/15"><span className="absolute inset-x-0 top-0 h-1/2 bg-bronze-300" /></span>
        </div>
      </section>
    );
  }

  // Page and landing heroes: dark band, text on the left, the photo whole on the right (its own proportions,
  // so heads are never cut), with floating proof points.
  const landing = s.variant === "landing";
  return (
    <section data-hero="dark" className="on-dark relative isolate overflow-hidden bg-ink-900 text-white" aria-labelledby="hero-heading">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_100%_0%,rgba(91,107,90,0.5),transparent_60%),radial-gradient(50%_60%_at_0%_100%,rgba(154,139,114,0.16),transparent_70%)]" />
      <Watermark light className="-left-28 top-16 h-[34rem] w-[34rem]" />
      <div className="container-x">
        <div className={cn("grid items-center gap-12 pb-14 pt-10 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-14", landing && "lg:pb-28")}>
          <div className={cn("hero-stage", s.image ? "lg:col-span-6 xl:col-span-7" : "lg:col-span-9")}>
            {crumbs && <div className="mb-6" data-stage="0"><Breadcrumbs items={crumbs} light /></div>}
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
          {s.image && (
            <div data-hero-media className="lg:col-span-6 xl:col-span-5">
              <PhotoFrame image={s.image} priority sizes="(min-width: 1280px) 520px, (min-width: 1024px) 45vw, 100vw" arch accent="olive" className="mx-auto max-w-[520px]">
                <FloatingBadge className="-left-3 bottom-6 sm:-left-8" icon={<Icon.google className="h-5 w-5" />} title={<>{site.rating.value} <Icon.star className="inline h-4 w-4 -translate-y-0.5 text-amber-400" /> on Google</>} text={`${site.rating.count} reviews`} />
                <FloatingBadge className="-right-2 top-6 hidden sm:flex sm:-right-6" icon={<Icon.shield className="h-5 w-5" />} title="Most PPO plans" text="Benefits checked for you" />
              </PhotoFrame>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
