import type { PageSection } from "@/lib/types";
import { BeforeAfter } from "./BeforeAfter";
import { Cta } from "./Cta";
import { Doctor } from "./Doctor";
import { Faq } from "./Faq";
import { FeatureGrid, Values } from "./FeatureGrid";
import { FormSection } from "./FormSection";
import { Hero } from "./Hero";
import { IntroSplit } from "./IntroSplit";
import { Insurance, Offer, PhotoGrid, RichText, Team } from "./Misc";
import { Reviews } from "./Reviews";
import { ServiceCategories } from "./ServiceCategories";
import { ServicesHub } from "./ServicesHub";
import { Visit } from "./Visit";
import { DoctorIntro } from "./DoctorIntro";
import { FirstVisit } from "./FirstVisit";
import { FocusAreas } from "./FocusAreas";
import { TechExplainer } from "./TechExplainer";
import { TreatmentPickerWithPhotos } from "./TreatmentPickerSection";
import { ServiceShowcase } from "./ServiceShowcase";
import { FeaturedServices, NewPatient, WhyChoose } from "./HomeBlocks";
import { InsuranceChecker } from "./InsuranceCheckerSection";
import { CtaBanner, Marquee, StatBand } from "@/components/rich/Blocks";
import { Container, Section } from "@/components/ui/Section";

export function Sections({ sections, crumbs }: { sections: PageSection[]; crumbs?: { name: string; path: string }[] }) {
  return (
    <>
      {sections.map((s, i) => {
        const key = `${s._type}-${i}`;
        switch (s._type) {
          case "featuredServices": return <FeaturedServices key={key} s={s} />;
          case "insuranceChecker": return <InsuranceChecker key={key} s={s} />;
          case "whyChoose": return <WhyChoose key={key} s={s} />;
          case "newPatient": return <NewPatient key={key} s={s} />;
          case "serviceShowcase": return <ServiceShowcase key={key} s={s} />;
          case "marquee": return <div key={key} className={s.dark ? "bg-olive-900 py-6 sm:py-10" : "border-y border-ink-900/10 bg-warm py-6"}><Marquee items={s.items} dark={s.dark} />{s.items2 && <Marquee items={s.items2} dark={s.dark} outline reverse />}</div>;
          case "statBand": return <Section key={key} tight className="bg-warm"><Container><StatBand /></Container></Section>;
          case "ctaBanner": return <Section key={key} className="bg-warm"><Container><CtaBanner heading={s.heading} text={s.text} image={s.image} buttonLabel={s.buttonLabel} /></Container></Section>;
          case "hero": return <Hero key={key} s={s} crumbs={i === 0 ? crumbs : undefined} />;
          case "introSplit": return <IntroSplit key={key} s={s} />;
          case "featureGrid": return <FeatureGrid key={key} s={s} />;
          case "values": return <Values key={key} s={s} />;
          case "serviceCategories": return <ServiceCategories key={key} s={s} />;
          case "beforeAfter": return <BeforeAfter key={key} s={s} />;
          case "doctor": return <Doctor key={key} s={s} />;
          case "reviews": return <Reviews key={key} s={s} />;
          case "faq": return <Faq key={key} s={s} />;
          case "visit": return <Visit key={key} s={s} />;
          case "cta": return <Cta key={key} s={s} />;
          case "richText": return <RichText key={key} s={s} />;
          case "team": return <Team key={key} s={s} />;
          case "photoGrid": return <PhotoGrid key={key} s={s} />;
          case "form": return <FormSection key={key} s={s} />;
          case "servicesHub": return <ServicesHub key={key} />;
          case "insurance": return <Insurance key={key} s={s} />;
          case "offer": return <Offer key={key} s={s} />;
          case "treatmentPicker": return <TreatmentPickerWithPhotos key={key} s={s} />;
          case "firstVisit": return <FirstVisit key={key} s={s} />;
          case "techExplainer": return <TechExplainer key={key} s={s} />;
          case "doctorIntro": return <DoctorIntro key={key} s={s} />;
          case "focusAreas": return <FocusAreas key={key} s={s} />;
          default: return null;
        }
      })}
    </>
  );
}
