/**
 * Favicon set rendered from the placeholder brand mark (components/layout/Logo.tsx).
 * Re-run after the final SVG logo arrives: put it at public/logo.svg and run
 *   npm run favicons
 * (the script uses public/logo.svg when it exists, otherwise the placeholder mark).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const custom = join(ROOT, "public/logo.svg");
const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#112740"/><path d="M13 11.5c-2.6 0-4.3 2-4.3 4.6 0 2 1 3.3 1.4 5.2.5 2.6.8 8.2 2.6 8.2 1.5 0 1.6-3.9 2.5-5.4.5-.8 1-1 2-1s1.5.2 2 1c.9 1.5 1 5.4 2.5 5.4 1.8 0 2.1-5.6 2.6-8.2.4-1.9 1.4-3.2 1.4-5.2 0-2.6-1.7-4.6-4.3-4.6-2 0-3 1-4.5 1s-2.5-1-4.5-1z" fill="#dcc8a4"/></svg>`;
const svg = existsSync(custom) ? readFileSync(custom) : Buffer.from(placeholder);

async function png(size: number, pad = 0) {
  const inner = Math.round(size * (1 - 2 * pad));
  const mark = await sharp(svg, { density: 600 }).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: mark, gravity: "center" }]).png().toBuffer();
}
const out = (f: string, b: Buffer) => writeFileSync(join(ROOT, "public", f), b);
out("icon-32.png", await png(32));
out("icon-192.png", await png(192));
out("icon-512.png", await png(512));
out("apple-touch-icon.png", await png(180, 0.06));
out("icon.svg", svg);

const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => png(s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => { const e = 6 + 16 * i; header.writeUInt8(s, e); header.writeUInt8(s, e + 1); header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6); header.writeUInt32LE(pngs[i].length, e + 8); header.writeUInt32LE(offset, e + 12); offset += pngs[i].length; });
out("favicon.ico", Buffer.concat([header, ...pngs]));
out("site.webmanifest", Buffer.from(JSON.stringify({ name: "Valencia Smile Expert", short_name: "Valencia Smile", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }], theme_color: "#112740", background_color: "#fdfbf7", display: "browser", start_url: "/" }, null, 2)));
console.log("favicons written to public/");
