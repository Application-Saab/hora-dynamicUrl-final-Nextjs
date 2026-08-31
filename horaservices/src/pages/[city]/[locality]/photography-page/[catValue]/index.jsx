// import Index from "@/pages/photography-page";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import cityData from "@/utils/cityData";
// import "../../../../../app/homepage.css";
// import CatValuePage from "@/pages/photography-page/[catValue]";

// const PhotographyCityPage = () => {
//   const router = useRouter();
//   let { city ,locality} = router.query;

//   if (city) {
//     city = city.charAt(0).toUpperCase() + city.slice(1);
//   }

//   const normalizedCity = city ? city.toLowerCase() : "";
//   const [cityLocalitiesList, setCityLocalitiesList] = useState([]);
//   const localityHandleClick = (localityName) => {
//     const formattedLocalityName = localityName
//       .replace(/\s+/g, "-")
//       .toLowerCase();
//     router.push({
//       pathname: `/${city.toLowerCase()}/${formattedLocalityName}/photography-page`,
//     });
//   };
//   useEffect(() => {
//     if (normalizedCity) {
//       const localities = cityData[normalizedCity]?.cityLocalitiesList || [];
//       setCityLocalitiesList(localities);
//     }
//   }, [normalizedCity]);

//   return (
//     <div >
//       <CatValuePage  locality={locality}/>
     
//     </div>
//   );
// };

// export default PhotographyCityPage;








// pages/[city]/[locality]/photography-page/[catValue]/index.jsx

import CatValuePage from "@/pages/photography-page/[catValue]";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_PHOTOGRAPHY_BY_TAG,
} from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";
import "../../../../../app/homepage.css";

const MOMENT_SLUG_TO_KEY = {
  "pre-wedding": "pre-wedding",
  "haldi-mehndi": "haldi-mahandi",
  wedding: "wedding",
};

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

const categoryToGallery = {
  "Engagement-Photography": {
    folderName: "engagement weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Wedding-Photography": {
    folderName: "Wedding",
    customerId: "6683e5d43e33c54c0ebde8f2",
  },
  "Anniversary-Photography": {
    folderName: "anniversary poses web link",
    customerId: "64137625549b58e3dc39a685",
  },
  "Birthday-Photography": {
    folderName: "Candid",
    customerId: "63edb239d680d47d95870fa0",
  },
  "House-warming-Photography": {
    folderName: "House warming weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Naming-ceremony-Photography": {
    folderName: "naming ceremony weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Baby-Shower-Photography": {
    folderName: "baby shower weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Bachelorette-Photography": {
    folderName: "bacherrolerate",
    customerId: "64137625549b58e3dc39a685",
  },
  "Maternity-Photography": {
    folderName: "maternity poses",
    customerId: "6683e5d43e33c54c0ebde8f2",
  },
  "New-Born-Baby-Photography": {
    folderName: "new born ",
    customerId: "64137625549b58e3dc39a685",
  },
};

function formatCityDisplay(slug) {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

function formatLocalityDisplay(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { city, locality, catValue } = context.params || {};

  const citySlug = (city || "").toLowerCase();
  const localitySlug = (locality || "").toLowerCase();
  const finalCatValue = catValue || null;

  if (!citySlug || !localitySlug || !finalCatValue) {
    return { notFound: true };
  }

  const finalCity = formatCityDisplay(citySlug);
  const finalLocality = formatLocalityDisplay(localitySlug);

  const effectiveCatValue =
    typeof finalCatValue === "string" && MOMENT_SLUG_TO_KEY[finalCatValue]
      ? "Wedding-Photography"
      : finalCatValue;

  const initialActiveMoment =
    typeof finalCatValue === "string" && MOMENT_SLUG_TO_KEY[finalCatValue]
      ? MOMENT_SLUG_TO_KEY[finalCatValue]
      : null;

  let catId = null;
  let products = [];
  let error = "";

  try {
    const catRes = await axiosApi.get(
      `${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(effectiveCatValue)}`
    );
    catId = catRes.data?.data?._id || null;

    if (!catId) {
      error = "No category found";
    } else {
      const prodRes = await axiosApi.get(
        `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${catId}`
      );
      const data = prodRes.data?.data || [];
      products = data.map((item) => {
        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(item.price || 0);
        return { ...item, discount, discountedPrice, discountDifference };
      });
    }
  } catch (err) {
    console.error("SSR city+locality category page error:", err.message);
    error = "Failed to fetch category / products";
    products = [];
  }

  const galleryData = categoryToGallery[effectiveCatValue] || null;

  return {
    props: {
      initialCatValue: finalCatValue,
      effectiveCatValue: effectiveCatValue || null,
      city: finalCity,
      locality: finalLocality,
      initialCatId: catId,
      initialProducts: products,
      initialGalleryData: galleryData,
      initialActiveMoment,
      ssrError: error,
    },
  };
}

// ---------- Page ----------
const PhotographyLocalityCatPage = (ssrProps) => {
  return (
    <div>
      <CatValuePage
        initialCatValue={ssrProps.initialCatValue}
        effectiveCatValue={ssrProps.effectiveCatValue}
        city={ssrProps.city}
        locality={ssrProps.locality}
        initialCatId={ssrProps.initialCatId}
        initialProducts={ssrProps.initialProducts}
        initialGalleryData={ssrProps.initialGalleryData}
        initialActiveMoment={ssrProps.initialActiveMoment}
        ssrError={ssrProps.ssrError}
      />
    </div>
  );
};

export default PhotographyLocalityCatPage;