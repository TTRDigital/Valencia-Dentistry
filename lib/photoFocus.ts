import { CLIENT } from "./clientPhotos";
import { STOCK_LIST } from "./stockPhotos";

/** Crop focus for every client and stock photo, by src, applied by Picture wherever the photo appears. */
export const PHOTO_FOCUS: Record<string, string> = Object.fromEntries(
  [...Object.values(CLIENT), ...STOCK_LIST].filter((im) => im.focus).map((im) => [im.src, im.focus as string]),
);
