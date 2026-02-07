export const getCategorySlugFromPath = (pathname, city = "", locality = "") => {
  if (!pathname) return "";

  const parts = pathname.split("?")[0].split("/").filter(Boolean);

  let startIndex = 0;
  if (city && locality) startIndex = 2; // /city/locality/...
  else if (city) startIndex = 1;        // /city/...

  // find the first segment that is NOT "product"
  for (let i = startIndex; i < parts.length; i++) {
    if (parts[i] !== "product") {
      return parts[i];
    }
  }

  return "";
};
