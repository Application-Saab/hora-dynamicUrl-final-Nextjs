import Index from "@/pages/photography-page";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import cityData from "@/utils/cityData";
import "@/app/homepage.css";
import {faqData} from "@/utils/photographyFAQData";
import PhotographyDescription from "@/components/PhotographyDescription";
import PhotographySEOKeywords from "@/components/PhotographySEOKeywords";
import FAQSection from "@/components/FAQSection";
import LocalitiesSection from "@/components/LocalitiesSection";

const PhotographyCityPage = () => {
  const router = useRouter();
  let { city } = router.query;

  if (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
  }

  const normalizedCity = city ? city.toLowerCase() : "";
  const [cityLocalitiesList, setCityLocalitiesList] = useState([]);
  const localityHandleClick = (localityName) => {
    const formattedLocalityName = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();
    router.push({
      pathname: `/${city.toLowerCase()}/${formattedLocalityName}/photography-page`,
    });
  };
  useEffect(() => {
    if (normalizedCity) {
      const localities = cityData[normalizedCity]?.cityLocalitiesList || [];
      setCityLocalitiesList(localities);
    }
  }, [normalizedCity]);

  return (
    <div >
      <Index city={city} />
        <LocalitiesSection
        title={`${city} localities`}
        localities={cityLocalitiesList}
        handleClick={localityHandleClick}
      />
         <div className="tab-section-details-productpage">
        <FAQSection faqData={faqData} />
      </div>
      <PhotographyDescription city={city} />
      <PhotographySEOKeywords city={city} />
    </div>
  );
};

export default PhotographyCityPage;

