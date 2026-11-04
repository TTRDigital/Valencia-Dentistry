import { Fragment } from "react";
import type { HeroSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PhotoFrame } from "@/components/rich/PhotoFrame";
import { Button } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function TrustRow({ className, light }: { className?: string; light?: boolean }) {
  const items = [
    { I: Icon.google, text: <><strong className="font-semibold">{site.rating.value}</strong> on Google · {site.rating.count} reviews</> },
    { I: Icon.shield, text: <>Most PPO plans accepted</> },
    { I: Icon.user, text: <><strong className="font-semibold">New patients</strong> welcome</> },
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
    // One solid photo with the words over it (Dr. Lavi stands left of centre, so the text sits on the right).
    // Phones: the photo fills the screen and the text sits on a dark fade at the bottom.
    return (
      <section data-hero="dark" className="on-dark relative isolate flex min-h-[calc(100svh-72px)] items-end overflow-hidden bg-ink-900 text-white lg:min-h-[680px] lg:items-center" aria-labelledby="hero-heading">
        {s.image && (
          <div data-hero-media className="absolute inset-0 -z-20">
            {/* Phones get a portrait photo (sharp at full height); desktop shows the wide photo edge to edge with the words over the glass on its left, clear of his face */}
            {s.mobileImage && <Picture image={s.mobileImage} fill priority sizes="(max-width: 1023px) 100vw, 1px" className="object-cover object-top lg:hidden" />}
            <Picture image={s.image} fill priority sizes="(min-width: 1024px) 100vw, 1px" className={s.mobileImage ? "hidden object-cover object-top lg:block" : "object-cover object-top"} />
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,18,16,0)_30%,rgba(18,18,16,0.88)_72%)] lg:bg-[linear-gradient(90deg,rgba(18,18,16,0.85)_0%,rgba(18,18,16,0.6)_30%,rgba(18,18,16,0)_48%)]" />
        <div className="container-x w-full pb-28 pt-16 lg:py-24">
          <div className="hero-stage lg:max-w-[25rem] xl:max-w-[31rem]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm ring-1 ring-white/20 backdrop-blur-sm" data-stage="0">
              <Icon.google className="h-4 w-4" /> <strong className="font-semibold">{site.rating.value}</strong> <Icon.star className="h-3.5 w-3.5 text-amber-400" /> {site.rating.count} Google reviews
            </p>
            <h1 id="hero-heading" className="text-5xl text-white lg:text-[clamp(2.75rem,1.2rem+2.6vw,4rem)]"><StagedHeading text={s.heading} accent={0} /></h1>
            {s.lead && <p className="mt-5 text-lg text-white/85" data-stage="3">{s.lead}</p>}
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap" data-stage="4">
              {s.primary && <Button href={s.primary.href} size="lg" variant="light" arrow>{s.primary.label}</Button>}
              {s.secondary && <Button href={s.secondary.href} variant="outline" size="lg">{s.secondary.label}</Button>}
            </div>
          </div>
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
              </PhotoFrame>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
