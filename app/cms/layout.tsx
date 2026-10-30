/** Root layout for the embedded Sanity Studio (no site header/footer). */
export const metadata = { title: "Valencia Dentistry CMS", robots: { index: false, follow: false } };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh" }}>{children}</div>;
}
