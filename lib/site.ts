/**
 * Practice facts (address, phone, hours and rating verified against the live site on 2026-10-29; the dentist changed to Dr. Nuriel Lavi on the client's instruction, bio details pending). These are
 * the built-in defaults; the Sanity "Site settings" document overrides them
 * when the CMS is connected (see lib/content/settings.ts).
 */
// Default domain from the Valencia Dentistry stationery; set NEXT_PUBLIC_SITE_URL in Vercel to override (e.g. while the old domain is still live).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://valenciadentistryca.com").replace(/\/$/, "");

export const site = {
  name: "Valencia Dentistry",
  legalName: "Valencia Dentistry",
  tagline: "Comfortable, holistic dentistry in Valencia, Santa Clarita",
  doctor: { name: "Dr. Nuriel Lavi, DDS", shortName: "Dr. Lavi", firstName: "Nuriel", lastName: "Lavi", credentials: "DDS", jobTitle: "Dentist", school: "", gradYear: 0 },
  phone: { display: "(661) 254-5200", tel: "+16612545200" },
  /** Texting goes to the office line (the same number the live site lists) */
  sms: "sms:+16612545200",
  email: "ValenciaDentistryCA@gmail.com", // from the business card; replace with a domain mailbox when one exists
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
  newPatients: { headline: "New patients welcome", detail: "Your first visit includes a comprehensive exam and digital X-rays" },
  offer: { name: "Free Invisalign consultation", href: "/new-patient-offer/" },
  rating: { value: 4.9, count: 180, source: "Google" },
  social: {
    facebook: "https://www.facebook.com/iHeartDDS1/",
    instagram: "https://www.instagram.com/Valenciasmileexpert/",
    linkedin: "https://www.linkedin.com/in/iHeartDDS1",
    x: "https://x.com/iHeartDDS1",
  },
  areas: ["Valencia", "Santa Clarita", "Stevenson Ranch", "Saugus", "Newhall", "Castaic", "Canyon Country"],
  /** From the onboarding form: what is new under Dr. Lavi */
  news: "New: an extra full clinical day on Wednesdays with Dr. Lavi, now open for new patients and treatment, and new digital new-patient and intake forms.",
  payment: "Cash and most PPO plans accepted",
  insurers: [
    { name: "Delta Dental", logo: "/images/insurance/delta-dental.png", w: 426, h: 88 },
    { name: "MetLife", logo: "/images/insurance/metlife.png", w: 293, h: 70 },
    { name: "Cigna", logo: "/images/insurance/cigna.png", w: 253, h: 96 },
    { name: "Aetna", logo: "/images/insurance/aetna.png", w: 312, h: 60 },
    { name: "United Concordia", logo: "/images/insurance/united-concordia.png", w: 380, h: 82 },
    { name: "Blue Cross Blue Shield", logo: "/images/insurance/blue-cross-blue-shield.png", w: 167, h: 98 },
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
