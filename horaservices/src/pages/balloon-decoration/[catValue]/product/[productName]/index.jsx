import DecorationsCatDetails from "@/components/Decoration/DecorationsCatDetails";
import {
  BASE_URL,
  GET_DECORATION_BY_NAME,
  GET_DECORATION_CAT_ID,
  GET_ADDON_BY_ID,
} from "@/utils/apiconstants";
import axiosApi from "@/utils/axiosApi";

function formatProductName(productName) {
  if (!productName) return "";
  return productName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function getServerSideProps(context) {
  const { productName, catValue } = context.params || {};
  const query = context.query || {};

  const apiProduct = formatProductName(productName);
  const finalCatValue = catValue || query.catValue || "";
  const finalSubCategory = query.subCategory || "";

  let product = null;
  let allProducts = [];
  let addonData = [];

  if (apiProduct) {
    try {
      const tryFetch = async (name) => {
        const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${encodeURIComponent(name)}`;
        const res = await axiosApi.get(url);
        if (res?.data?.error) return null;
        return res?.data?.data?.[0] || null;
      };

      product = await tryFetch(apiProduct);
      if (!product && /\bAnd\b/i.test(apiProduct)) {
        product = await tryFetch(apiProduct.replace(/\bAnd\b/gi, "&"));
      }
    } catch (err) {
      console.error("SSR product fetch error:", err.message);
    }
  }

  if (product?.categoryId || finalCatValue) {
    try {
      let categoryId = product?.categoryId;
      if (!categoryId && finalCatValue) {
        const catRes = await axiosApi.get(
          `${BASE_URL}${GET_DECORATION_CAT_ID}${finalCatValue}`,
        );
        categoryId = catRes?.data?.data?._id;
      }
      if (categoryId) {
        const res = await axiosApi.get(
          `${BASE_URL}/api/Decoration/searchByTag/v2/${categoryId}?page=1&priceFilter=all&sortBy=asc&theme=all&limit=500`,
        );
        allProducts = res?.data?.data || [];
      }
    } catch (err) {
      console.error("SSR category products error:", err.message);
    }
  }

  if (product?.addons?.length) {
    try {
      const q = new URLSearchParams();
      product.addons.forEach((id) => id && q.append("ids", id));
      if ([...q].length) {
        const res = await axiosApi.get(`${BASE_URL}${GET_ADDON_BY_ID}?${q}`);
        if (!res?.data?.error) addonData = res?.data?.data || [];
      }
    } catch (err) {
      console.error("SSR addons error:", err.message);
    }
  }

  return {
    props: {
      initialProduct: product,
      initialCatValue: finalCatValue,
      initialSubCategory: finalSubCategory,
      productNameFromUrl: productName || null,
      initialAllProducts: allProducts,
      initialAddonData: addonData,
      city: null,
      locality: null,
    },
  };
}

export default function ProductPage(props) {
  return <DecorationsCatDetails {...props} />;
}