import { BASE_URL, GET_MEAL_DISH_ENDPOINT } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

// 🔥 Fetch Meal Types
export const getMealTypes = async (foodType) => {
  try {
    const url = `${BASE_URL}${GET_MEAL_DISH_ENDPOINT}`;

    const requestData = {
      cuisineId: [],
      is_dish: foodType === "non-veg" ? 0 : 1,
    };

    const res = await fetchWithError(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await res.json();

    return result?.data || [];
  } catch (error) {
    console.log("Meal API Error:", error);
    return [];
  }
};

// 🔥 Fetch Packages
export const getPackages = async (packageType, foodType) => {
  try {
    let url = `${BASE_URL}/api/food-Package/getAllFoodPackageList?packageType=${packageType}`;

    if (foodType) {
      url += `&foodType=${foodType}`;
    }

    const res = await fetchWithError(url);
    const result = await res.json();

    return result?.data || [];
  } catch (error) {
    console.log("Package API Error:", error);
    return [];
  }
};