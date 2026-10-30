import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NextRequest } from "next/server";

/**
 * Generated 1200x630 Open Graph image: /og/?title=…&subtitle=…
 * Navy background with the brand mark, the page title in Fraunces and the
 * practice name. Cached immutably by the CDN.
 */
export const runtime = "nodejs";

let fontCache: Promise<ArrayBuffer> | null = null;
const font = () => (fontCache ??= readFile(join(process.cwd(), "app/fonts/Fraunces-500.ttf")).then((b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer));

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const title = (sp.get("title") || "Valencia Smile Expert").slice(0, 110);
  const subtitle = (sp.get("subtitle") || "Holistic dentistry in Valencia, Santa Clarita · (661) 254-5200").slice(0, 120);
  const big = title.length < 40;
  let fonts: { name: string; data: ArrayBuffer; weight: 500; style: "normal" }[] = [];
  try {
    fonts = [{ name: "Fraunces", data: await font(), weight: 500, style: "normal" }];
  } catch {
    fonts = [];
  }
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #112740 0%, #17324f 60%, #2b557e 100%)", color: "white", fontFamily: fonts.length ? "Fraunces" : "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="34" height="34" viewBox="0 0 40 40"><path d="M13 11.5c-2.6 0-4.3 2-4.3 4.6 0 2 1 3.3 1.4 5.2.5 2.6.8 8.2 2.6 8.2 1.5 0 1.6-3.9 2.5-5.4.5-.8 1-1 2-1s1.5.2 2 1c.9 1.5 1 5.4 2.5 5.4 1.8 0 2.1-5.6 2.6-8.2.4-1.9 1.4-3.2 1.4-5.2 0-2.6-1.7-4.6-4.3-4.6-2 0-3 1-4.5 1s-2.5-1-4.5-1z" fill="#dcc8a4" /></svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, letterSpacing: 1 }}>Valencia</div>
            <div style={{ fontSize: 14, letterSpacing: 6, color: "#dcc8a4", textTransform: "uppercase" }}>Smile Expert</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: big ? 76 : 58, lineHeight: 1.06, letterSpacing: -1, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif" }}>{subtitle}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
