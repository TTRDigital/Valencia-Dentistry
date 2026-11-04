/**
 * Which top-level navigation item a page belongs to, so the header can highlight it.
 * Blog posts live at the site root (/<slug>/), so their paths are passed in.
 */
export function navSectionFor(pathname: string, postPaths: readonly string[]): string | null {
  if (pathname.startsWith("/services/") || pathname === "/tmj-treatments/" || pathname === "/emergency-dental/") return "/services/";
  if (pathname === "/about/") return "/about/";
  if (pathname === "/new-patient-offer/" || pathname === "/appointment/") return "/new-patient-offer/";
  // Results & Reviews and the blog sit under About
  if (pathname === "/testimonials/") return "/about/";
  if (pathname.startsWith("/category/blogs/") || postPaths.includes(pathname)) return "/about/";
  if (pathname === "/contact/") return "/contact/";
  return null;
}
