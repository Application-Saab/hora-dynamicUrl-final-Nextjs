// export const slugToCityName = {
//   delhi: "Delhi",
//   mumbai: "Mumbai",
//   bangalore: "Bangalore",
//   noida: "Noida",
//   ghaziabad: "Ghaziabad",
//   gurugram: "Gurgaon",
//   faridabad: "Faridabad",
//   hyderabad: "Hyderabad",
//   chennai: "Chennai",
//   kolkata: "Kolkata",
//   lucknow: "Lucknow",
//   kanpur: "Kanpur",
//   indore: "Indore",
//   surat: "Surat",
//   bhopal: "Bhopal",
//   goa: "Goa",
//   pune: "Pune",
//   others: "Others",
// };

// export const validCitySlugs = Object.keys(slugToCityName);


// utils/validCities.js

// import cityData from "./cityData";

// export const slugToCityName = {
//   delhi: "Delhi",
//   mumbai: "Mumbai",
//   bangalore: "Bangalore",
//   noida: "Noida",
//   ghaziabad: "Ghaziabad",
//   gurugram: "Gurgaon",
//   faridabad: "Faridabad",
//   hyderabad: "Hyderabad",
//   chennai: "Chennai",
//   kolkata: "Kolkata",
//   lucknow: "Lucknow",
//   kanpur: "Kanpur",
//   indore: "Indore",
//   surat: "Surat",
//   bhopal: "Bhopal",
//   goa: "Goa",
//   pune: "Pune",
//   others: "Others",
// };

// export const validCitySlugs = Object.keys(slugToCityName);

// /**
//  * Check valid city
//  */
// export const isValidCitySlug = (citySlug) => {
//   if (!citySlug) return false;

//   return validCitySlugs.includes(
//     String(citySlug).trim().toLowerCase()
//   );
// };

// /**
//  * Convert value to URL slug
//  *
//  * Example:
//  * "Bandra West" -> "bandra-west"
//  */
// export const slugify = (value = "") => {
//   return String(value)
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "-");
// };

// /**
//  * Get localities of a city
//  */
// export const getCityLocalities = (citySlug) => {
//   if (!citySlug) return [];

//   const slug = String(citySlug).trim().toLowerCase();

//   const localities = cityData?.[slug]?.cityLocalitiesList;

//   return Array.isArray(localities) ? localities : [];
// };

// /**
//  * Check whether a city has locality support/data
//  */
// export const cityHasLocalities = (citySlug) => {
//   return getCityLocalities(citySlug).length > 0;
// };

// /**
//  * Check whether locality belongs to given city
//  */
// export const isValidLocalitySlug = (
//   citySlug,
//   localitySlug
// ) => {
//   if (!isValidCitySlug(citySlug)) {
//     return false;
//   }

//   if (!localitySlug) {
//     return false;
//   }

//   const localities = getCityLocalities(citySlug);

//   const targetSlug = slugify(localitySlug);

//   return localities.some(
//     (locality) =>
//       slugify(locality?.name) === targetSlug
//   );
// };

// /**
//  * Validate city + locality together
//  */
// export const validateCityLocality = (
//   citySlug,
//   localitySlug
// ) => {
//   const city = String(citySlug || "")
//     .trim()
//     .toLowerCase();

//   const locality = String(localitySlug || "")
//     .trim()
//     .toLowerCase();

//   if (!isValidCitySlug(city)) {
//     return {
//       valid: false,
//       reason: "invalid-city",
//     };
//   }

//   if (!cityHasLocalities(city)) {
//     return {
//       valid: false,
//       reason: "city-has-no-localities",
//     };
//   }

//   if (!isValidLocalitySlug(city, locality)) {
//     return {
//       valid: false,
//       reason: "invalid-locality",
//     };
//   }

//   return {
//     valid: true,
//     city,
//     cityName: slugToCityName[city],
//     locality,
//   };
// };


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

  return Boolean(slugToCityName[slug] && cityData[slug]);
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