import Decoration from "@/components/Decoration/Decoration";
import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import DecorationIntro from "@/components/DecorationIntro";
import { decorationCityDescription } from "@/utils/DecorationDescription";
import { decorationCityFAQData } from "@/utils/DecorationCityFAQ";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default function BalloonDecorationPage() {
  // decorationCityDescription already { heading, blocks } shape mein hai,
  // isliye seedha use ho sakta hai — koi conversion nahi chahiye
  const descriptionSections = decorationCityDescription;

  // Generic FAQs, bina kisi city ke reference ke
  const faqData = decorationCityFAQData();

  return (
    <>
      <Decoration />

      {/* Keyword-rich intro — puts "balloon decoration" in the first 100 words for Google */}
      <DecorationIntro />

      <SectionDescription sections={descriptionSections} />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={faqData} />
      </div>
    </>
  );
}