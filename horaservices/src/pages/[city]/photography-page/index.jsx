import Index from "@/pages/photography-page";
import { useRouter } from "next/router";
import cityData from "@/utils/cityData";
import LocalitiesSection from "@/component/LocalitiesSection";
import FAQAccordion from "@/component/FAQs";
import SectionDescription from "@/component/Description";
import { photographyCityDescription } from "@/util/PhotographyMockData/PhotographyDescription";
import { photographyFAQData } from "@/util/PhotographyMockData/PhotographyFAQ";
import { PhotographySEOKeywords } from "@/util/PhotographyMockData/GetSEOKeywords";

const PhotographyCityPage = () => {
  const router = useRouter();
  let { city } = router.query;
  if (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
  }

  const cityDescription = photographyCityDescription(city);

  const localities =
    cityData[city?.toLocaleLowerCase()]?.cityLocalitiesList || [];

  const localityHandleClick = (localityName) => {
    const formattedLocalityName = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();
    router.push({
      pathname: `/${city.toLowerCase()}/${formattedLocalityName}/photography-page`,
    });
  };

  return (
    <>
      <div className="container">
        <Index />
      </div>
      <LocalitiesSection
        title={`${city} localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
      <div className="mt-5">
        <FAQAccordion faqData={photographyFAQData} />
      </div>
      <SectionDescription paragraphs={cityDescription} />
      <div className="my-4 container">
        <PhotographySEOKeywords city={city} />
      </div>
    </>
  );
};

export default PhotographyCityPage;
