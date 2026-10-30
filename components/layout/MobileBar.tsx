import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";

/** Sticky bottom bar on phones: Call / Book / Directions (≥44px targets). */
export function MobileBar() {
  const items = [
    { label: "Call", href: `tel:${site.phone.tel}`, I: Icon.phone, external: false },
    { label: "Book", href: site.bookingUrl, I: Icon.calendar, external: true, primary: true },
    { label: "Directions", href: site.directionsUrl, I: Icon.directions, external: true },
  ];
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <ul className="grid grid-cols-3">
        {items.map(({ label, href, I, external, primary }) => (
          <li key={label} className={primary ? "px-2 py-2" : "py-2"}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={primary ? "btn btn-primary w-full min-h-12" : "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[0.75rem] font-semibold text-navy-900"}
            >
              <I className={primary ? "h-4 w-4" : "h-5 w-5 text-steel-600"} />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
