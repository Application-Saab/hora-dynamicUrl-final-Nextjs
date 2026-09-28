const folderToSubCategory = {
  Wedding: "wedding-photography",
  "maternity poses": "maternity-photography",
  Candid: "birthday-photography",
  "pre wedding": "engagement-photography",
  HaldiandMehendi: "wedding-photography",
  "baby shower": "baby-shower-photography",
  "naming ceremony weblink": "naming-ceremony-photography",
  "new born ": "new-born-baby-photography",
  "engagement weblink": "engagement-photography",
  "anniversary poses web link": "anniversary-photography",
  "House warming weblink": "house-warming-photography",
  bacherrolerate: "bachelorette-photography",
  corporatePoselink: "corporate-photography",
  welcomeBaby_poseLink: "welcome-baby-photography",
};

export const getWeblinkPhotosUrl = (folderName) => {
  const subCategory = folderToSubCategory[folderName];
  if (!subCategory) return "/photography"; // fallback
  return `/photography/${subCategory}`;
};

export const categoryNameToSlug = {
  "Engagement-Photography": "engagement-photography",
  "Wedding-Photography": "wedding-photography",
  "Anniversary-Photography": "anniversary-photography",
  "Birthday-Photography": "birthday-photography",
  "House-warming-Photography": "house-warming-photography",
  "Naming-ceremony-Photography": "naming-ceremony-photography",
  "Baby-Shower-Photography": "baby-shower-photography",
  "Bachelorette-Photography": "bachelorette-photography",
  "Maternity-Photography": "maternity-photography",
  "New-Born-Baby-Photography": "new-born-baby-photography",
  "Wedding-Photography": "wedding-photography",
  // "haldi-mehndi": "Wedding-Photography",
  // wedding: "Wedding-Photography",
  "Corporate-Photography": "corporate-photography",
  "Welcome-Baby-Photography": "welcome-baby-photography",
};
