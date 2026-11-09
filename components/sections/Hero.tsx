import { Fragment } from "react";
import type { HeroSection } from "@/lib/types";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { TypeLoop } from "@/components/ui/TypeLoop";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function TrustRow({ className, light }: { className?: string; light?: boolean }) {
  const items = [
    { I: Icon.google, text: <><strong className="font-semibold">{site.rating.value}</strong> on Google · {site.rating.count} reviews</> },
    { I: Icon.shield, text: <>Cash and most PPO plans accepted</> },
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
    // Dr. Lavi's outdoor photo edge to edge, words low on the left over the glass (clear of his face).
    // "The Art of" stays, the rest of the line types itself (Agoura Hills style). Phones: photo first, words below on olive.
    return (
      <section data-hero="dark" className="on-dark relative isolate overflow-hidden bg-olive-900 text-white lg:flex lg:min-h-[640px] lg:items-end" aria-labelledby="hero-heading">
        {s.image && (
          <div data-hero-media className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
            <Picture image={s.image} fill priority sizes="100vw" className="object-cover object-[60%_20%] lg:object-top" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-olive-900 lg:hidden" />
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden lg:block lg:bg-[linear-gradient(90deg,rgba(91,107,90,0.92)_0%,rgba(91,107,90,0.6)_32%,rgba(91,107,90,0)_50%)]" />
        <div className="container-x w-full pb-10 pt-2 lg:pb-24">
          <div className="hero-stage lg:max-w-[30rem]">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 ring-1 ring-white/25" data-stage="0">
              <span className="text-amber-300" aria-hidden="true">★★★★★</span> {site.rating.value} · {site.rating.count} Google reviews
            </p>
            <h1 id="hero-heading" className="text-5xl text-white">
              {s.heading}
              {s.typed && <TypeLoop text={s.typed} className="block" />}
            </h1>
            {s.lead && <p className="mt-4 text-white/85" data-stage="3">{s.lead}</p>}
            <div className="mt-6 flex flex-wrap gap-3" data-stage="4">
              {s.primary && <a href={s.primary.href} target="_blank" rel="noopener noreferrer" className="btn border border-white text-white hover:bg-white hover:text-olive-900">{s.primary.label}</a>}
              {s.secondary && <Button href={s.secondary.href} variant="light">{s.secondary.label}</Button>}
              <a href={site.sms} className="btn border border-white text-white hover:bg-white hover:text-olive-900">Text Us</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Page and landing heroes (Beverly Hills style): one full-width office photo, title low on the left over an
  // olive fade. Phones: the photo stands on its own, the words sit below it on olive (nothing over faces).
  return <PageHero crumbs={crumbs} eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} image={s.image} primary={s.primary} secondary={s.secondary} />;
}

export function PageHero({ crumbs, eyebrow, heading, sub, lead, image, primary, secondary }: { crumbs?: { name: string; path: string }[]; eyebrow?: string; heading: string; sub?: string; lead?: string; image?: HeroSection["image"]; primary?: HeroSection["primary"]; secondary?: HeroSection["secondary"] }) {
  return (
    <section data-hero="dark" className="on-dark relative isolate overflow-hidden bg-olive-900 text-white lg:flex lg:min-h-[520px] lg:items-end" aria-labelledby="hero-heading">
      {image && (
        <div data-hero-media className="relative aspect-[16/10] w-full lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
          <Picture image={image} fill priority sizes="100vw" className="object-cover object-[50%_30%]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-olive-900 lg:hidden" />
        </div>
      )}
      <div aria-hidden="true" className={image ? "absolute inset-0 -z-10 hidden lg:block lg:bg-[linear-gradient(90deg,rgba(91,107,90,0.92)_0%,rgba(91,107,90,0.6)_38%,rgba(91,107,90,0)_62%)]" : "hidden"} />
      <div className="container-x w-full pb-10 pt-4 lg:pb-16 lg:pt-28">
        <div className="hero-stage max-w-[34rem]">
          {crumbs && <div className="mb-5" data-stage="0"><Breadcrumbs items={crumbs} light /></div>}
          {eyebrow && <p className="eyebrow mb-3 text-bronze-300" data-stage="0">{eyebrow}</p>}
          <h1 id="hero-heading" className="text-5xl text-white">{heading}</h1>
          {sub && <p className="mt-3 text-2xl font-semibold text-white" data-stage="3">{sub}</p>}
          {lead && <p className="mt-3 text-white/85" data-stage="3">{lead}</p>}
          {(primary || secondary) && (
            <div className="mt-6 flex flex-wrap gap-3" data-stage="4">
              {primary && <a href={primary.href} {...(/^https?:/.test(primary.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="btn border border-white text-white hover:bg-white hover:text-olive-900">{primary.label}</a>}
              {secondary && <Button href={secondary.href} variant="light">{secondary.label}</Button>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
