import { allCategoryContent } from "./AllCategoryDescriptions";

export const decorationCategoryContent = {
  ...allCategoryContent,
};

export function getCategoryContent(catValue) {
  if (!catValue) return null;
  const key = catValue.toLowerCase();
  return decorationCategoryContent[key] || null;
}
