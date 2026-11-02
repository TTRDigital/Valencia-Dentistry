/**
 * Builds content/services/<slug>.json from the original Valencia Smile Expert
 * service pages (the crawl's extracted markdown), keeping the live site's
 * wording, with the dentist's name updated, in the Ideal Dental Solutions
 * page structure. Photos are real photographs only (public/images/real):
 * hero, understanding, three why-choose cards and the candidate banner.
 *
 *   node --experimental-strip-types scripts/build-services.ts <crawl-dir>
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { inSentence } from "../lib/utils.ts";

const CRAWL = process.argv[2];
const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "content/services");

type Card = { title: string; text: string; image?: { src: string; alt: string } };
type Sec = { heading: string; level: number; paragraphs: string[]; bullets: string[]; cards: Card[] };

const SERVICES: { slug: string; path: string; parent: string; category: string; name: string; file: string; related: string[]; img: string[] }[] = [
  { slug: "cosmetic-dentistry", path: "/services/cosmetic-dentistry/", parent: "/services/", category: "cosmetic", name: "Cosmetic Dentistry", file: "services__cosmetic-dentistry", related: ["veneers", "teeth-whitening", "invisalign", "composite-filling"], img: ["/images/real/smile-plan-6.jpg", "/images/real/veneer-tryin.jpg", "/images/real/smile-design.jpg", "/images/real/mirror-smile-3.jpg", "/images/real/veneer-mirror.jpg", "/images/real/veneer-smile-2.jpg"] },
  { slug: "composite-filling", path: "/services/cosmetic-dentistry/composite-filling/", parent: "/services/cosmetic-dentistry/", category: "cosmetic", name: "Composite Fillings", file: "services__cosmetic-dentistry__composite-filling", related: ["dental-crowns", "cosmetic-dentistry", "holistic-dentistry"], img: ["/images/real/scan-doctor.jpg", "/images/real/cleaning.jpg", "/images/real/scan-closeup.jpg", "/images/real/shade-match.jpg", "/images/real/scan-intraoral.jpg", "/images/real/scan-intraoral.jpg"] },
  { slug: "invisalign", path: "/services/cosmetic-dentistry/invisalign/", parent: "/services/cosmetic-dentistry/", category: "cosmetic", name: "Invisalign", file: "services__cosmetic-dentistry__invisalign", related: ["veneers", "teeth-whitening", "cosmetic-dentistry"], img: ["/images/real/aligner-patient-2.jpg", "/images/real/aligner-patient.jpg", "/images/real/aligner-model.jpg", "/images/real/scan-intraoral-2.jpg", "/images/real/smile-plan-2.jpg", "/images/real/veneer-smile.jpg"] },
  { slug: "teeth-whitening", path: "/services/cosmetic-dentistry/teeth-whitening/", parent: "/services/cosmetic-dentistry/", category: "cosmetic", name: "Teeth Whitening", file: "services__cosmetic-dentistry__teeth-whitening", related: ["veneers", "cosmetic-dentistry", "invisalign"], img: ["/images/real/veneer-smile.jpg", "/images/real/veneer-mirror.jpg", "/images/real/mirror-smile-2.jpg", "/images/real/veneer-tryin.jpg", "/images/real/shade-match.jpg", "/images/real/veneer-tryin.jpg"] },
  { slug: "veneers", path: "/services/cosmetic-dentistry/veneers/", parent: "/services/cosmetic-dentistry/", category: "cosmetic", name: "Veneers", file: "services__cosmetic-dentistry__veneers", related: ["teeth-whitening", "cosmetic-dentistry", "dental-crowns"], img: ["/images/real/smile-plan-7.jpg", "/images/real/smile-design.jpg", "/images/real/smile-plan-4.jpg", "/images/real/smile-plan-5.jpg", "/images/real/veneer-consult.jpg", "/images/real/veneer-smile-2.jpg"] },
  { slug: "dental-crowns", path: "/services/dental-crowns/", parent: "/services/", category: "restorative", name: "Dental Crowns", file: "services__dental-crowns", related: ["dental-bridges", "dental-implants", "composite-filling"], img: ["/images/real/scan-review.jpg", "/images/real/scan-closeup.jpg", "/images/real/smile-plan.jpg", "/images/real/scan-doctor-2.jpg", "/images/real/shade-match.jpg", "/images/real/scan-intraoral-2.jpg"] },
  { slug: "dental-implants", path: "/services/dental-implants/", parent: "/services/", category: "restorative", name: "Dental Implants", file: "services__dental-implants", related: ["all-on-4-implants", "bone-grafting", "dental-bridges"], img: ["/images/real/implant-model-2.jpg", "/images/real/implant-model.jpg", "/images/real/implant-xray.jpg", "/images/real/implant-model-hands.jpg", "/images/real/implant-consult-chair.jpg", "/images/real/implant-model-hands.jpg"] },
  { slug: "holistic-dentistry", path: "/services/holistic-dentistry/", parent: "/services/", category: "holistic", name: "Holistic Dentistry", file: "services__holistic-dentistry", related: ["composite-filling", "cosmetic-dentistry", "tmj-treatments"], img: ["/images/real/consult-denture.jpg", "/images/real/consult-seated.jpg", "/images/real/mirror-view.jpg", "/images/real/tryin-smile.jpg", "/images/real/scan-hygienist.jpg", "/images/real/mirror-smile-2.jpg"] },
  { slug: "oral-surgery", path: "/services/oral-surgery/", parent: "/services/", category: "surgical", name: "Oral Surgery", file: "services__oral-surgery", related: ["tooth-extractions", "wisdom-teeth-removal", "bone-grafting", "all-on-4-implants"], img: ["/images/real/loupes.jpg", "/images/real/xray-pointing.jpg", "/images/real/consult-xray-model.jpg", "/images/real/implant-xray-2.jpg", "/images/real/xray-explain.jpg", "/images/real/treatment-room.jpg"] },
  { slug: "all-on-4-implants", path: "/services/oral-surgery/all-on-4-implants/", parent: "/services/oral-surgery/", category: "surgical", name: "All-on-4 Implants", file: "services__oral-surgery__all-on-4-implants", related: ["dental-implants", "bone-grafting", "oral-surgery"], img: ["/images/real/denture-consult.jpg", "/images/real/denture-closeup.jpg", "/images/real/xray-pointing-2.jpg", "/images/real/consult-seated.jpg", "/images/real/consult-denture.jpg", "/images/real/treatment-room-2.jpg"] },
  { slug: "bone-grafting", path: "/services/oral-surgery/bone-grafting/", parent: "/services/oral-surgery/", category: "surgical", name: "Bone Grafting", file: "services__oral-surgery__bone-grafting", related: ["dental-implants", "all-on-4-implants", "oral-surgery"], img: ["/images/real/xray-review-seated.jpg", "/images/real/implant-xray.jpg", "/images/real/xray-explain.jpg", "/images/real/consult-xray-model.jpg", "/images/real/loupes.jpg", "/images/real/treatment-room.jpg"] },
  { slug: "tooth-extractions", path: "/services/oral-surgery/tooth-extractions/", parent: "/services/oral-surgery/", category: "surgical", name: "Tooth Extractions", file: "services__oral-surgery__tooth-extractions", related: ["wisdom-teeth-removal", "dental-implants", "oral-surgery"], img: ["/images/real/xray-explain.jpg", "/images/real/loupes.jpg", "/images/real/consult-seated.jpg", "/images/real/xray-pointing.jpg", "/images/real/consult-denture.jpg", "/images/real/treatment-room-2.jpg"] },
  { slug: "wisdom-teeth-removal", path: "/services/oral-surgery/wisdom-teeth-removal/", parent: "/services/oral-surgery/", category: "surgical", name: "Wisdom Teeth Removal", file: "services__oral-surgery__wisdom-teeth-removal", related: ["tooth-extractions", "oral-surgery", "bone-grafting"], img: ["/images/real/xray-pointing.jpg", "/images/real/scan-review-2.jpg", "/images/real/implant-xray-2.jpg", "/images/real/loupes.jpg", "/images/real/xray-review-seated.jpg", "/images/real/mirror-smile-2.jpg"] },
  { slug: "restorative-dentistry", path: "/services/restorative-dentistry/", parent: "/services/", category: "restorative", name: "Restorative Dentistry", file: "services__restorative-dentistry", related: ["dental-crowns", "dental-bridges", "dental-implants", "composite-filling"], img: ["/images/real/implant-model-hands.jpg", "/images/real/scan-closeup.jpg", "/images/real/smile-plan-3.jpg", "/images/real/implant-model-2.jpg", "/images/real/scan-review.jpg", "/images/real/veneer-tryin.jpg"] },
  { slug: "dental-bridges", path: "/services/restorative-dentistry/dental-bridges/", parent: "/services/restorative-dentistry/", category: "restorative", name: "Dental Bridges", file: "services__restorative-dentistry__dental-bridges", related: ["dental-crowns", "dental-implants", "restorative-dentistry"], img: ["/images/real/implant-model.jpg", "/images/real/scan-review.jpg", "/images/real/smile-plan-3.jpg", "/images/real/implant-consult-chair.jpg", "/images/real/smile-plan-6.jpg", "/images/real/tryin-smile.jpg"] },
  { slug: "tmj-treatments", path: "/tmj-treatments/", parent: "/services/", category: "preventive", name: "TMJ Treatments", file: "tmj-treatments", related: ["holistic-dentistry", "dental-crowns", "oral-surgery"], img: ["/images/real/consult-seated-2.jpg", "/images/real/mirror-view.jpg", "/images/real/consult-denture.jpg", "/images/real/veneer-consult.jpg", "/images/real/scan-hygienist.jpg", "/images/real/veneer-smile.jpg"] },
];

const SHORT: Record<string, string> = {
  "cosmetic-dentistry": "Veneers, whitening, Invisalign and bonding for a smile that looks like you.",
  "composite-filling": "Tooth-colored, mercury-free fillings that blend in.",
  invisalign: "Clear aligners planned with digital scans, no brackets or wires.",
  "teeth-whitening": "Professional whitening in the office or at home.",
  veneers: "Thin porcelain shells that correct shape, color and gaps.",
  "dental-crowns": "Custom crowns, often designed and placed in one visit.",
  "dental-implants": "Permanent replacements for one tooth, several teeth or a full arch.",
  "holistic-dentistry": "Biocompatible materials and whole-body wellness.",
  "oral-surgery": "Extractions, grafting and implant surgery with comfort options.",
  "all-on-4-implants": "A full arch of fixed teeth on four implants.",
  "bone-grafting": "Rebuild jawbone so implants have a stable foundation.",
  "tooth-extractions": "Gentle removal when a tooth cannot be saved.",
  "wisdom-teeth-removal": "Planned with 3D imaging, with sedation options.",
  "restorative-dentistry": "Fillings, crowns, bridges and implants that repair and replace teeth.",
  "dental-bridges": "Fixed replacements for one or more missing teeth.",
  "tmj-treatments": "Relief for jaw pain, clicking and headaches.",
};

function fix(t: string) {
  return t
    .replace(/Dr\. Neda Moezzi, DDS/g, "Dr. Nuriel Lavi, DDS").replace(/Dr\. Neda Moezzi/g, "Dr. Nuriel Lavi").replace(/Neda Moezzi/g, "Nuriel Lavi").replace(/Dr\. Moezzi/g, "Dr. Lavi").replace(/Moezzi/g, "Lavi")
    .replace(/Valencia Smile Experts?/g, "Valencia Dentistry")
    .replace(/\bherself\b/g, "himself").replace(/\bshe\b/g, "he").replace(/\bShe\b/g, "He").replace(/\bher\b/g, "his").replace(/\bHer\b/g, "His")
    .replace(/\s+/g, " ").trim();
}

/** Parses the crawl markdown into ordered sections (heading + paragraphs + bullets + title/text cards + flattened tables). */
function parse(md: string) {
  const body = md.split("\n\n## JSON-LD")[0];
  const lines = body.split("\n");
  let h1 = "";
  let heroText = "";
  const secs: Sec[] = [];
  let cur: Sec | null = null;
  const faqs: { q: string; a: string }[] = [];
  let pendingQ: string | null = null;
  let pendingTitle: string | null = null;
  const push = () => { if (cur) secs.push(cur); };
  const shortLine = (l: string) => l.length < 60 && !/[.!?:]$/.test(l) && !/^\d/.test(l);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (/^(title|description|canonical|robots|og):/.test(line) && !cur && !h1) continue;
    if (/^# \//.test(line)) continue;
    if (/^!\[/.test(line) || /^\[CTA/.test(line)) { pendingTitle = null; continue; }
    const q = /^\*\*Q: (.*)\*\*$/.exec(line);
    if (q) { pendingQ = q[1]; continue; }
    if (pendingQ) { faqs.push({ q: fix(pendingQ), a: fix(line) }); pendingQ = null; continue; }
    const h = /^(#{1,3}) (.*)$/.exec(line);
    if (h) {
      if (h[1] === "#") { if (!h1) h1 = fix(h[2]); continue; }
      push(); cur = { heading: fix(h[2]), level: h[1].length, paragraphs: [], bullets: [], cards: [] }; pendingTitle = null; continue;
    }
    if (!cur) { if (!heroText) heroText = fix(line); continue; }
    if (/^- /.test(line)) { cur.bullets.push(fix(line.slice(2))); pendingTitle = null; continue; }
    const next = lines[i + 1] === "" ? (lines[i + 2] || "").trim() : (lines[i + 1] || "").trim();
    const nextIsText = next && !/^(#|-|!\[|\[CTA|\*\*Q)/.test(next) && next.length > 70;
    if (shortLine(line) && nextIsText && !/^(Rating|Contact Us|Office Hours)/.test(line)) { pendingTitle = fix(line.replace(/:$/, "")); continue; }
    if (pendingTitle) { cur.cards.push({ title: pendingTitle, text: fix(line) }); pendingTitle = null; continue; }
    if (shortLine(line) && (shortLine(next) || !next || /^#/.test(next))) { cur.bullets.push(fix(line)); continue; }
    cur.paragraphs.push(fix(line));
  }
  push();
  const drop = /reviews|patients are saying|love us|what our patients|visit valencia|schedule your|book your|contact us|office hours|testimonial|real results|smile transformations you can see|^(Jose C|Doug Chong|Tamarea Jaster|Kyle Figatner|Victoria Kersanty)$/i;
  // Merge short level-3 sections (one paragraph, no bullets) into the previous section as cards, and turn flattened tables into bullets.
  const merged: Sec[] = [];
  for (const s of secs) {
    if (drop.test(s.heading)) continue;
    const prev = merged[merged.length - 1];
    if (s.level === 3 && prev && s.paragraphs.length <= 2 && !s.bullets.length && !s.cards.length && s.paragraphs.length && (prev.cards.length || /options|treatments|tips|caring|types/i.test(prev.heading))) {
      prev.cards.push({ title: s.heading, text: s.paragraphs.join(" ") });
      continue;
    }
    if (s.bullets.length > 8 && s.bullets.filter((b) => b.length < 60).length >= s.bullets.length - 1) {
      // flattened comparison table; short leading paragraphs are the last rows the extractor split off
      const cells = [...s.bullets];
      while (s.paragraphs.length && s.paragraphs[0].length < 45) cells.push(s.paragraphs.shift()!);
      const cols = cells[0] === "Feature" ? 3 : cells.length % 3 === 0 ? 3 : 2;
      const rows: string[][] = [];
      for (let i = 0; i + cols <= cells.length; i += cols) rows.push(cells.slice(i, i + cols));
      (s as Sec & { table?: string[][] }).table = rows; s.bullets = [];
    }
    merged.push(s);
  }
  return { h1, heroText, secs: merged, faqs };
}

const img = (src: string, alt: string) => ({ src, alt });
for (const svc of SERVICES) {
  const md = readFileSync(join(CRAWL, "pages", `${svc.file}.md`), "utf8");
  const { h1, heroText, secs, faqs } = parse(md);
  type TSec = Sec & { table?: string[][] };
  const list = secs as TSec[];
  const bucket = (re: RegExp) => { const out: TSec[] = []; for (let i = list.length - 1; i >= 0; i--) if (re.test(list[i].heading)) out.unshift(...list.splice(i, 1)); return out; };
  const intro = list.length && !/what|why|process|candidate|benefit|option|types|how /i.test(list[0].heading) ? list.splice(0, 1) : [];
  const why = bucket(/why .*(choose|trust)|why patients|why us/i);
  const process = bucket(/process|what to expect|step-by-step|how to get started|how .* works|journey|procedure/i);
  const care = bucket(/pre-? ?and post|before (&|and) after .*(prepare|recover)|caring for|care tips|tips on caring|aftercare|recovery/i);
  const comparisons = bucket(/ vs\.? /i);
  const candidate = bucket(/candidate|signs you need|who (is|’s|'s) a good|who should|who needs|who might need|right for you|symptoms/i);
  const understanding = bucket(/what (is|are|exactly)|understanding|how is it different|treatments offered|treatment options|options at|types of|our .* (treatments|services)|services|materials|holistic .* options|important to remove/i);
  const benefits = bucket(/benefit/i);
  const existing = existsSync(join(OUT, `${svc.slug}.json`)) ? JSON.parse(readFileSync(join(OUT, `${svc.slug}.json`), "utf8")) : null;
  const cardsFrom = (ss: TSec[]) => ss.flatMap((x) => [...x.cards, ...x.bullets.filter((b) => /[:–-] /.test(b)).map((b) => { const [t, ...r] = b.split(/[:–-] /); return { title: t.trim(), text: r.join(" ").trim() }; })]);
  const plainBullets = (ss: TSec[]) => ss.flatMap((x) => x.bullets.filter((b) => !/[:–-] /.test(b)));
  const paras = (ss: TSec[]) => ss.flatMap((x) => x.paragraphs);
  const dedupe = <T,>(arr: T[]) => arr.filter((x, i, a) => a.findIndex((y) => JSON.stringify(y) === JSON.stringify(x)) === i);
  for (const sec of [...candidate, ...understanding, ...benefits, ...list]) { sec.bullets = dedupe(sec.bullets); sec.cards = dedupe(sec.cards); }
  const uItems = dedupe([...cardsFrom(understanding), ...cardsFrom(benefits)]);
  const uBullets = [...plainBullets(understanding)];
  let steps = cardsFrom(process);
  if (!steps.length) steps = process.flatMap((x) => x.bullets).map((b, i) => ({ title: `Step ${i + 1}`, text: b }));
  const candBullets = [...plainBullets(candidate), ...plainBullets(benefits)];
  const tables = list.concat(understanding, benefits, comparisons).flatMap((x) => (x.table ? [{ heading: x.heading, rows: x.table, text: x.paragraphs.join(" ") }] : []));
  list.push(...comparisons.filter((x) => !x.table));
  const doc = {
    slug: svc.slug, path: svc.path, parentPath: svc.parent, category: svc.category, name: svc.name,
    shortDescription: SHORT[svc.slug],
    seo: existing?.seo ?? { title: `${svc.name} in Santa Clarita | Valencia Dentistry`, description: heroText.slice(0, 152) },
    hero: { h1, subtitle: intro[0]?.heading || svc.name, text: heroText, image: img(svc.img[0], `${svc.name} at Valencia Dentistry`) },
    intro: { heading: intro[0]?.heading ?? `${svc.name} at Valencia Dentistry`, paragraphs: intro.length ? paras(intro) : paras(understanding).slice(0, 1) },
    understanding: { heading: understanding[0]?.heading ?? `What ${inSentence(svc.name)} is`, intro: paras(understanding).join(" ") || paras(benefits).join(" "), image: img(svc.img[1], `${svc.name}: treatment at Valencia Dentistry`), items: uItems, bullets: uBullets },
    why: { heading: why[0]?.heading ?? `Why choose Valencia Dentistry for ${inSentence(svc.name)}?`, intro: paras(why).join(" "), cards: cardsFrom(why).map((c, i) => ({ ...c, image: i < 3 ? img(svc.img[2 + i], `${svc.name} at Valencia Dentistry: ${c.title}`) : undefined })) },
    process: { heading: process[0]?.heading ?? `Our ${inSentence(svc.name)} process`, intro: paras(process).join(" "), steps },
    candidate: { heading: candidate[0]?.heading ?? `Are you a good candidate for ${inSentence(svc.name)}?`, text: paras(candidate).join(" "), bullets: candBullets, image: img(svc.img[5], "") },
    ...(care.length ? { care: { heading: care[0].heading, intro: paras(care).join(" ").replace(/\s*(Before|After) Your [^.:]*:?\s*(Before|After) Your [^.:]*:?\s*$/i, "").replace(/\s*(Before|After) Your [^.:]{0,60}:?\s*$/i, "").trim(), before: dedupe(care[0].bullets.slice(0, Math.ceil(care[0].bullets.length / 2))), after: dedupe([...care[0].bullets.slice(Math.ceil(care[0].bullets.length / 2)), ...care.slice(1).flatMap((x) => x.bullets)]), cards: cardsFrom(care) } } : {}),
    tables,
    extra: list.filter((x) => x.heading && (x.paragraphs.length || x.cards.length || x.bullets.length)).map((x) => ({ heading: x.heading, paragraphs: x.paragraphs, bullets: x.bullets, cards: x.cards })),
    faqs,
    related: svc.related,
    cta: { heading: `Talk with Dr. Lavi about ${inSentence(svc.name)}`, text: `Come in for a relaxed consultation in our Valencia office. Call (661) 254-5200 or book online.`, buttonLabel: "Book a consultation" },
    flags: existing?.flags ?? [],
  };
  console.log(svc.slug.padEnd(24), `intro=${doc.intro.paragraphs.length}`, `uItems=${uItems.length}/${uBullets.length}`, `why=${doc.why.cards.length}`, `steps=${steps.length}`, `cand=${candBullets.length}/${doc.candidate.text.length}`, `care=${care.length}`, `tables=${tables.length}`, `extra=${doc.extra.length}`, `faq=${faqs.length}`);
  writeFileSync(join(OUT, `${svc.slug}.json`), JSON.stringify(doc, null, 2) + "\n");
}
