/**
 * 301 redirects. All 56 live URLs are kept identical, so this list only covers
 * the alternative addresses the live site itself redirects (collected by
 * probing ~2,900 old and alternative URLs on 2026-10-29) plus a few obvious
 * variants, each pointing straight at the final page (no chains).
 * Trailing-slash variants are answered by Next.js itself (trailingSlash: true).
 */
type Row = { source: string; destination: string };

const rows: Row[] = [
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/post-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/index.php", destination: "/" },
  { source: "/index.html", destination: "/" },
  { source: "/home", destination: "/" },
  { source: "/author/:slug*", destination: "/category/blogs/" },
  { source: "/blog", destination: "/category/blogs/" },
  { source: "/blogs", destination: "/category/blogs/" },
  { source: "/category/blog", destination: "/category/blogs/" },
  { source: "/dental-implants", destination: "/services/dental-implants/" },
  { source: "/about-us", destination: "/about/" },
  { source: "/our-practice", destination: "/about/" },
  { source: "/contact-us", destination: "/contact/" },
  { source: "/book", destination: "/appointment/" },
  { source: "/book-now", destination: "/appointment/" },
  { source: "/reviews", destination: "/testimonials/" },
  { source: "/privacy", destination: "/privacy-policy/" },
  { source: "/terms", destination: "/terms-and-services/" },
  { source: "/terms-of-service", destination: "/terms-and-services/" },
  { source: "/services/tmj-treatments", destination: "/tmj-treatments/" },
  { source: "/services/tmj", destination: "/tmj-treatments/" },
  { source: "/services/dental-bridges", destination: "/services/restorative-dentistry/dental-bridges/" },
  { source: "/services/veneers", destination: "/services/cosmetic-dentistry/veneers/" },
  { source: "/services/invisalign", destination: "/services/cosmetic-dentistry/invisalign/" },
  { source: "/services/teeth-whitening", destination: "/services/cosmetic-dentistry/teeth-whitening/" },
  { source: "/services/composite-filling", destination: "/services/cosmetic-dentistry/composite-filling/" },
  { source: "/services/all-on-4-implants", destination: "/services/oral-surgery/all-on-4-implants/" },
  { source: "/services/bone-grafting", destination: "/services/oral-surgery/bone-grafting/" },
  { source: "/services/tooth-extractions", destination: "/services/oral-surgery/tooth-extractions/" },
  { source: "/services/wisdom-teeth-removal", destination: "/services/oral-surgery/wisdom-teeth-removal/" },
  // Every page's /feed/ and /page/N/ variants (WordPress leftovers) go to the page.
  { source: "/:path*/feed", destination: "/:path*/" },
  { source: "/category/blogs/page/1", destination: "/category/blogs/" },
];

export const redirects = rows.flatMap((r) => {
  const src = r.source.replace(/\/$/, "");
  // next.config `trailingSlash: true` makes "/foo" match both "/foo" and "/foo/".
  return [{ source: src, destination: r.destination, permanent: true as const }];
});
