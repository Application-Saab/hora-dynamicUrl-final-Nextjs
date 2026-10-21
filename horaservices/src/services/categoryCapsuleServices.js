import { fetchWithError } from "@/utils/fetchWithError";
import { BASE_URL } from "../utils/apiconstants";

export const getImagesbyFolderName = async ({ galleryId, page, limit }) => {
  try {
    const params = new URLSearchParams({ capsuleId: galleryId });

    // Pagination sirf tab bhejo jab dono values ho
    if (page !== undefined && limit !== undefined) {
      params.set("page", String(page));
      params.set("limit", String(limit));
    }

    const url = `${BASE_URL}/api/internal/capsule-thumbnails?${params.toString()}`;

    const response = await fetchWithError(url);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getThumbnails error:", error);
    throw error;
  }
};