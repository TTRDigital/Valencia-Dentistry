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
import { Banner, CaseCarouselSectionView, CenteredCta, PhotoCards, StepPanels, TechAccordion } from "./IdealHome";

export function Sections({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((s, i) => {
        const key = `${s._type}-${i}`;
        switch (s._type) {
          case "hero": return <Hero key={key} s={s} />;
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
          case "photoCards": return <PhotoCards key={key} s={s} />;
          case "banner": return <Banner key={key} s={s} />;
          case "techAccordion": return <TechAccordion key={key} s={s} />;
          case "caseCarousel": return <CaseCarouselSectionView key={key} s={s} />;
          case "centeredCta": return <CenteredCta key={key} s={s} />;
          case "stepPanels": return <StepPanels key={key} s={s} />;
          default: return null;
        }
      })}
    </>
  );
}
