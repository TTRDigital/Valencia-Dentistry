import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "light" | "outline";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  href?: string;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children"> & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ href, variant = "primary", size = "md", arrow, className, children, external, ...rest }: Props) {
  const cls = cn("btn", `btn-${variant}`, sizes[size], className);
  const inner = (
    <>
      {children}
      {arrow && <ArrowIcon />}
    </>
  );
  if (href) {
    const http = /^https?:\/\//.test(href);
    const internal = href.startsWith("/") || href.startsWith("#");
    if (!internal) {
      const blank = external ?? http;
      return <a href={href} className={cls} {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...(rest as ComponentProps<"a">)}>{inner}</a>;
    }
    return <Link href={href} className={cls} {...(rest as ComponentProps<"a">)}>{inner}</Link>;
  }
  return <button type="button" className={cls} {...(rest as ComponentProps<"button">)}>{inner}</button>;
}
