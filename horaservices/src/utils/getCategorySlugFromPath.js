export const getCategorySlugFromPath = (pathname, city = "", locality = "") => {
  if (!pathname) return "";

  const parts = pathname.split("?")[0].split("/").filter(Boolean);

  let startIndex = 0;
  if (city && locality) startIndex = 2;
  else if (city) startIndex = 1;

  // Special handling for Instagram pages
  if (parts[startIndex] === "balloon-decoration-instagram") {
    return parts[startIndex];
  }

  // otherwise, return first non-product segment
  for (let i = startIndex; i < parts.length; i++) {
    if (parts[i] !== "product") return parts[i];
  }

  return "";
};
