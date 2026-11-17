import type { SiteImage } from "./types";

/**
 * The client's own photos (Valencia Dentistry / Dr. Nuriel Lavi), IDs 01-10 from the image brief.
 * Alt text as given in the brief. Before/after photos (03, 04, 06, 08) are real patients: use them only on
 * cosmetic, veneer and gallery pages, never cropped, and never put 06 and 08 (same patient) on one page.
 */
const p = (file: string, alt: string, focus?: string): SiteImage => ({ src: `/images/client/${file}`, alt, ...(focus ? { focus } : {}) });

export const CLIENT = {
  /** 01 */ reception: p("01-reception-logo-wall.jpg", "Valencia Dentistry reception area with illuminated logo wall and modern seating"),
  /** 02 */ drCandid: p("02-dr-lavi-seated-candid.jpg", "Dr. Nuriel Lavi, DDS, smiling in the Valencia Dentistry office"),
  /** 03 */ baBonding: p("03-before-after-smile-bonding.jpg", "Before and after cosmetic smile correction at Valencia Dentistry"),
  /** 04 */ baPrepless: p("04-before-after-prepless-veneer.jpg", "Before and after a single prepless porcelain veneer, side view"),
  /** 05 */ drLoupes: p("05-dr-lavi-headshot-loupes.jpg", "Dr. Nuriel Lavi, DDS, wearing dental loupes"),
  /** 06 */ baVeneersCollage: p("06-before-after-veneers-collage.jpg", "Before and after full upper porcelain veneers, front and angled views"),
  /** 07 */ drHeadshot: p("07-dr-lavi-headshot.jpg", "Dr. Nuriel Lavi, DDS, dentist at Valencia Dentistry"),
  /** 08 */ baVeneersFront: p("08-before-after-veneers-front.jpg", "Before and after full upper veneers, front view"),
  /** 09 */ treatmentRoom: p("09-treatment-room.jpg", "Bright treatment room at Valencia Dentistry with dental chair and windows", "center 68%"),
  /** 10 */ hallway: p("10-hallway-front-desk.jpg", "Valencia Dentistry hallway and front desk", "center 62%"),
} as const;

/** The before/after photo a treatment page may show (top = before, bottom = after), by service slug. */
export const SERVICE_BEFORE_AFTER: Record<string, SiteImage> = {
  veneers: CLIENT.baVeneersFront,
  "cosmetic-dentistry": CLIENT.baBonding,
};
