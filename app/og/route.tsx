import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NextRequest } from "next/server";
import { MARK, WORD } from "@/components/layout/logo-paths";

/**
 * Generated 1200x630 Open Graph image: /og/?title=…&subtitle=…
 * Charcoal background with the brand mark and wordmark, the page title in
 * Fraunces. Cached immutably by the CDN.
 */
export const runtime = "nodejs";

let fontCache: Promise<ArrayBuffer> | null = null;
const font = () => (fontCache ??= readFile(join(process.cwd(), "app/fonts/Fraunces-500.ttf")).then((b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer));

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const title = (sp.get("title") || "Valencia Dentistry").slice(0, 110);
  const subtitle = (sp.get("subtitle") || "Valencia Dentistry · Santa Clarita, CA · (661) 254-5200").slice(0, 120);
  const big = title.length < 40;
  let fonts: { name: string; data: ArrayBuffer; weight: 500; style: "normal" }[] = [];
  try {
    fonts = [{ name: "Fraunces", data: await font(), weight: 500, style: "normal" }];
  } catch {
    fonts = [];
  }
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #1f1f1f 0%, #2e2e2e 55%, #3d4a3c 100%)", color: "white", fontFamily: fonts.length ? "Fraunces" : "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="72" height="60" viewBox={`0 0 ${MARK.width} ${MARK.height}`}><path fill="#FFFFFF" d={MARK.v} /><path fill="#C9BA9C" d={MARK.tooth} /></svg>
          <svg width="200" height="40" viewBox={`0 0 ${WORD.width} ${WORD.height}`}><path fill="#FFFFFF" d={WORD.valencia} /><path fill="#C9BA9C" d={WORD.dentistry} /></svg>
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
