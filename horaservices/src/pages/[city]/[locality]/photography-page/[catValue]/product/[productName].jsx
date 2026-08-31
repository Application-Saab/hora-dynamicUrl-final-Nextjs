// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import cityData from "@/utils/cityData";
// import "../../../../../../app/homepage.css";
// import ProductDetails from "@/pages/photography-page/[catValue]/product/[productName]";

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
//       <ProductDetails locality={locality} />
     
//     </div>
//   );
// };

// export default PhotographyCityPage;









// pages/[city]/[locality]/photography-page/[catValue]/product/[productName].jsx

import ProductDetails from "@/pages/photography-page/[catValue]/product/[productName]";
import { BASE_URL, GET_ADDON_BY_ID } from "@/utils/apiconstants";
import axiosApi from "@/utils/axiosApi";
import "../../../../../../app/homepage.css";

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
  const { city, locality, catValue, productName } = context.params || {};
  const query = context.query || {};

  const citySlug = (city || "").toLowerCase();
  const localitySlug = (locality || "").toLowerCase();
  const finalCatValue = catValue || null;
  const productId = query.id || null;

  if (!citySlug || !localitySlug) {
    return { notFound: true };
  }

  const finalCity = formatCityDisplay(citySlug);
  const finalLocality = formatLocalityDisplay(localitySlug);

  let work = null;
  let similarProducts = [];
  let addonData = [];
  let error = null;

  if (productId) {
    try {
      const res = await axiosApi.get(
        `${BASE_URL}/api/photography/details/${productId}`
      );
      const data = res.data?.data;

      if (data) {
        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(Number(data.price));

        work = {
          ...data,
          discount,
          discountedPrice,
          discountDifference,
          advance_amount: Number(data.advance_amount || 0),
        };

        const tagId = data?.tag?.[0]?._id;
        if (tagId) {
          try {
            const similarRes = await axiosApi.get(
              `${BASE_URL}/api/photography/searchByTag/${tagId}`
            );
            similarProducts = (similarRes.data?.data || []).filter(
              (p) => p._id !== productId
            );
          } catch (e) {
            console.error("SSR similar fetch error:", e.message);
          }
        }

        const addonIds = data?.addons || [];
        if (addonIds.length > 0) {
          try {
            const q = new URLSearchParams();
            addonIds.forEach((id) => id && q.append("ids", id));
            if ([...q].length > 0) {
              const addonRes = await axiosApi.get(
                `${BASE_URL}${GET_ADDON_BY_ID}?${q.toString()}`
              );
              addonData = addonRes.data?.data || [];
            }
          } catch (e) {
            console.error("SSR addons fetch error:", e.message);
          }
        }
      } else {
        error = "No product found";
      }
    } catch (err) {
      console.error("SSR city+locality product error:", err.message);
      error = err.message;
    }
  }

  return {
    props: {
      initialWork: work,
      initialSimilar: similarProducts,
      initialAddons: addonData,
      productId: productId || null,
      city: finalCity,
      locality: finalLocality,
      catValue: finalCatValue,
      ssrError: error,
      productName: productName || null,
    },
  };
}

// ---------- Page ----------
const PhotographyLocalityProductPage = (ssrProps) => {
  return (
    <div>
      <ProductDetails
        initialWork={ssrProps.initialWork}
        initialSimilar={ssrProps.initialSimilar}
        initialAddons={ssrProps.initialAddons}
        productId={ssrProps.productId}
        city={ssrProps.city}
        locality={ssrProps.locality}
        catValue={ssrProps.catValue}
        ssrError={ssrProps.ssrError}
      />
    </div>
  );
};

export default PhotographyLocalityProductPage;