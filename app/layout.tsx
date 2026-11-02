import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/layout/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBar } from "@/components/layout/MobileBar";
import { ScrollToTop } from "@/components/motion/ScrollToTop";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { getNavigation, getPosts } from "@/lib/content";
import { urbanist } from "@/lib/fonts";
import { SITE_URL, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} | Dentist in Valencia, Santa Clarita`, template: `%s | ${site.name}` },
  description: site.tagline,
  applicationName: site.name,
  formatDetection: { telephone: false },
  manifest: "/site.webmanifest",
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon-32.png", sizes: "32x32", type: "image/png" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }], apple: "/apple-touch-icon.png" },
  openGraph: { siteName: site.name, locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#1c1c1c", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [nav, posts] = await Promise.all([getNavigation(), getPosts()]);
  return (
    <html lang="en" className={urbanist.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Marks that JavaScript runs, before first paint, so JS-only motion states never flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-white">Skip to content</a>
        <Header nav={nav} postPaths={posts.map((p) => p.path)} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">{children}</main>
        <Footer nav={nav} />
        <MobileBar />
        <RevealObserver />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
