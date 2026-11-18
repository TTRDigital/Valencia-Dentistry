import type { SiteImage } from "./types";

/**
 * The practice's own photos (Valencia Dentistry / Dr. Nuriel Lavi), IDs 01-10 from the image brief.
 * This file is the single list: components and scripts take their photos from here.
 *
 * - Alt text is the brief's.
 * - `focus` is where cover crops centre (object-position), so wide frames show the chair rather
 *   than the ceiling and faces are never cut. Picture applies it to any image with this src.
 * - Before/after photos (03, 04, 06, 08) are real patients: only on cosmetic, veneer and gallery
 *   pages, always shown whole, and 06 and 08 (same patient) never on the same page.
 * - 02 is a small file (667px wide): use it only in small frames.
 */
const p = (file: string, alt: string, focus?: string): SiteImage => ({ src: `/images/client/${file}`, alt, ...(focus ? { focus } : {}) });

export const CLIENT = {
  /** 01 */ reception: p("01-reception-logo-wall.jpg", "Valencia Dentistry reception area with illuminated logo wall and modern seating", "center 45%"),
  /** 02 */ drCandid: p("02-dr-lavi-seated-candid.jpg", "Dr. Nuriel Lavi, DDS, smiling in the Valencia Dentistry office", "center 30%"),
  /** 03 */ baBonding: p("03-before-after-smile-bonding.jpg", "Before and after cosmetic smile correction at Valencia Dentistry"),
  /** 04 */ baPrepless: p("04-before-after-prepless-veneer.jpg", "Before and after a single prepless porcelain veneer, side view"),
  /** 05 */ drLoupes: p("05-dr-lavi-headshot-loupes.jpg", "Dr. Nuriel Lavi, DDS, wearing dental loupes", "center 32%"),
  /** 06 */ baVeneersCollage: p("06-before-after-veneers-collage.jpg", "Before and after full upper porcelain veneers, front and angled views"),
  /** 07 */ drHeadshot: p("07-dr-lavi-headshot.jpg", "Dr. Nuriel Lavi, DDS, dentist at Valencia Dentistry", "center 35%"),
  /** 08 */ baVeneersFront: p("08-before-after-veneers-front.jpg", "Before and after full upper veneers, front view"),
  /** 09 */ treatmentRoom: p("09-treatment-room.jpg", "Bright treatment room at Valencia Dentistry with dental chair and windows", "center 68%"),
  /** 11 */ treatmentRoomDoors: p("11-treatment-rooms-doors.jpg", "Two treatment rooms at Valencia Dentistry seen through their doorways", "center 55%"),
} as const;

/** The two room photos (the hallway photo 10 is no longer used: client feedback, it shows mostly floor). */
export const ROOMS = [CLIENT.treatmentRoom, CLIENT.treatmentRoomDoors] as const;

/**
 * Photos for cards (service cards, card grids): rooms and the doctor, no before/after, and not 02
 * (too small for these frames). Pickers take them in this order and never put the same one twice in a row.
 */
export const CARD_PHOTOS: SiteImage[] = [CLIENT.treatmentRoom, CLIENT.treatmentRoomDoors, CLIENT.reception, CLIENT.drHeadshot, CLIENT.drLoupes];

/** The real before/after case a treatment page shows beside its "Benefits & care" list (top = before). */
export const SERVICE_BEFORE_AFTER: Record<string, SiteImage> = {
  veneers: CLIENT.baVeneersFront,
  "cosmetic-dentistry": CLIENT.baBonding,
};
