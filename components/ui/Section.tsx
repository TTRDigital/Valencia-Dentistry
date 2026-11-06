import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("container-x", className)}>{children}</div>;
}

export function Section({ children, className, dark, tight, id, as: Tag = "section", ariaLabelledby }: { children: ReactNode; className?: string; dark?: boolean; tight?: boolean; id?: string; as?: "section" | "div" | "header" | "footer"; ariaLabelledby?: string }) {
  return (
    <Tag id={id} aria-labelledby={ariaLabelledby} className={cn(tight ? "section-tight" : "section", dark && "dark-section", className)}>
      {children}
    </Tag>
  );
}

/** Eyebrow → heading → lead, the rhythm used by every section. */
export function SectionHeading({ eyebrow, heading, lead, align = "left", as: Tag = "h2", id, className }: { eyebrow?: string; heading: ReactNode; lead?: ReactNode; align?: "left" | "center"; as?: "h1" | "h2" | "h3"; id?: string; className?: string }) {
  return (
    <div data-reveal="" className={cn("max-w-[46rem]", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", align === "center" && "justify-center")}>{eyebrow}</p>}
      <Tag id={id}>{heading}</Tag>
      {lead && <p className={cn("lead mt-5", align === "center" && "mx-auto")}>{lead}</p>}
    </div>
  );
}
