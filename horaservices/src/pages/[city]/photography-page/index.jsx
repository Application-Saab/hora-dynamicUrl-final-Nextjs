import Index from "@/pages/photography-page";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import cityData from "@/utils/cityData";
import "@/app/homepage.css";
import {faqData} from "@/utils/photographyFAQData";

import PhotographyLocalities from "./components/PhotographyLocalities";
import PhotographyDescription from "./components/PhotographyDescription";
import PhotographySEOKeywords from "./components/PhotographySEOKeywords";
import PhotographyFAQ from "./components/PhotographyFAQ";

const PhotographyCityPage = () => {
  const router = useRouter();
  let { city } = router.query;

  if (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
  }

  const normalizedCity = city ? city.toLowerCase() : "";
  const [cityLocalitiesList, setCityLocalitiesList] = useState([]);

  useEffect(() => {
    if (normalizedCity) {
      const localities = cityData[normalizedCity]?.cityLocalitiesList || [];
      setCityLocalitiesList(localities);
    }
  }, [normalizedCity]);

  return (
    <div className="page-width">
      <Index />
      <PhotographyLocalities city={city} localities={cityLocalitiesList} />
      <PhotographyFAQ faqData={faqData}/>
      <PhotographyDescription city={city} />
      <PhotographySEOKeywords city={city} />
    </div>
  );
};

export default PhotographyCityPage;

