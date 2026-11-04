import { Fragment } from "react";
import type { HeroSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FloatingBadge, PhotoFrame } from "@/components/rich/PhotoFrame";
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
  // The last `accent` words are set in the accent colour (visual emphasis only; the words are unchanged).
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
    // Clean and calm: one headline, one line of support, two actions, one photo. Nothing else competes.
    return (
      <section data-hero="light" className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#eef1ea_0%,#fafaf4_100%)]" aria-labelledby="hero-heading">
        <div className="container-x grid w-full items-center gap-10 pb-14 pt-10 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-16">
          <div className="hero-stage lg:col-span-7">
            {s.eyebrow && <p className="eyebrow mb-5" data-stage="0">{s.eyebrow}</p>}
            <h1 id="hero-heading" className="text-hero max-w-[15ch]"><StagedHeading text={s.heading} accent={3} /></h1>
            {s.lead && <p className="mt-6 max-w-[34rem] text-lg text-grey-700 sm:text-xl" data-stage="3">{s.lead}</p>}
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap" data-stage="4">
              {s.primary && <Button href={s.primary.href} size="lg" arrow>{s.primary.label}</Button>}
              {s.secondary && <Button href={s.secondary.href} variant="outline" size="lg">{s.secondary.label}</Button>}
            </div>
            {s.trust && <div data-stage="5"><TrustRow className="mt-8" /></div>}
          </div>
          {s.image && (
            <div data-hero-media className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:col-span-5 lg:max-w-[460px]">
              <PhotoFrame image={s.image} priority sizes="(min-width: 1024px) 460px, 90vw" frameClassName="rounded-2xl shadow-lift" />
            </div>
          )}
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
              </PhotoFrame>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
