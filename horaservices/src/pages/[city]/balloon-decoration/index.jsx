import SectionDescription from "@/component/Description";
import FAQAccordion from "@/component/FAQs";
import LocalitiesSection from "@/component/LocalitiesSection";
import DecorationPage from "@/pages/balloon-decoration";
import { decorationServices } from "@/util/DecorationMockData/DecorationCategory";
import { decorationCityFAQData } from "@/util/DecorationMockData/DecorationCityFAQ";
import { decorationCityDescription } from "@/util/DecorationMockData/DecorationDescription";
import { DecorationSEOKeywords } from "@/util/DecorationMockData/GetSEOKeywords";
import cityData from "@/utils/cityData";
import { useRouter } from "next/router";
import React from "react";

function DecorationCityPage() {
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
  const localities =
    cityData[city?.toLocaleLowerCase()]?.cityLocalitiesList || [];

  const localityHandleClick = (localityName) => {
    const formattedLocalityName = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();
    router.push({
      pathname: `/${city.toLowerCase()}/${formattedLocalityName}/balloon-decoration`,
    });
  };

  const decorationCategoryClick = (localityName) => {
    router.push({
      pathname: `/balloon-decoration`,
    });
  };


  return (
    <>
      <DecorationPage />
      <LocalitiesSection
        title={`${city} localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
      <div className="mt-5">
        <FAQAccordion faqData={cityDecorationFAQ} />
      </div>
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

export default DecorationCityPage;
