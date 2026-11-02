// Builds the static map shown before (or instead of) the Google Maps embed.
//   node --experimental-strip-types scripts/static-map.ts
// Tiles: © OpenStreetMap contributors (ODbL); the page shows that credit on the image.
// Fetched once at build-author time (a few dozen tiles), then tinted to the brand palette.
import sharp from "sharp";

const LAT = 34.42157, LON = -118.57816; // 27420 Tourney Rd (OSM building way 472622281)
const Z = 17, W = 1600, H = 1200;
const n = 2 ** Z;
const px = ((LON + 180) / 360) * n * 256;
const py = ((1 - Math.log(Math.tan((LAT * Math.PI) / 180) + 1 / Math.cos((LAT * Math.PI) / 180)) / Math.PI) / 2) * n * 256;
const left = px - W / 2, top = py - H / 2;
const tx0 = Math.floor(left / 256), ty0 = Math.floor(top / 256), tx1 = Math.floor((left + W) / 256), ty1 = Math.floor((top + H) / 256);
const tiles: { input: Buffer; left: number; top: number }[] = [];
for (let x = tx0; x <= tx1; x++) for (let y = ty0; y <= ty1; y++) {
  const res = await fetch(`https://tile.openstreetmap.org/${Z}/${x}/${y}.png`, { headers: { "User-Agent": "ValenciaDentistrySite/1.0 (one-off static map build)" } });
  if (!res.ok) throw new Error(`tile ${x},${y}: ${res.status}`);
  tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: x * 256 - Math.floor(left) - 0, top: y * 256 - Math.floor(top) });
  await new Promise((r) => setTimeout(r, 120));
}
const canvasW = (tx1 - tx0 + 1) * 256, canvasH = (ty1 - ty0 + 1) * 256;
const offX = Math.floor(left) - tx0 * 256, offY = Math.floor(top) - ty0 * 256;
const mosaic = await sharp({ create: { width: canvasW, height: canvasH, channels: 3, background: "#f0eee8" } })
  .composite(tiles.map((t) => ({ ...t, left: t.left + offX, top: t.top + offY })))
  .png().toBuffer();
// Desaturate and warm it so it sits with the cream/olive palette; the pin is drawn in HTML on top.
const tinted = await sharp(mosaic).extract({ left: offX, top: offY, width: W, height: H })
  .modulate({ saturation: 0.25, brightness: 1.04 })
  .tint({ r: 240, g: 236, b: 226 })
  .toBuffer();
for (const w of [800, 1600]) await sharp(tinted).resize(w).webp({ quality: 78 }).toFile(`public/images/map/office-map-${w}.webp`);
console.log(`map: ${tiles.length} tiles, centre at ${W / 2},${H / 2}`);
