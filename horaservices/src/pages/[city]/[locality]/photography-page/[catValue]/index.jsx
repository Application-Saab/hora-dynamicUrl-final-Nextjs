import CatValuePage from "@/pages/photography-page/[catValue]";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_PHOTOGRAPHY_BY_TAG,
} from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";
import "../../../../../app/homepage.css";
import { isValidPhotographyCategorySlug } from "@/utils/routeConfig";
import { categoryToWeblinkFolderName } from "@/utils/photoCategories";

const MOMENT_SLUG_TO_KEY = {
  "pre-wedding": "pre-wedding",
  "haldi-mehndi": "haldi-mahandi",
  "wedding": "wedding",
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

  if (!isValidPhotographyCategorySlug(catValue)) {
    return { notFound: true };
  }

  const citySlug = (city || "").toLowerCase();
  const localitySlug = (locality || "").toLowerCase();
  const finalCatValue = catValue || null;

  if (!citySlug || !localitySlug || !finalCatValue) {
    return { notFound: true };
  }

  function capitalizeHyphenatedString(str) {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  }

  const result = capitalizeHyphenatedString(finalCatValue);

  const finalCity = formatCityDisplay(citySlug);
  const finalLocality = formatLocalityDisplay(localitySlug);

  const effectiveCatValue =
    typeof result === "string" && MOMENT_SLUG_TO_KEY[result]
      ? "wedding-photography"
      : result;

  const initialActiveMoment =
    typeof result === "string" && MOMENT_SLUG_TO_KEY[result]
      ? MOMENT_SLUG_TO_KEY[result]
      : null;

  let catId = null;
  let products = [];
  let error = "";

  try {
    const catRes = await axiosApi.get(
      `${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(effectiveCatValue)}`,
    );
    catId = catRes.data?.data?._id || null;

    if (!catId) {
      error = "No category found";
    } else {
      const prodRes = await axiosApi.get(
        `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${catId}`,
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

  const galleryData = categoryToWeblinkFolderName[effectiveCatValue] || null;

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
