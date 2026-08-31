// import Index from "@/pages/photography-page";
// import { useRouter } from "next/router";
// import "../../../../app/homepage.css";



// const PhotographyCityPage = () => {
//   const router = useRouter();
//   let { locality } = router.query;

//   if (locality) {
//     locality = locality.charAt(0).toUpperCase() + locality.slice(1);
//   }


//   return (
//     <div >
  
//       <Index  locality={locality}/>
    
//     </div>
//   );
// };

// export default PhotographyCityPage;

// pages/[city]/[locality]/photography-page/index.jsx

import Index from "@/pages/photography-page";
import { BASE_URL, GET_PHOTOGRAPHY_BY_TAG } from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";
import "../../../../app/homepage.css";

const STANDARD_PACKAGE_TAG_ID = "66c96b4e22ed47b72117e09a";

const getDiscountedPrice = (price = 0) => {
  const discountedPrice = price / 0.78;
  const discountDifference = discountedPrice - price;
  const discount = ((discountDifference / discountedPrice) * 100).toFixed(0);
  return {
    discount: Number(discount),
    discountedPrice: Math.round(discountedPrice),
    discountDifference: Math.round(discountDifference),
  };
};

function formatDisplay(slug) {
  if (!slug) return "";
  // "dwarka-sector-10" → "Dwarka Sector 10" optional; simple capitalize:
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function formatCityDisplay(slug) {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { city, locality } = context.params || {};

  const citySlug = (city || "").toLowerCase();
  const localitySlug = (locality || "").toLowerCase();

  if (!citySlug || !localitySlug) {
    return { notFound: true };
  }

  const finalCity = formatCityDisplay(citySlug);
  const finalLocality = formatDisplay(localitySlug);

  let initialPackages = [];
  try {
    const res = await axiosApi.get(
      `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${STANDARD_PACKAGE_TAG_ID}`
    );
    initialPackages =
      res.data?.data?.map((item) => {
        const { discountedPrice, discountDifference } = getDiscountedPrice(
          item.price || 0
        );
        return { ...item, discountedPrice, discountDifference };
      }) || [];
  } catch (err) {
    console.error("SSR locality photography packages error:", err.message);
    initialPackages = [];
  }

  return {
    props: {
      city: finalCity,
      locality: finalLocality,
      initialPackages,
    },
  };
}

// ---------- Page ----------
const PhotographyLocalityPage = ({ city, locality, initialPackages }) => {
  return (
    <div>
      <Index
        city={city}
        locality={locality}
        initialPackages={initialPackages}
      />
    </div>
  );
};

export default PhotographyLocalityPage;