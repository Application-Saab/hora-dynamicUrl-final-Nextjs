import { fetchWithError } from "@/utils/fetchWithError";
import { BASE_URL, VENUE_LOCALITIES_LIST } from "../utils/apiconstants";

export const getVenueLocalitiesList = async (cityName) => {
  try {
    const params = new URLSearchParams({ city: cityName });
    const url = `${BASE_URL}${VENUE_LOCALITIES_LIST}?${params.toString()}`;

    const response = await fetchWithError(url);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    let json = await response.json();
    return json?.data || [];
} catch (error) {
    console.error("get venue locality error:", error);
    throw error;
  }
};