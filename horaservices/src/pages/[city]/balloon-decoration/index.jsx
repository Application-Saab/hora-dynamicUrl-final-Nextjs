import SectionDescription from "@/components/Description";
import FAQAccordion from "@/components/FAQs";
import LocalitiesSection from "@/components/LocalitiesSection";
import Decoration from "@/pages/balloon-decoration";
// import { decorationServices } from "@/utils/DecorationCategory";
import { decorationCityFAQData } from "@/utils/DecorationCityFAQ";
import { decorationCityDescription } from "@/utils/DecorationDescription";
import { DecorationSEOKeywords } from "@/utils/GetSEOKeywords";
import { decCat } from "@/utils/decorationCategories"
import cityData from "@/utils/cityData";
import { useRouter } from "next/router";
import React from "react";
import "../../../css/decoration.css"
import FAQSection from "@/components/FAQSection";
function DecorationCityPage() {
  const router = useRouter();
  let { city } = router.query;
  if (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
  }
  

  const cityDecorationFAQ = decorationCityFAQData(city);
  const cityDescription = decorationCityDescription(city);

  // const decorationCategory = decCat.map((item) => ({
  //   name: `${item.name} in ${city}`,
  //   slug: item.slug || item.name.toLowerCase().replace(/\s+/g, "-"), // ✅ generate slug
  // }));
const decorationCategory = decCat.map((item) => ({
  name: `${item.catValue} in ${city}`, // ✅ use catValue instead of name
  slug: item.slug || item.catValue.toLowerCase().replace(/\s+/g, "-"), // generate slug from catValue
  image: item.image,
  imgAlt: item.imgAlt,
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
      <Decoration city={city}/>
      <LocalitiesSection
        title={`${city} localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
     
    
     <div className="tab-section-details-productpage">
              <FAQSection faqData={cityDecorationFAQ} />
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