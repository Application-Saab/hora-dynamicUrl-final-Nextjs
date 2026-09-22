import { birthdayDecorationDescription } from "./Birthdaydecorationdescription";
import {namingCeremonyDecorationDescription} from "./Namingceremonydecorationdescription"
import { birthdayDecorationFAQData } from "./Birthdaydecorationfaq";
import {namingCeremonyFAQData} from "./NamingCeremonyFAQData"
import { welcomeBabyDecorationDescription } from "./Welcomebabydecorationdescription";
import { welcomeBabyDecorationFAQData } from "./WelcomeBabyDecorationFAQData";
import { babyShowerDecorationDescription } from "./Babyshowerdecorationdescription";
import { babyShowerDecorationFAQData } from "./BabyShowerDecorationFAQData";
import { anniversaryDecorationDescription } from "./Anniversarydecorationdescription";
import { anniversaryDecorationFAQData } from "./Anniversarydecorationdescription";
import { weddingDecorationDescription } from "./Weddingdecorationdescription";
import { weddingDecorationFAQData } from "./WeddingDecorationFAQData";
import { faqData } from "./photographyFAQData";

export const decorationCategoryContent = {
  "birthday-decoration": {
    description: birthdayDecorationDescription,
    faqData: birthdayDecorationFAQData,
  },
  "naming-ceremony-decoration":{
    description:namingCeremonyDecorationDescription,
    faqData:namingCeremonyFAQData,
  },
  "welcome-baby-decoration":{
    description:welcomeBabyDecorationDescription,
    faqData:welcomeBabyDecorationFAQData,
  },
  "baby-shower-decoration":{
    description:babyShowerDecorationDescription,
    faqData:babyShowerDecorationFAQData,
  },
  "anniversary-decoration":{
description:anniversaryDecorationDescription,
faqData:anniversaryDecorationFAQData,
  },
  "wedding":{
    description:weddingDecorationDescription,
    faqData:weddingDecorationFAQData,
  }
};

export function getCategoryContent(catValue) {
  if (!catValue) return null;
  const key = catValue.toLowerCase();
  return decorationCategoryContent[key] || null;
}