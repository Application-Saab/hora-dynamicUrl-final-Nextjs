import cityData from "@/utils/cityData";

export const slugToCityName = {
  delhi: "Delhi",
  mumbai: "Mumbai",
  bangalore: "Bangalore",
  noida: "Noida",
  ghaziabad: "Ghaziabad",
  gurugram: "Gurgaon",
  faridabad: "Faridabad",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
  kolkata: "Kolkata",
  lucknow: "Lucknow",
  kanpur: "Kanpur",
  indore: "Indore",
  surat: "Surat",
  bhopal: "Bhopal",
  goa: "Goa",
  pune: "Pune",
  others: "Others",
};

export const validCitySlugs = Object.keys(slugToCityName);

/**
 * Convert locality name to URL slug
 *
 * Example:
 * "Adarsh Nagar"       -> "adarsh-nagar"
 * "Bandra Kurla Complex" -> "bandra-kurla-complex"
 */
export const slugifyLocality = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Check whether city slug is valid
 */
export const isValidCitySlug = (citySlug) => {
  if (!citySlug) return false;

  const slug = citySlug.toString().trim().toLowerCase();

  if(slug === 'others') {
    return Boolean(slugToCityName[slug]);
  }else {
    return Boolean(slugToCityName[slug] && cityData[slug]);
  }

};

/**
 * Get city name from slug
 */
export const getCityNameFromSlug = (citySlug) => {
  if (!citySlug) return "";

  const slug = citySlug.toString().trim().toLowerCase();

  return slugToCityName[slug] || "";
};

/**
 * Get locality list of a city
 */
export const getCityLocalities = (citySlug) => {
  if (!citySlug) return [];

  const slug = citySlug.toString().trim().toLowerCase();

  return cityData[slug]?.cityLocalitiesList || [];
};

/**
 * Get valid locality slugs for a city
 */
export const getValidLocalitySlugs = (citySlug) => {
  const localities = getCityLocalities(citySlug);

  return localities
    .map((item) => slugifyLocality(item?.name))
    .filter(Boolean);
};

/**
 * Check whether locality belongs to the given city
 */
export const isValidLocalitySlug = (citySlug, localitySlug) => {
  if (!citySlug || !localitySlug) return false;

  const city = citySlug.toString().trim().toLowerCase();
  const locality = localitySlug.toString().trim().toLowerCase();

  if (!isValidCitySlug(city)) {
    return false;
  }

  const validLocalitySlugs = getValidLocalitySlugs(city);

  return validLocalitySlugs.includes(locality);
};

/**
 * Validate city + locality together
 */
export const validateCityLocality = (citySlug, localitySlug) => {
  const city = citySlug?.toString().trim().toLowerCase();
  const locality = localitySlug?.toString().trim().toLowerCase();

  if (!isValidCitySlug(city)) {
    return {
      valid: false,
      reason: "INVALID_CITY",
    };
  }

  if (!isValidLocalitySlug(city, locality)) {
    return {
      valid: false,
      reason: "INVALID_LOCALITY",
    };
  }

  return {
    valid: true,
    citySlug: city,
    cityName: getCityNameFromSlug(city),
    localitySlug: locality,
  };
};