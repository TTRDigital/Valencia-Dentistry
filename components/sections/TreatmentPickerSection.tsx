import { getServices } from "@/lib/content";
import type { TreatmentPickerSection } from "@/lib/types";
import { TreatmentPicker } from "./TreatmentPicker";

/** Gives each picker answer a real photo: the hero photo of the first treatment it links to. */
export async function TreatmentPickerWithPhotos({ s }: { s: TreatmentPickerSection }) {
  const services = await getServices();
  const options = s.options.map((o) => ({ ...o, image: o.image ?? o.links.map((l) => services.find((x) => x.path === l.href)?.hero.image).find(Boolean) }));
  return <TreatmentPicker s={{ ...s, options }} />;
}
