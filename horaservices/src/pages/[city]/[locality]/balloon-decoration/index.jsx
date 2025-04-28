import SectionDescription from "@/component/Description";
import FAQAccordion from "@/component/FAQs";
import LocalitiesSection from "@/component/LocalitiesSection";
import DecorationPage from "@/pages/balloon-decoration";
import { decorationServices } from "@/util/DecorationMockData/DecorationCategory";
import { decorationCityFAQData } from "@/util/DecorationMockData/DecorationCityFAQ";
import { decorationCityDescription } from "@/util/DecorationMockData/DecorationDescription";
import { DecorationSEOKeywords } from "@/util/DecorationMockData/GetSEOKeywords";
import { useRouter } from "next/router";

function DecorationLocalityPage() {
  const router = useRouter();
  let { city } = router.query;
  if (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
  }

  const cityDecorationFAQ = decorationCityFAQData(city);
  const cityDescription = decorationCityDescription(city);
  const decorationCategory = decorationServices.map((item) => ({
    name: `${item.name} in ${city}`,
  }));

  const decorationCategoryClick = () => {
    router.push({
      pathname: `/balloon-decoration`,
    });
  };

  return (
    <>
      <DecorationPage />
      <FAQAccordion faqData={cityDecorationFAQ} />
      <SectionDescription paragraphs={cityDescription} />
      <LocalitiesSection
        title={`Explore Other Decoration Category In ${city}`}
        localities={decorationCategory}
        handleClick={decorationCategoryClick}
      />
      <div className="my-4 container">
        <DecorationSEOKeywords city={city} />
      </div>
    </>
  );
}

export default DecorationLocalityPage;
