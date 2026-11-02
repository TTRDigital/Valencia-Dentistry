import { Fragment } from "react";
import type { HeroSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Watermark } from "@/components/rich/Blocks";
import { FloatingBadge, PhotoFrame } from "@/components/rich/PhotoFrame";
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
      <section data-hero="dark" className="dark-section isolate overflow-hidden" aria-labelledby="hero-heading">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_100%_0%,rgba(91,107,90,0.5),transparent_60%),radial-gradient(50%_60%_at_0%_100%,rgba(154,139,114,0.16),transparent_70%)]" />
        <Watermark light className="-left-28 top-20 h-[36rem] w-[36rem]" />
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
            {s.image && (
              <>
                <FloatingBadge className="bottom-20 left-0 sm:-left-2 lg:-left-10" icon={<Icon.google className="h-5 w-5" />} title={<>{site.rating.value} <Icon.star className="inline h-4 w-4 -translate-y-0.5 text-amber-400" /> on Google</>} text={`${site.rating.count} reviews from local patients`} />
                <FloatingBadge className="right-0 top-24 hidden sm:flex lg:-right-6" icon={<Icon.tag className="h-5 w-5" />} title="$59 first visit" text="Exam & digital X-rays" />
              </>
            )}
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
            <div className="lg:col-span-6 xl:col-span-5">
              <PhotoFrame image={s.image} priority sizes="(min-width: 1280px) 520px, (min-width: 1024px) 45vw, 100vw" arch accent="olive" className="mx-auto max-w-[520px]">
                <FloatingBadge className="-left-3 bottom-6 sm:-left-8" icon={<Icon.google className="h-5 w-5" />} title={<>{site.rating.value} <Icon.star className="inline h-4 w-4 -translate-y-0.5 text-amber-400" /> on Google</>} text={`${site.rating.count} reviews`} />
                <FloatingBadge className="-right-2 top-6 hidden sm:flex sm:-right-6" icon={<Icon.tag className="h-5 w-5" />} title="$59 first visit" text="Exam & X-rays" />
              </PhotoFrame>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
