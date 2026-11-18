import type { SiteImage } from "./types";

/**
 * Licensed stock photos (Pexels and Unsplash licences: free for commercial use, no attribution
 * required). Used where none of the practice's own photos shows the subject: technology,
 * treatments, smiles. Every file is in public/images/stock/; docs/photo-credits.md lists the source
 * page of each one.
 *
 * Rules: relevant to the section it sits in; no stock photo is presented as Dr. Lavi, his team,
 * his office or his patients' results (before/after stays the practice's own).
 * `focus` is the crop centre for cover frames (applied by Picture via lib/photoFocus.ts).
 */
export type StockPhoto = SiteImage & { source: "Pexels" | "Unsplash" | "Ideal Dental Solutions" | "Supplied by the client"; page: string; photographer?: string };

const pexels = (file: string, id: number, alt: string, focus?: string): StockPhoto => ({ src: `/images/stock/${file}.jpg`, alt, ...(focus ? { focus } : {}), source: "Pexels", page: `https://www.pexels.com/photo/${id}/` });
const unsplash = (file: string, slug: string, alt: string, focus?: string, photographer?: string): StockPhoto => ({ src: `/images/stock/${file}.jpg`, alt, ...(focus ? { focus } : {}), source: "Unsplash", page: `https://unsplash.com/photos/${slug}`, ...(photographer ? { photographer } : {}) });

export const STOCK = {
  // ---- technology
  cbctScanner: pexels("cbct-scanner", 6501859, "3D cone beam CT (CBCT) dental imaging machine", "center 30%"),
  cbctPatient: pexels("cbct-patient", 6812468, "Patient positioned in a 3D cone beam CT scanner", "center 40%"),
  // supplied by the client (agency) on 2026-11-18 for the home "Digital X-rays" card
  iteroScanScreen: { src: "/images/stock/itero-scan-screen.jpg", alt: "Digital scan of the teeth reviewed on the iTero screen", focus: "center 45%", source: "Supplied by the client", page: "" },
  // the iTero photo the agency uses on the Ideal Dental Solutions site (client's request)
  iteroScanner: { src: "/images/stock/itero-scanner.jpg", alt: "iTero intraoral scanner with a 3D scan of the teeth on screen", focus: "center 50%", source: "Ideal Dental Solutions", page: "https://idealdentalsolutions.com/" },
  panoramicXrayOnScreen: pexels("panoramic-xray-on-screen", 6502162, "Digital panoramic dental X-ray reviewed on a monitor", "center 35%"),
  panoramicXrayDetail: pexels("panoramic-xray-detail", 6501853, "Panoramic X-ray showing the teeth, jaw and wisdom teeth", "center 30%"),
  jawboneXrayScreen: pexels("jawbone-xray-screen", 6502019, "3D scan of the jawbone reviewed on screen before treatment", "center 35%"),
  intraoralCameraScreen: pexels("intraoral-camera-screen", 6812508, "Intraoral camera images shown to a patient on screen", "center 40%"),
  prfCentrifuge: pexels("prf-centrifuge", 6627667, "Centrifuge preparing platelet-rich fibrin (PRF) from a small blood sample", "center 50%"),
  crownHandFinishing: pexels("crown-hand-finishing", 7788511, "Ceramic crown being finished by hand", "center 50%"),
  dentalLaser: pexels("dental-laser", 31188655, "Soft-tissue dental laser with handpiece", "center 55%"),
  calmPatientChair: pexels("calm-patient-chair", 3946829, "Relaxed patient resting comfortably in the dental chair", "center 40%"),
  // ---- planning, smiles, care
  smilePlanOnScreen: unsplash("smile-plan-on-screen", "-m-4tYmtLlI", "Patient reviewing a digital treatment plan on screen in the dental chair", "center 60%"),
  shadeMatchingSmile: pexels("shade-matching-smile", 5355901, "Matching tooth shade to a patient's smile with a shade guide", "center 40%"),
  shadeGuideHands: pexels("shade-guide-hands", 5355899, "Tooth shade guide used to choose a natural colour", "center 45%"),
  naturalBambooToothbrush: pexels("natural-bamboo-toothbrush", 8842703, "Bamboo toothbrush and greenery, a natural approach to oral care", "center 60%"),
  bambooToothbrushWood: pexels("bamboo-toothbrush-wood", 8842629, "Bamboo toothbrush on wood with green leaves", "center 55%"),
  naturalToothpasteLeaf: pexels("natural-toothpaste-leaf", 4465814, "Natural toothpaste and bamboo toothbrush on a green leaf", "center 50%"),
  dentalCleaning: pexels("dental-cleaning", 3845954, "Hygienist cleaning a patient's teeth", "center 40%"),
  // ---- smiles and comfort
  happyPatientMirror: pexels("happy-patient-mirror", 3845744, "Happy patient checking her smile in a mirror in the dental chair", "center 35%"),
  happyPatientPortrait: pexels("happy-patient-portrait", 3845627, "Smiling patient in the dental chair", "center 35%"),
  smilingPatientChair: pexels("smiling-patient-chair", 3845549, "Smiling patient relaxing in the dental chair", "center 35%"),
  smilingManChair: pexels("smiling-man-chair", 3845551, "Smiling man in the dental chair", "center 35%"),
  relaxedWomanChair: pexels("relaxed-woman-chair", 4971499, "Relaxed patient sitting comfortably in the dental chair", "center 40%"),
  smilingWomanChair: pexels("smiling-woman-chair", 7803058, "Patient smiling in the dental chair before her visit", "center 40%"),
  clearAlignerSmile: pexels("clear-aligner-smile", 11887613, "Smiling patient holding a clear aligner", "center 40%"),
  // ---- treatments
  alignersInHands: pexels("aligners-in-hands", 28407749, "Clear aligners held in the hands", "center 50%"),
  whiteningLight: pexels("whitening-light", 5622271, "In-office teeth whitening with a whitening light", "center 40%"),
  veneerShadeSamples: pexels("veneer-shade-samples", 6812496, "Porcelain veneer samples in a range of natural shades", "center 80%"),
  veneerConsultMirror: pexels("veneer-consult-mirror", 4971503, "Cosmetic consultation: choosing a smile with a shade guide and mirror", "center 40%"),
  fillingCuringLight: pexels("filling-curing-light", 5355829, "Tooth-coloured filling being set with a curing light", "center 45%"),
  fillingModel: pexels("filling-model", 6627594, "Dental model showing a filling in a back tooth", "center 50%"),
  crownCrafting: pexels("crown-crafting", 7788508, "Dental crown being crafted and checked against a model", "center 45%"),
  bridgeCloseup: pexels("bridge-closeup", 12712256, "Dental bridge replacing missing teeth", "center 55%"),
  prostheticArrangement: pexels("prosthetic-arrangement", 33748061, "Dental bridge and model on a dark background", "center 55%"),
  restorativeModels: pexels("restorative-models", 6627601, "Dental models used to plan crowns, bridges and fillings", "center 50%"),
  denturePolishing: pexels("denture-polishing", 6627590, "Denture being polished for a smooth, comfortable fit", "center 50%"),
  implantModel: pexels("implant-model", 6502305, "Dental implant model: titanium post, abutment and crown", "center 50%"),
  implantModelCloseup: pexels("implant-model-closeup", 6502306, "Dental implant model beside natural teeth", "center 45%"),
  implantModelCrown: pexels("implant-model-crown", 6502343, "Implant model with the crown that fits on top", "center 50%"),
  fullArchImplantBridge: pexels("full-arch-implant-bridge", 39377366, "Full-arch implant bridge for All-on-4 treatment", "center 50%"),
  transparentImplantModel: pexels("transparent-implant-model", 6812500, "Transparent jaw model showing implants under a full arch", "center 50%"),
  surgicalInstruments: pexels("surgical-instruments", 12351707, "Sterile oral surgery instruments laid out before a procedure", "center 50%"),
  extractionInstruments: pexels("extraction-instruments", 6627671, "Sterile instruments on a tray for a gentle tooth extraction", "center 50%"),
  jawPainCompress: pexels("jaw-pain-compress", 5624170, "Woman holding a cold compress to her aching jaw", "center 40%"),
  nightGuard: pexels("night-guard", 10896129, "Clear night guard to protect the teeth and jaw from grinding", "center 50%"),
  toothacheMan: pexels("toothache-man", 6809670, "Man with a toothache holding his cheek", "center 35%"),
  veneerPlacement: pexels("veneer-placement", 6627571, "Porcelain veneer being placed on a smiling patient's front teeth", "center 45%"),
  panoramicScanPatient: pexels("panoramic-scan-patient", 6812451, "Patient having a panoramic X-ray to check the wisdom teeth", "center 40%"),
  brushingTeethRoutine: pexels("brushing-teeth-routine", 27176924, "Patient brushing her teeth as part of a daily routine", "center 40%"),
  // ---- recovery and patients (blog)
  softFoodSoups: pexels("soft-food-soups", 8738017, "Smooth soups, soft foods for the first days after treatment", "center 50%"),
  pumpkinSoup: pexels("pumpkin-soup", 1277483, "Bowl of smooth pumpkin soup, an easy meal while healing", "center 50%"),
  seniorPatientMirror: pexels("senior-patient-mirror", 8413346, "Senior patient checking his smile in a mirror at the dentist", "center 40%"),
} as const;

export const STOCK_LIST: StockPhoto[] = Object.values(STOCK);

/** Each treatment page's own photos: the hero, and the photo beside "Benefits & care" (unless a real before/after is shown). */
export const SERVICE_PHOTOS: Record<string, { hero: StockPhoto; benefit: StockPhoto }> = {
  "cosmetic-dentistry": { hero: STOCK.veneerConsultMirror, benefit: STOCK.shadeGuideHands },
  "composite-filling": { hero: STOCK.fillingCuringLight, benefit: STOCK.fillingModel },
  invisalign: { hero: STOCK.clearAlignerSmile, benefit: STOCK.alignersInHands },
  "teeth-whitening": { hero: STOCK.whiteningLight, benefit: STOCK.shadeGuideHands },
  veneers: { hero: STOCK.veneerPlacement, benefit: STOCK.veneerShadeSamples },
  "dental-crowns": { hero: STOCK.crownCrafting, benefit: STOCK.crownHandFinishing },
  "dental-implants": { hero: STOCK.implantModel, benefit: STOCK.transparentImplantModel },
  "holistic-dentistry": { hero: STOCK.naturalToothpasteLeaf, benefit: STOCK.bambooToothbrushWood },
  "oral-surgery": { hero: STOCK.surgicalInstruments, benefit: STOCK.cbctPatient },
  "all-on-4-implants": { hero: STOCK.fullArchImplantBridge, benefit: STOCK.transparentImplantModel },
  "bone-grafting": { hero: STOCK.implantModelCrown, benefit: STOCK.jawboneXrayScreen },
  "tooth-extractions": { hero: STOCK.extractionInstruments, benefit: STOCK.calmPatientChair },
  "wisdom-teeth-removal": { hero: STOCK.panoramicXrayDetail, benefit: STOCK.panoramicScanPatient },
  "restorative-dentistry": { hero: STOCK.restorativeModels, benefit: STOCK.denturePolishing },
  "dental-bridges": { hero: STOCK.bridgeCloseup, benefit: STOCK.prostheticArrangement },
  "tmj-treatments": { hero: STOCK.jawPainCompress, benefit: STOCK.nightGuard },
};

/**
 * Photos for each treatment's process steps, matched to what the step is about. "DR" = Dr. Lavi (the
 * practice's headshot), "ROOM" = his treatment room, "RECEPTION" = his reception, "SMILE" = a smiling
 * patient (taken in turn from RESULT_SMILES). Pages with more steps than entries continue with smiles.
 */
export type StepPhoto = StockPhoto | "DR" | "ROOM" | "RECEPTION" | "SMILE";
export const SERVICE_STEPS: Record<string, StepPhoto[]> = {
  "all-on-4-implants": ["DR", "ROOM", "SMILE"],
  "bone-grafting": [STOCK.extractionInstruments, STOCK.transparentImplantModel, STOCK.panoramicXrayDetail, "DR", "ROOM", "SMILE"],
  "composite-filling": ["DR", "ROOM", "SMILE"],
  "cosmetic-dentistry": ["DR", STOCK.smilePlanOnScreen, "SMILE"],
  "dental-bridges": ["DR", STOCK.crownCrafting, "SMILE"],
  "dental-crowns": ["DR", "ROOM", "SMILE"],
  "dental-implants": ["DR", "ROOM", "SMILE"],
  "holistic-dentistry": ["DR", "ROOM", STOCK.dentalCleaning],
  invisalign: [STOCK.iteroScanner, STOCK.smilePlanOnScreen, STOCK.brushingTeethRoutine, "DR", "SMILE"],
  "oral-surgery": ["DR", "ROOM", "SMILE"],
  "restorative-dentistry": [],
  "teeth-whitening": ["DR", "ROOM", STOCK.brushingTeethRoutine, "RECEPTION"],
  "tmj-treatments": ["DR", "ROOM", "SMILE"],
  "tooth-extractions": ["DR", "ROOM", STOCK.softFoodSoups],
  veneers: ["DR", STOCK.iteroScanner, "SMILE"],
  "wisdom-teeth-removal": ["DR", "ROOM", STOCK.pumpkinSoup],
};

/** Smiling patients for the last "process" step, taken in turn so neighbouring pages differ. */
export const RESULT_SMILES: StockPhoto[] = [STOCK.smilingPatientChair, STOCK.smilingManChair, STOCK.relaxedWomanChair, STOCK.happyPatientMirror, STOCK.smilingWomanChair, STOCK.happyPatientPortrait];
