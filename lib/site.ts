/**
 * Practice facts (verified against the live site on 2026-10-29). These are
 * the built-in defaults; the Sanity "Site settings" document overrides them
 * when the CMS is connected (see lib/content/settings.ts).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.valenciasmileexpert.com").replace(/\/$/, "");

export const site = {
  name: "Valencia Smile Expert",
  legalName: "Valencia Smile Expert",
  tagline: "Comfortable, holistic dentistry in Valencia, Santa Clarita",
  doctor: { name: "Dr. Neda Moezzi, DDS", shortName: "Dr. Moezzi", firstName: "Neda", lastName: "Moezzi", credentials: "DDS", jobTitle: "Dentist", school: "University of Detroit Mercy Dental School", gradYear: 2010 },
  phone: { display: "(661) 254-5200", tel: "+16612545200" },
  email: "info@valenciasmileexpert.com",
  address: { street: "27420 Tourney Rd, Suite 240", city: "Santa Clarita", neighborhood: "Valencia", state: "CA", zip: "91355", country: "US" },
  geo: { lat: 34.421619, lng: -118.5780025 },
  mapsUrl: "https://maps.app.goo.gl/zf8fsL8TG72B2QZh9",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=27420+Tourney+Rd+Suite+240,+Santa+Clarita,+CA+91355",
  mapEmbedUrl: "https://www.google.com/maps?q=27420+Tourney+Rd+Suite+240,+Santa+Clarita,+CA+91355&output=embed",
  bookingUrl: "https://book2.getweave.com/657e8080-2ad9-44fa-8cfb-2c06a59cd7a7/request-appointment?source=WEBSITE",
  hours: [
    { days: "Monday – Friday", open: "08:00", close: "17:00", label: "8am – 5pm" },
    { days: "Saturday & Sunday", open: null, close: null, label: "Closed" },
  ],
  /** 0 = Sunday … 6 = Saturday; open ranges in minutes, local time (America/Los_Angeles) */
  weekHours: { 1: [480, 1020], 2: [480, 1020], 3: [480, 1020], 4: [480, 1020], 5: [480, 1020] } as Record<number, [number, number]>,
  timeZone: "America/Los_Angeles",
  offer: { headline: "New Patient Special", detail: "$59 exam & X-rays", short: "$59 new patient exam & X-rays" },
  rating: { value: 4.9, count: 180, source: "Google" },
  social: {
    facebook: "https://www.facebook.com/iHeartDDS1/",
    instagram: "https://www.instagram.com/Valenciasmileexpert/",
    linkedin: "https://www.linkedin.com/in/iHeartDDS1",
    x: "https://x.com/iHeartDDS1",
  },
  areas: ["Valencia", "Santa Clarita", "Stevenson Ranch", "Newhall", "Saugus", "Canyon Country"],
  insurers: [
    { name: "Delta Dental", logo: "/images/insurance/delta-dental.png", w: 426, h: 88 },
    { name: "MetLife", logo: "/images/insurance/metlife.png", w: 459, h: 258 },
    { name: "Cigna", logo: "/images/insurance/cigna.png", w: 253, h: 143 },
    { name: "Aetna", logo: "/images/insurance/aetna.png", w: 312, h: 60 },
    { name: "United Concordia", logo: "/images/insurance/united-concordia.png", w: 380, h: 82 },
    { name: "Blue Cross Blue Shield", logo: "/images/insurance/blue-cross-blue-shield.png", w: 298, h: 98 },
    { name: "Principal", logo: "/images/insurance/principal.png", w: 360, h: 105 },
    { name: "Humana", logo: "/images/insurance/humana.png", w: 378, h: 81 },
  ],
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PPV3TDK8",
  priceRange: "$$",
} as const;

export type Site = typeof site;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}
