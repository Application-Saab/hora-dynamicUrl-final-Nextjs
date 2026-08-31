import axiosApi from "./axiosApi";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_DECORATION_CAT_ITEM,
  API_SUCCESS_CODE,
} from "./apiconstants";
import {
  getSubCategory,
  decorateCatalogueItem,
} from "./decorationCatHelpers";

export async function fetchDecorationCatPageData(catValue, options = {}) {
  const { theme, page = 1, limit = 30 } = options;

  if (!catValue) {
    return {
      catId: null,
      catalogueData: [],
      hasMore: false,
    };
  }

  const subCategory = getSubCategory(catValue);
  if (!subCategory) {
    return {
      catId: null,
      catalogueData: [],
      hasMore: false,
    };
  }

  const catIdResponse = await axiosApi.get(
    BASE_URL + GET_DECORATION_CAT_ID + subCategory
  );
  const catId = catIdResponse.data.data?._id;

  if (!catId) {
    return {
      catId: null,
      catalogueData: [],
      hasMore: false,
    };
  }

  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("page", String(page));

  if (theme && theme !== "all") {
    params.set("theme", theme);
  }

  const apiUrl = `${BASE_URL + GET_DECORATION_CAT_ITEM}v3/${catId}?${params.toString()}`;
  const itemsResponse = await axiosApi.get(apiUrl);

  if (itemsResponse.status !== API_SUCCESS_CODE) {
    return {
      catId,
      catalogueData: [],
      hasMore: false,
    };
  }

  const catalogueData = (itemsResponse.data.data || []).map(decorateCatalogueItem);
  const totalPages = itemsResponse.data.pagination?.totalPages || 1;

  return {
    catId,
    catalogueData,
    hasMore: page < totalPages,
  };
}
