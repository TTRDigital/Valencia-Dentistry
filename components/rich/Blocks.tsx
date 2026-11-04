import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { getServices } from "@/lib/content";
import type { SiteImage, Testimonial } from "@/lib/types";
import { CountUp } from "@/components/motion/CountUp";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { MARK } from "@/components/layout/logo-paths";
import { PhotoFrame } from "./PhotoFrame";

/** The logo's V-and-tooth mark as a large, faint background watermark. */
export function Watermark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox={`0 0 ${MARK.width} ${MARK.height}`} aria-hidden="true" focusable="false" className={cn("watermark pointer-events-none absolute -z-10 select-none", light ? "text-white/[0.05]" : "text-ink-900/[0.035]", className)}>
      <path fill="currentColor" d={MARK.v} />
      <path fill="currentColor" d={MARK.tooth} />
    </svg>
  );
}

/** Practice facts as a band of large numbers (count up once in view) with a short label each. */
export async function StatBand({ dark, className }: { dark?: boolean; className?: string }) {
  const treatments = (await getServices()).length;
  const items: { value: ReactNode; label: string; icon: ReactNode }[] = [
    { value: <><CountUp value={site.rating.value} decimals={1} /><Icon.star className="ml-1.5 inline h-6 w-6 -translate-y-1 text-amber-400" /></>, label: "Google rating", icon: <Icon.google className="h-5 w-5" /> },
    { value: <CountUp value={site.rating.count} />, label: "Google reviews from local patients", icon: <Icon.heart className="h-5 w-5" /> },
    { value: <CountUp value={treatments} />, label: "Treatments in one office, planned by Dr. Lavi", icon: <Icon.tooth className="h-5 w-5" /> },
    { value: "PPO", label: "Most PPO plans accepted, benefits checked for you", icon: <Icon.shield className="h-5 w-5" /> },
  ];
  return (
    <dl data-stagger className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-lg lg:grid-cols-4", dark ? "bg-white/10" : "bg-ink-900/10", className)}>
      {items.map((it) => (
        <Reveal key={it.label} className={cn("flex flex-col-reverse justify-end gap-4 p-6 sm:p-9", dark ? "bg-ink-900" : "bg-white")}>
          <dt className={cn("flex items-start gap-2 text-sm sm:text-base", dark ? "text-white/75" : "text-grey-700")}><span className={cn("mt-0.5 shrink-0", dark ? "text-bronze-300" : "text-olive-600")}>{it.icon}</span>{it.label}</dt>
          <dd className={cn("font-display text-6xl leading-none tracking-tight sm:text-7xl xl:text-8xl", dark ? "text-white" : "text-ink-900")}>{it.value}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

/** Card with an icon tile, title and text. Optional number badge. Used for features, steps and reasons. */
export function IconCard({ icon = "sparkle", title, text, number, dark, className }: { icon?: IconName; title: string; text?: string; number?: number; dark?: boolean; className?: string }) {
  const I = Icon[icon] ?? Icon.sparkle;
  return (
    <div className={cn("group relative h-full rounded-lg p-6 sm:p-7", dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-white ring-1 ring-ink-900/[0.07]", className)}>
      <div className="flex items-start justify-between gap-4">
        <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-md", dark ? "bg-bronze-300/15 text-bronze-300" : "bg-olive-100 text-olive-700")}><I className="h-6 w-6" /></span>
        {number !== undefined && <span aria-hidden="true" data-num={String(number).padStart(2, "0")} className={cn("font-display text-3xl font-semibold before:content-[attr(data-num)]", dark ? "text-white/20" : "text-ink-900/10")} />}
      </div>
      <h3 className={cn("mt-5 text-xl", dark && "text-white")}>{title}</h3>
      {text && <p className={cn("mt-2 text-base sm:text-[0.95rem]", dark ? "text-white/75" : "text-grey-700")}>{text}</p>}
      <span aria-hidden="true" className={cn("absolute inset-x-6 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-[var(--dur-std)] group-hover:scale-x-100", dark ? "bg-bronze-300" : "bg-olive-600")} />
    </div>
  );
}

/** One review shown large: stars, the words, the name. Exactly as written on Google. */
export function QuoteHighlight({ t, className }: { t: Testimonial; className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden rounded-lg bg-olive-700 p-8 text-white sm:p-12", className)}>
      <Icon.quote className="absolute -right-2 -top-2 h-32 w-32 text-white/10" aria-hidden="true" />
      <div className="flex gap-1 text-amber-300" role="img" aria-label={`${t.rating} out of 5 stars`}>{Array.from({ length: t.rating }, (_, i) => <Icon.star key={i} className="h-5 w-5" />)}</div>
      <blockquote className="relative mt-5 font-display text-2xl leading-snug text-white sm:text-3xl">“{t.text}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 text-white/85">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 font-semibold text-white" aria-hidden="true">{t.author.charAt(0)}</span>
        <span><span className="block font-semibold text-white">{t.author}</span><span className="text-sm">Google review{t.when ? ` · ${t.when}` : ""}</span></span>
      </figcaption>
    </figure>
  );
}

/** A round link with its label running around the rim (rotates slowly); the arrow sits in the middle. */
export function RoundCta({ href, text, className }: { href: string; text: string; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={text.replace(/·/g, "").trim()} data-cursor="Book" className={cn("btn-primary group relative inline-grid h-36 w-36 shrink-0 place-items-center rounded-full bg-olive-600 text-white shadow-lift transition-transform duration-500 hover:scale-105 sm:h-44 sm:w-44", className)}>
      <svg viewBox="0 0 120 120" className="seal-spin absolute inset-0 h-full w-full" aria-hidden="true">
        <defs><path id="round-cta-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        <text fill="currentColor" fontSize="9.5" fontWeight="700" letterSpacing="2" textLength="285" lengthAdjust="spacing" fontFamily="var(--font-urbanist)"><textPath href="#round-cta-path">{text}</textPath></text>
      </svg>
      <Icon.arrow className="h-8 w-8 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
    </a>
  );
}

/** Closing call to action: a clear headline, one Book button, contact details and a photo. */
export function CtaBanner({ heading, text, image, buttonLabel = "Book a consultation", className }: { heading: string; text: string; image?: SiteImage; buttonLabel?: string; className?: string }) {
  return (
    <div className={cn("on-dark relative isolate overflow-hidden rounded-lg bg-ink-900 text-white", className)}>
      <div className="grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-12 lg:gap-14 lg:p-16">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-bronze-300 ring-1 ring-white/15"><Icon.user className="h-4 w-4" /> {site.newPatients.headline}</p>
          <h2 className="mt-6 text-5xl text-white">{heading}</h2>
          <p className="mt-6 max-w-xl text-lg text-white/80">{text}</p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-lg">{buttonLabel} <Icon.arrow className="h-4 w-4" /></a>
            <div className="grid gap-2">
              <a href={`tel:${site.phone.tel}`} className="inline-flex min-h-11 items-center gap-2 text-2xl font-semibold text-white hover:text-bronze-300"><Icon.phone className="h-6 w-6 text-bronze-300" /> {site.phone.display}</a>
              <p className="flex items-center gap-2 text-sm text-white/75"><Icon.clock className="h-4 w-4 text-bronze-300" /> {site.hours[0].days}, {site.hours[0].label}</p>
              <p className="flex items-center gap-2 text-sm text-white/75"><Icon.pin className="h-4 w-4 text-bronze-300" /> {site.address.street}, {site.address.city}</p>
            </div>
          </div>
        </div>
        {image && (
          <div className="lg:col-span-5">
            <PhotoFrame image={image} sizes="(min-width: 1024px) 460px, 100vw" accent="olive" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Section heading with eyebrow, optional index number, heading and lead; light or dark. */
export function RichHeading({ eyebrow, heading, lead, align = "left", dark, className, id }: { eyebrow?: string; heading: ReactNode; lead?: ReactNode; align?: "left" | "center"; dark?: boolean; className?: string; id?: string }) {
  return (
    <div data-reveal="" className={cn("max-w-[46rem]", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", align === "center" && "justify-center", dark && "text-bronze-300")}>{eyebrow}</p>}
      <h2 id={id} className={cn("text-4xl", dark && "text-white")}>{heading}</h2>
      {lead && <p className={cn("mt-5 text-lg", dark ? "text-white/80" : "text-grey-700", align === "center" && "mx-auto")}>{lead}</p>}
    </div>
  );
}

/** A slow, endless ticker of words (treatments, promises) separated by the tooth mark. */
export function Marquee({ items, dark, outline, reverse, className }: { items: string[]; dark?: boolean; outline?: boolean; reverse?: boolean; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((w) => (
        <li key={w} className={cn("flex items-center gap-8 pr-8 font-display text-4xl sm:text-7xl", outline ? "text-outline" : "", dark ? (outline ? "text-white/50" : "text-white/90") : "text-ink-900/80")}>
          {w}
          <svg viewBox={`0 0 ${MARK.width} ${MARK.height}`} className={cn("h-6 w-auto sm:h-8", dark ? "text-bronze-300" : "text-olive-600")} aria-hidden="true"><path fill="currentColor" d={MARK.tooth} /></svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("marquee py-4 sm:py-6", className)}>
      <div className="marquee-track" data-reverse={reverse || undefined}>{row(false)}{row(true)}</div>
    </div>
  );
}

/** Circular text that turns slowly around the tooth mark: a quiet signature on hero portraits. */
export function Seal({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("h-28 w-28 rounded-full bg-ink-900 text-bronze-300 shadow-lift ring-1 ring-white/15 sm:h-32 sm:w-32", className ?? "relative")} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="seal-spin absolute inset-0 h-full w-full">
        <defs><path id="seal-path" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
        <text fill="currentColor" fontSize="10.5" letterSpacing="2.1" textLength="272" lengthAdjust="spacing" fontFamily="var(--font-urbanist)" fontWeight="600"><textPath href="#seal-path">{text}</textPath></text>
      </svg>
      <svg viewBox={`0 0 ${MARK.width} ${MARK.height}`} className="absolute left-1/2 top-1/2 h-9 w-auto -translate-x-1/2 -translate-y-1/2 sm:h-10"><path fill="#fff" d={MARK.v} /><path fill="currentColor" d={MARK.tooth} /></svg>
    </div>
  );
}
