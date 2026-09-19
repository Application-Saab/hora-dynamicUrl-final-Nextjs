import { birthdayDecorationDescription } from "./Birthdaydecorationdescription";
import { birthdayDecorationFAQData } from "./Birthdaydecorationfaq";

export const decorationCategoryContent = {
  "birthday-decoration": {
    description: birthdayDecorationDescription,
    faqData: birthdayDecorationFAQData,
  },
  
};

export function getCategoryContent(catValue) {
  if (!catValue) return null;
  const key = catValue.toLowerCase();
  return decorationCategoryContent[key] || null;
}