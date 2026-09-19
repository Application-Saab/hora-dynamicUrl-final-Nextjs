import Index from "@/pages/photography-page";
import { BASE_URL, GET_PHOTOGRAPHY_BY_TAG } from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";
import "../../../../app/homepage.css";
import { validateCityLocality } from "@/utils/validCities";

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
  const citySlug =
    (context.params?.city || "").toLowerCase();

  const localitySlug =
    (context.params?.locality || "").toLowerCase();

  const validation = validateCityLocality(
    citySlug,
    localitySlug
  );

  if (!validation.valid) {
    return {
      notFound: true,
    };
  }

  const finalCity = validation.cityName;

  const finalLocality = formatDisplay(validation.localitySlug);

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