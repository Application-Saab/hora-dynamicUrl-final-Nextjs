import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import cityData from "@/utils/cityData";
import "../../../../../../app/homepage.css";
import ProductDetails from "@/pages/photography-page/[catValue]/product/[productName]";

const PhotographyCityPage = () => {
  const router = useRouter();
  let { city ,locality} = router.query;

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
      <ProductDetails locality={locality} />
     
    </div>
  );
};

export default PhotographyCityPage;

