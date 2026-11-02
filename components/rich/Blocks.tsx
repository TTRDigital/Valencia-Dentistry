import type { ReactNode } from "react";
import { site } from "@/lib/site";
import type { SiteImage, Testimonial } from "@/lib/types";
import { CountUp } from "@/components/motion/CountUp";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { MARK } from "@/components/layout/logo-paths";
import { PhotoFrame } from "./PhotoFrame";

/** The logo's V-and-tooth mark as a large, faint background watermark. */
export function Watermark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox={`0 0 ${MARK.width} ${MARK.height}`} aria-hidden="true" focusable="false" className={cn("pointer-events-none absolute -z-10 select-none", light ? "text-white/[0.05]" : "text-ink-900/[0.035]", className)}>
      <path fill="currentColor" d={MARK.v} />
      <path fill="currentColor" d={MARK.tooth} />
    </svg>
  );
}

/** Practice facts as a band of large numbers (count up once in view) with a short label each. */
export function StatBand({ dark, className }: { dark?: boolean; className?: string }) {
  const items: { value: ReactNode; label: string; icon: ReactNode }[] = [
    { value: <><CountUp value={site.rating.value} decimals={1} /><Icon.star className="ml-1.5 inline h-6 w-6 -translate-y-1 text-amber-400" /></>, label: "Google rating", icon: <Icon.google className="h-5 w-5" /> },
    { value: <CountUp value={site.rating.count} />, label: "Google reviews from local patients", icon: <Icon.heart className="h-5 w-5" /> },
    { value: <CountUp value={59} prefix="$" />, label: "New patient exam & X-rays", icon: <Icon.tag className="h-5 w-5" /> },
    { value: "PPO", label: "Most PPO plans accepted, benefits checked for you", icon: <Icon.shield className="h-5 w-5" /> },
  ];
  return (
    <dl data-stagger className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-lg lg:grid-cols-4", dark ? "bg-white/10" : "bg-ink-900/10", className)}>
      {items.map((it) => (
        <Reveal key={it.label} className={cn("flex flex-col-reverse justify-end gap-2 p-5 sm:p-7", dark ? "bg-ink-900" : "bg-white")}>
          <dt className={cn("flex items-start gap-2 text-sm sm:text-base", dark ? "text-white/75" : "text-grey-700")}><span className={cn("mt-0.5 shrink-0", dark ? "text-bronze-300" : "text-olive-600")}>{it.icon}</span>{it.label}</dt>
          <dd className={cn("font-display text-4xl font-semibold sm:text-5xl", dark ? "text-white" : "text-ink-900")}>{it.value}</dd>
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

/** Closing call to action with a photo, the $59 offer, booking, phone and hours. */
export function CtaBanner({ heading, text, image, buttonLabel = "Book a consultation", className }: { heading: string; text: string; image?: SiteImage; buttonLabel?: string; className?: string }) {
  return (
    <div className={cn("on-dark relative isolate overflow-hidden rounded-lg bg-ink-900 text-white", className)}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(91,107,90,0.55),transparent_55%)]" />
      <Watermark light className="-bottom-16 -right-10 h-72 w-72" />
      <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-bronze-300 ring-1 ring-white/15"><Icon.tag className="h-4 w-4" /> {site.offer.headline}: {site.offer.detail}</p>
          <h2 className="mt-5 text-4xl text-white">{heading}</h2>
          <p className="mt-4 max-w-xl text-lg text-white/80">{text}</p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <Button href={site.bookingUrl} size="lg" arrow>{buttonLabel}</Button>
            <Button href={`tel:${site.phone.tel}`} variant="outline" size="lg" external={false}><Icon.phone className="h-4 w-4" /> {site.phone.display}</Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
            <li className="flex items-center gap-2"><Icon.clock className="h-4 w-4 text-bronze-300" /> {site.hours[0].days}, {site.hours[0].label}</li>
            <li className="flex items-center gap-2"><Icon.pin className="h-4 w-4 text-bronze-300" /> {site.address.street}, {site.address.city}</li>
            <li className="flex items-center gap-2"><Icon.shield className="h-4 w-4 text-bronze-300" /> Most PPO plans accepted</li>
          </ul>
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
