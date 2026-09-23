const folderToSubCategory = {
  "Wedding":                    "wedding-photography",
  "maternity poses":            "maternity-photography",
  "Candid":                     "birthday-photography",
  "pre wedding":                "engagement-photography",
  "HaldiandMehendi":            "wedding-photography",
  "baby shower":                "baby-shower-photography",
  "naming ceremony weblink":    "naming-ceremony-photography",
  "new born ":                  "new-born-baby-photography",
  "engagement weblink":         "engagement-photography",
  "anniversary poses web link": "anniversary-photography",
  "House warming weblink":      "house-warming-photography",
  "bacherrolerate":             "bachelorette-photography",
  "corporatePoselink":          "corporate-photography",
  "welcomeBaby_poseLink":       "welcome-baby-photography"
};

export const getWeblinkPhotosUrl = (folderName) => {
  const subCategory = folderToSubCategory[folderName];
  if (!subCategory) return "/photography"; // fallback
  return `/photography-page/${subCategory}`;
};